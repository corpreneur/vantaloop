import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Weekly Intake Items
 * Raw feedback submitted by Vanta team members via web form or SMS.
 * These are unfiltered submissions that William and Sue triage.
 */
export const intakeItems = mysqlTable("intake_items", {
  id: int("id").autoincrement().primaryKey(),
  /** Name of the person submitting feedback */
  submitterName: varchar("submitterName", { length: 255 }).notNull(),
  /** Channel: "web" or "sms" */
  channel: mysqlEnum("channel", ["web", "sms"]).notNull(),
  /** Phone number if submitted via SMS */
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  /** Feedback type tag */
  feedbackType: mysqlEnum("feedbackType", [
    "concept-direction",
    "information-architecture",
    "interaction-pattern",
    "visual-design",
    "copy-content",
    "general",
  ]).default("general").notNull(),
  /** Subject line */
  subject: varchar("subject", { length: 500 }).notNull(),
  /** Goal of this share */
  goalOfShare: text("goalOfShare"),
  /** What is working */
  whatsWorking: text("whatsWorking"),
  /** Questions or risks */
  questionsRisks: text("questionsRisks"),
  /** Suggestions */
  suggestions: text("suggestions"),
  /** Decision needed */
  decisionNeeded: text("decisionNeeded"),
  /** Triage status */
  status: mysqlEnum("status", ["new", "under-review", "promoted", "dismissed"]).default("new").notNull(),
  /** Who triaged this item */
  triagedBy: varchar("triagedBy", { length: 255 }),
  /** When it was triaged */
  triagedAt: timestamp("triagedAt"),
  /** Triage notes */
  triageNotes: text("triageNotes"),
  /** Week identifier (e.g. "2026-W09") */
  weekId: varchar("weekId", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IntakeItem = typeof intakeItems.$inferSelect;
export type InsertIntakeItem = typeof intakeItems.$inferInsert;

/**
 * Formal Register Items
 * Curated, actionable feedback promoted from the intake by William and Sue.
 * This is the canonical record of design feedback.
 */
export const registerItems = mysqlTable("register_items", {
  id: int("id").autoincrement().primaryKey(),
  /** Link back to the original intake item */
  intakeItemId: int("intakeItemId"),
  /** Title for the register entry */
  title: varchar("title", { length: 500 }).notNull(),
  /** Epic association */
  epicId: varchar("epicId", { length: 20 }),
  /** Priority */
  priority: mysqlEnum("priority", ["P0", "P1", "P2", "P3"]).default("P2").notNull(),
  /** Feedback type tag */
  feedbackType: mysqlEnum("feedbackType", [
    "concept-direction",
    "information-architecture",
    "interaction-pattern",
    "visual-design",
    "copy-content",
    "general",
  ]).default("general").notNull(),
  /** Kanban column status */
  columnStatus: mysqlEnum("columnStatus", [
    "backlog",
    "in-progress",
    "resolved",
    "archived",
  ]).default("backlog").notNull(),
  /** Assignee name */
  assignee: varchar("assignee", { length: 255 }),
  /** Structured feedback fields (carried from intake, enriched during triage) */
  goalOfShare: text("goalOfShare"),
  whatsWorking: text("whatsWorking"),
  questionsRisks: text("questionsRisks"),
  suggestions: text("suggestions"),
  decisionNeeded: text("decisionNeeded"),
  /** Decision and rationale */
  decision: text("decision"),
  decisionRationale: text("decisionRationale"),
  /** Who promoted this from intake */
  promotedBy: varchar("promotedBy", { length: 255 }),
  promotedAt: timestamp("promotedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RegisterItem = typeof registerItems.$inferSelect;
export type InsertRegisterItem = typeof registerItems.$inferInsert;

/**
 * Comments on register items (threaded discussion)
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  registerItemId: int("registerItemId").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorTeam: mysqlEnum("authorTeam", ["Vanta", "Metalab"]).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * SMS conversation state for multi-turn intake
 */
export const smsConversations = mysqlTable("sms_conversations", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  /** Current step in the conversation flow */
  currentStep: mysqlEnum("currentStep", [
    "awaiting-name",
    "awaiting-subject",
    "awaiting-type",
    "awaiting-goal",
    "awaiting-working",
    "awaiting-risks",
    "awaiting-suggestions",
    "awaiting-decision",
    "complete",
  ]).default("awaiting-name").notNull(),
  /** Partial data collected so far (JSON) */
  partialData: json("partialData"),
  /** Whether this conversation has been finalized into an intake item */
  finalized: int("finalized").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SmsConversation = typeof smsConversations.$inferSelect;
export type InsertSmsConversation = typeof smsConversations.$inferInsert;
