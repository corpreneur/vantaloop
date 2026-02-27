import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createIntakeItem,
  listIntakeItems,
  getIntakeItem,
  updateIntakeStatus,
  createRegisterItem,
  listRegisterItems,
  getRegisterItem,
  updateRegisterItem,
  addComment,
  getCommentsByRegisterItem,
  getActiveConversation,
  createSmsConversation,
  updateSmsConversation,
  finalizeSmsConversation,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- Intake (public: anyone on the Vanta team can submit) ----
  intake: router({
    submit: publicProcedure
      .input(z.object({
        submitterName: z.string().min(1),
        feedbackType: z.enum(["concept-direction", "information-architecture", "interaction-pattern", "visual-design", "copy-content", "general"]).default("general"),
        subject: z.string().min(1),
        goalOfShare: z.string().optional(),
        whatsWorking: z.string().optional(),
        questionsRisks: z.string().optional(),
        suggestions: z.string().optional(),
        decisionNeeded: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createIntakeItem({
          ...input,
          channel: "web",
          goalOfShare: input.goalOfShare ?? null,
          whatsWorking: input.whatsWorking ?? null,
          questionsRisks: input.questionsRisks ?? null,
          suggestions: input.suggestions ?? null,
          decisionNeeded: input.decisionNeeded ?? null,
        });
        return { id, success: true };
      }),

    list: publicProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return listIntakeItems(input?.status);
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getIntakeItem(input.id);
      }),

    triage: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["under-review", "promoted", "dismissed"]),
        triageNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const triagedBy = ctx.user.name ?? "Unknown";
        await updateIntakeStatus(input.id, input.status, triagedBy, input.triageNotes);

        // If promoted, create a register item
        if (input.status === "promoted") {
          const item = await getIntakeItem(input.id);
          if (item) {
            await createRegisterItem({
              intakeItemId: item.id,
              title: item.subject,
              feedbackType: item.feedbackType,
              goalOfShare: item.goalOfShare,
              whatsWorking: item.whatsWorking,
              questionsRisks: item.questionsRisks,
              suggestions: item.suggestions,
              decisionNeeded: item.decisionNeeded,
              promotedBy: triagedBy,
              promotedAt: new Date(),
            });
          }
        }

        return { success: true };
      }),
  }),

  // ---- Register (protected: only William and Sue) ----
  register: router({
    list: protectedProcedure
      .input(z.object({ columnStatus: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return listRegisterItems(input?.columnStatus);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const item = await getRegisterItem(input.id);
        const itemComments = item ? await getCommentsByRegisterItem(input.id) : [];
        return { item, comments: itemComments };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        priority: z.enum(["P0", "P1", "P2", "P3"]).optional(),
        columnStatus: z.enum(["backlog", "in-progress", "resolved", "archived"]).optional(),
        assignee: z.string().optional(),
        epicId: z.string().optional(),
        decision: z.string().optional(),
        decisionRationale: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateRegisterItem(id, data);
        return { success: true };
      }),

    addComment: protectedProcedure
      .input(z.object({
        registerItemId: z.number(),
        text: z.string().min(1),
        authorTeam: z.enum(["Vanta", "Metalab"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await addComment({
          registerItemId: input.registerItemId,
          authorName: ctx.user.name ?? "Unknown",
          authorTeam: input.authorTeam,
          text: input.text,
        });
        return { id, success: true };
      }),
  }),

  // ---- SMS webhook (public endpoint for Twilio) ----
  sms: router({
    webhook: publicProcedure
      .input(z.object({
        From: z.string(),
        Body: z.string(),
      }))
      .mutation(async ({ input }) => {
        const phone = input.From;
        const body = input.Body.trim();

        // Get or create conversation
        let conv = await getActiveConversation(phone);
        if (!conv) {
          const id = await createSmsConversation(phone);
          conv = { id, phoneNumber: phone, currentStep: "awaiting-name" as const, partialData: {}, finalized: 0, createdAt: new Date(), updatedAt: new Date() };
        }

        const partial = (conv.partialData as Record<string, string>) ?? {};
        let responseText = "";
        let nextStep = conv.currentStep;

        switch (conv.currentStep) {
          case "awaiting-name":
            partial.submitterName = body;
            nextStep = "awaiting-subject";
            responseText = "Thanks! What is the subject of your feedback?";
            break;
          case "awaiting-subject":
            partial.subject = body;
            nextStep = "awaiting-type";
            responseText = "Got it. What type? Reply with a number:\n1. Concept Direction\n2. Information Architecture\n3. Interaction Pattern\n4. Visual Design\n5. Copy/Content\n6. General";
            break;
          case "awaiting-type": {
            const typeMap: Record<string, string> = {
              "1": "concept-direction", "2": "information-architecture",
              "3": "interaction-pattern", "4": "visual-design",
              "5": "copy-content", "6": "general",
            };
            partial.feedbackType = typeMap[body] ?? "general";
            nextStep = "awaiting-goal";
            responseText = "What is the goal of this share? (What decision do you need?)";
            break;
          }
          case "awaiting-goal":
            partial.goalOfShare = body;
            nextStep = "awaiting-working";
            responseText = "What is working well? (Or reply SKIP)";
            break;
          case "awaiting-working":
            if (body.toUpperCase() !== "SKIP") partial.whatsWorking = body;
            nextStep = "awaiting-risks";
            responseText = "Any questions or risks? (Or reply SKIP)";
            break;
          case "awaiting-risks":
            if (body.toUpperCase() !== "SKIP") partial.questionsRisks = body;
            nextStep = "awaiting-suggestions";
            responseText = "Any suggestions? (Or reply SKIP)";
            break;
          case "awaiting-suggestions":
            if (body.toUpperCase() !== "SKIP") partial.suggestions = body;
            nextStep = "awaiting-decision";
            responseText = "What decision is needed today? (Or reply SKIP)";
            break;
          case "awaiting-decision":
            if (body.toUpperCase() !== "SKIP") partial.decisionNeeded = body;
            nextStep = "complete";

            // Create the intake item
            await createIntakeItem({
              submitterName: partial.submitterName ?? "Unknown",
              channel: "sms",
              phoneNumber: phone,
              feedbackType: (partial.feedbackType as any) ?? "general",
              subject: partial.subject ?? "SMS Feedback",
              goalOfShare: partial.goalOfShare ?? null,
              whatsWorking: partial.whatsWorking ?? null,
              questionsRisks: partial.questionsRisks ?? null,
              suggestions: partial.suggestions ?? null,
              decisionNeeded: partial.decisionNeeded ?? null,
            });

            await finalizeSmsConversation(conv.id);
            responseText = "Feedback submitted. Thank you! Text again anytime to start a new submission.";
            break;
          default:
            responseText = "Welcome to VantaLoop feedback. Reply with your name to start.";
            nextStep = "awaiting-name";
        }

        if (nextStep !== "complete") {
          await updateSmsConversation(conv.id, nextStep, partial);
        }

        return { response: responseText };
      }),
  }),
});

export type AppRouter = typeof appRouter;
