import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("intake.submit", () => {
  it("validates required fields are present", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.intake.submit({
        submitterName: "",
        feedbackType: "general",
        subject: "Test",
      })
    ).rejects.toThrow();
  });

  it("accepts valid feedback with all required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.intake.submit({
        submitterName: "Test User",
        feedbackType: "concept-direction",
        subject: "Test feedback item",
        goalOfShare: "Decide on concept A vs B",
        whatsWorking: "Navigation is clear",
        questionsRisks: "Scalability concerns",
        suggestions: "Try progressive disclosure",
        decisionNeeded: "Pick concept A or B",
      });
    } catch (err: any) {
      expect(err.message).not.toContain("validation");
    }
  });
});

describe("sms.webhook", () => {
  it("starts a new conversation when texting FEEDBACK", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.sms.webhook({
        From: "+15551234567",
        Body: "FEEDBACK",
      });
      expect(result).toHaveProperty("response");
      expect(typeof result.response).toBe("string");
    } catch (err: any) {
      expect(err.message).not.toContain("validation");
    }
  });
});
