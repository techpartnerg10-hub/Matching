import type { MatchStatus, Role } from "@/lib/demoDbTypes";
import type { DemoDb, Profile } from "@/lib/demoDbTypes";
import { loadDb, saveDb, makeId, nowIso } from "@/lib/storage";

export function getDbSnapshot(): DemoDb {
  return loadDb();
}

export function saveDbSnapshot(db: DemoDb) {
  saveDb(db);
}

export function getUserById(db: DemoDb, userId: string) {
  return db.users.find((u) => u.id === userId) ?? null;
}

export function getProfileByUserId(db: DemoDb, userId: string): Profile {
  const p = db.profiles.find((x) => x.userId === userId);
  if (p) return p;
  const created: Profile = { userId, keywords: [], intro: "", updatedAt: nowIso() };
  db.profiles.unshift(created);
  return created;
}

export function updateProfile(params: {
  userId: string;
  keywords: string[];
  intro: string;
  avatarUrl?: string;
}) {
  const db = loadDb();
  const profile = getProfileByUserId(db, params.userId);
  profile.keywords = Array.from(new Set(params.keywords));
  profile.intro = params.intro;
  if (params.avatarUrl !== undefined) profile.avatarUrl = params.avatarUrl;
  profile.updatedAt = nowIso();
  saveDb(db);
}

export function getKeywordName(db: DemoDb, keywordId: string) {
  return db.keywords.find((k) => k.id === keywordId)?.name ?? keywordId;
}

export function listUsersByRole(db: DemoDb, role: Role) {
  return db.users.filter((u) => u.role === role);
}

export function searchStudents(params: {
  keywordIds: string[];
  mode: "all" | "any";
}) {
  const db = loadDb();
  const students = db.users.filter((u) => u.role === "student" && u.status === "active");
  const keywordSet = new Set(params.keywordIds);

  const results = students
    .map((u) => {
      const p = getProfileByUserId(db, u.id);
      const matches = p.keywords.filter((k) => keywordSet.has(k));
      const ok =
        params.keywordIds.length === 0
          ? true
          : params.mode === "all"
            ? matches.length === keywordSet.size
            : matches.length > 0;
      return { user: u, profile: p, matches, ok };
    })
    .filter((x) => x.ok)
    .sort((a, b) => b.matches.length - a.matches.length);

  return { db, results };
}

export function createMatchRequest(params: {
  companyId: string;
  studentId: string;
  keywordsSnapshot: string[];
  message: string;
}): { id: string } {
  const db = loadDb();
  const id = makeId("mr");
  db.matchRequests.unshift({
    id,
    companyId: params.companyId,
    studentId: params.studentId,
    keywordsSnapshot: params.keywordsSnapshot,
    message: params.message,
    status: "pending",
    createdAt: nowIso(),
  });

  const company = db.users.find((u) => u.id === params.companyId);
  const student = db.users.find((u) => u.id === params.studentId);
  db.notificationLogs.unshift({
    id: makeId("nl"),
    type: "email",
    to: "admin@demo.com",
    subject: `[매칭요청] ${company?.name ?? "기업"} → ${student?.name ?? "학생"}`,
    payload: { matchRequestId: id },
    createdAt: nowIso(),
  });

  saveDb(db);
  return { id };
}

export function setMatchRequestStatus(params: { id: string; status: MatchStatus }) {
  const db = loadDb();
  const mr = db.matchRequests.find((x) => x.id === params.id);
  if (!mr) return;
  mr.status = params.status;

  db.notificationLogs.unshift({
    id: makeId("nl"),
    type: "admin",
    to: "admin@demo.com",
    subject: `[${params.status}] 요청 상태 변경`,
    payload: { matchRequestId: params.id, status: params.status },
    createdAt: nowIso(),
  });

  saveDb(db);
}

export function getCompanyMatchRequests(companyId: string) {
  const db = loadDb();
  const items = db.matchRequests.filter((x) => x.companyId === companyId);
  return { db, items };
}

export function getStudentMatchRequests(studentId: string) {
  const db = loadDb();
  const items = db.matchRequests.filter((x) => x.studentId === studentId);
  return { db, items };
}

