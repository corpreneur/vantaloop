import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, intakeItems, registerItems, comments, smsConversations, type InsertIntakeItem, type InsertRegisterItem, type InsertComment, type InsertSmsConversation } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ---- Intake Items ----

export async function createIntakeItem(item: InsertIntakeItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  const weekNum = getISOWeek(now);
  const weekId = `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
  const result = await db.insert(intakeItems).values({ ...item, weekId });
  return result[0].insertId;
}

export async function listIntakeItems(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(intakeItems).where(eq(intakeItems.status, status as any)).orderBy(desc(intakeItems.createdAt));
  }
  return db.select().from(intakeItems).orderBy(desc(intakeItems.createdAt));
}

export async function getIntakeItem(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(intakeItems).where(eq(intakeItems.id, id)).limit(1);
  return result[0];
}

export async function updateIntakeStatus(id: number, status: string, triagedBy: string, triageNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(intakeItems).set({
    status: status as any,
    triagedBy,
    triagedAt: new Date(),
    triageNotes: triageNotes ?? null,
  }).where(eq(intakeItems.id, id));
}

// ---- Register Items ----

export async function createRegisterItem(item: InsertRegisterItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(registerItems).values(item);
  return result[0].insertId;
}

export async function listRegisterItems(columnStatus?: string) {
  const db = await getDb();
  if (!db) return [];
  if (columnStatus) {
    return db.select().from(registerItems).where(eq(registerItems.columnStatus, columnStatus as any)).orderBy(desc(registerItems.createdAt));
  }
  return db.select().from(registerItems).orderBy(desc(registerItems.createdAt));
}

export async function getRegisterItem(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(registerItems).where(eq(registerItems.id, id)).limit(1);
  return result[0];
}

export async function updateRegisterItem(id: number, data: Partial<InsertRegisterItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(registerItems).set(data).where(eq(registerItems.id, id));
}

// ---- Comments ----

export async function addComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(comments).values(comment);
  return result[0].insertId;
}

export async function getCommentsByRegisterItem(registerItemId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.registerItemId, registerItemId)).orderBy(comments.createdAt);
}

// ---- SMS Conversations ----

export async function getActiveConversation(phoneNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(smsConversations)
    .where(eq(smsConversations.phoneNumber, phoneNumber))
    .orderBy(desc(smsConversations.createdAt))
    .limit(1);
  const conv = result[0];
  if (conv && conv.finalized === 0) return conv;
  return undefined;
}

export async function createSmsConversation(phoneNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(smsConversations).values({ phoneNumber, partialData: {} });
  return result[0].insertId;
}

export async function updateSmsConversation(id: number, step: string, partialData: Record<string, string>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(smsConversations).set({
    currentStep: step as any,
    partialData,
  }).where(eq(smsConversations.id, id));
}

export async function finalizeSmsConversation(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(smsConversations).set({
    finalized: 1,
    currentStep: "complete" as any,
  }).where(eq(smsConversations.id, id));
}

// ---- Helpers ----

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
