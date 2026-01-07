import { nanoid } from "nanoid";
import { z } from "zod";

import { SEED_DB } from "@/lib/mock/seed";
import type { DemoDb } from "@/lib/demoDbTypes";

const STORAGE_KEY = "matching_demo_db_v1";

const DemoDbSchema: z.ZodType<DemoDb> = z.object({
  schemaVersion: z.literal(1),
  users: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["company", "student", "admin"]),
        email: z.string(),
        name: z.string(),
        password: z.string(),
        createdAt: z.string(),
        status: z.enum(["active", "disabled"]),
      }),
    )
    .default([]),
  keywords: z
    .array(
      z.object({ id: z.string(), name: z.string(), category: z.string().optional() }),
    )
    .default([]),
  profiles: z
    .array(
      z.object({
        userId: z.string(),
        keywords: z.array(z.string()).default([]),
        intro: z.string().default(""),
        avatarUrl: z.string().optional(),
        updatedAt: z.string(),
      }),
    )
    .default([]),
  matchRequests: z
    .array(
      z.object({
        id: z.string(),
        companyId: z.string(),
        studentId: z.string(),
        keywordsSnapshot: z.array(z.string()).default([]),
        message: z.string().default(""),
        status: z.enum(["pending", "approved", "rejected"]),
        createdAt: z.string(),
      }),
    )
    .default([]),
  notificationLogs: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["email", "admin"]),
        to: z.string(),
        subject: z.string(),
        payload: z.record(z.string(), z.unknown()),
        createdAt: z.string(),
      }),
    )
    .default([]),
  auditLogs: z
    .array(
      z.object({
        id: z.string(),
        level: z.enum(["info", "warn", "error"]),
        message: z.string(),
        createdAt: z.string(),
        meta: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .default([]),
});

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStorageKey() {
  return STORAGE_KEY;
}

export function loadDb(): DemoDb {
  if (!isBrowser()) return SEED_DB;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return SEED_DB;

  try {
    const parsed = JSON.parse(raw);
    const res = DemoDbSchema.safeParse(parsed);
    if (!res.success) return SEED_DB;
    return res.data;
  } catch {
    return SEED_DB;
  }
}

export function saveDb(db: DemoDb) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function initDb() {
  if (!isBrowser()) return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveDb(SEED_DB);
    return;
  }
  // validate existing data; fallback to seed if broken
  try {
    const parsed = JSON.parse(raw);
    const res = DemoDbSchema.safeParse(parsed);
    if (!res.success) saveDb(SEED_DB);
  } catch {
    saveDb(SEED_DB);
  }
}

export function resetDb() {
  saveDb(SEED_DB);
}

export function updateDb(updater: (db: DemoDb) => DemoDb) {
  const next = updater(loadDb());
  saveDb(next);
  return next;
}

export function nowIso() {
  return new Date().toISOString();
}

export function makeId(prefix: string) {
  return `${prefix}_${nanoid(8)}`;
}