export function deleteUser(userId: string) {
  const db = loadDb();
  db.users = db.users.filter((u) => u.id !== userId);
  db.profiles = db.profiles.filter((p) => p.userId !== userId);
  db.matchRequests = db.matchRequests.filter(
    (mr) => mr.companyId !== userId && mr.studentId !== userId,
  );
  db.notificationLogs.unshift({
    id: makeId("nl"),
    type: "admin",
    to: "admin@demo.com",
    subject: "[계정삭제] 사용자 삭제됨",
    payload: { userId },
    createdAt: nowIso(),
  });
  saveDb(db);
}

export function setUserStatus(params: { userId: string; status: "active" | "disabled" }) {
  const db = loadDb();
  const u = db.users.find((x) => x.id === params.userId);
  if (!u) return;
  u.status = params.status;
  db.auditLogs.unshift({
    id: makeId("al"),
    level: "info",
    message: "회원 상태 변경",
    createdAt: nowIso(),
    meta: { userId: params.userId, status: params.status },
  });
  saveDb(db);
}

export function addKeyword(name: string) {
  const db = loadDb();
  const trimmed = name.trim();
  if (!trimmed) return { ok: false as const, error: "키워드명을 입력해 주세요." };
  if (db.keywords.some((k) => k.name.toLowerCase() === trimmed.toLowerCase())) {
    return { ok: false as const, error: "이미 존재하는 키워드입니다." };
  }
  const id = makeId("k");
  db.keywords.unshift({ id, name: trimmed });
  db.auditLogs.unshift({
    id: makeId("al"),
    level: "info",
    message: "키워드 추가",
    createdAt: nowIso(),
    meta: { id, name: trimmed },
  });
  saveDb(db);
  return { ok: true as const, id };
}

export function updateKeyword(params: { id: string; name: string }) {
  const db = loadDb();
  const k = db.keywords.find((x) => x.id === params.id);
  if (!k) return { ok: false as const, error: "키워드를 찾을 수 없습니다." };
  const trimmed = params.name.trim();
  if (!trimmed) return { ok: false as const, error: "키워드명을 입력해 주세요." };
  k.name = trimmed;
  db.auditLogs.unshift({
    id: makeId("al"),
    level: "info",
    message: "키워드 수정",
    createdAt: nowIso(),
    meta: { id: params.id, name: trimmed },
  });
  saveDb(db);
  return { ok: true as const };
}

export function deleteKeyword(id: string) {
  const db = loadDb();
  db.keywords = db.keywords.filter((k) => k.id !== id);
  db.profiles.forEach((p) => {
    p.keywords = p.keywords.filter((x) => x !== id);
  });
  db.matchRequests.forEach((mr) => {
    mr.keywordsSnapshot = mr.keywordsSnapshot.filter((x) => x !== id);
  });
  db.auditLogs.unshift({
    id: makeId("al"),
    level: "warn",
    message: "키워드 삭제",
    createdAt: nowIso(),
    meta: { id },
  });
  saveDb(db);
}

export function getKeywordUsageCounts(db: DemoDb) {
  const counts: Record<string, number> = {};
  db.profiles.forEach((p) => {
    p.keywords.forEach((k) => {
      counts[k] = (counts[k] ?? 0) + 1;
    });
  });
  return counts;
}

export function getAdminStats() {
  const db = loadDb();
  const companies = db.users.filter((u) => u.role === "company").length;
  const students = db.users.filter((u) => u.role === "student").length;
  const admins = db.users.filter((u) => u.role === "admin").length;
  const requests = db.matchRequests.length;
  const pending = db.matchRequests.filter((x) => x.status === "pending").length;
  const approved = db.matchRequests.filter((x) => x.status === "approved").length;
  const rejected = db.matchRequests.filter((x) => x.status === "rejected").length;

  const usage = getKeywordUsageCounts(db);
  const topKeywords = Object.entries(usage)
    .map(([id, count]) => ({
      id,
      name: getKeywordName(db, id),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    db,
    counts: { companies, students, admins, requests, pending, approved, rejected },
    topKeywords,
  };
}


