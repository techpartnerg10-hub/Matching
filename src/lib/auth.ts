import type { Role, User } from "@/lib/demoDbTypes";
import { loadDb, saveDb, makeId, nowIso } from "@/lib/storage";

export type Session = {
  userId: string;
  role: Role;
  issuedAt: string;
  expiresAt: string;
};

const SESSION_KEY = "matching_demo_session_v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadSession(): Session | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (!s?.userId || !s?.role || !s?.expiresAt) return null;
    if (new Date(s.expiresAt).getTime() < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const session = loadSession();
  if (!session) return null;
  const db = loadDb();
  const user = db.users.find((u) => u.id === session.userId) ?? null;
  if (!user) return null;
  if (user.status !== "active") return null;
  return user;
}

export function loginWithEmailPassword(params: {
  email: string;
  password: string;
  role?: Role;
}): { ok: true; user: User } | { ok: false; error: string } {
  const db = loadDb();
  const email = params.email.trim().toLowerCase();
  const user = db.users.find((u) => {
    if (params.role && u.role !== params.role) return false;
    return u.email.toLowerCase() === email;
  });

  if (!user) return { ok: false, error: "해당 이메일의 계정을 찾을 수 없어요." };
  if (user.status !== "active") return { ok: false, error: "비활성화된 계정입니다." };
  if (user.password !== params.password)
    return { ok: false, error: "비밀번호가 올바르지 않아요." };

  const issuedAt = nowIso();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(); // 12h
  saveSession({ userId: user.id, role: user.role, issuedAt, expiresAt });
  return { ok: true, user };
}

export function signupDemoUser(params: {
  role: Exclude<Role, "admin">;
  email: string;
  name: string;
  password: string;
}): { ok: true; user: User } | { ok: false; error: string } {
  const db = loadDb();
  const email = params.email.trim().toLowerCase();

  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "이미 가입된 이메일입니다." };
  }

  const user: User = {
    id: makeId(params.role === "company" ? "u_c" : "u_s"),
    role: params.role,
    email,
    name: params.name.trim() || (params.role === "company" ? "새 기업" : "새 학생"),
    password: params.password,
    createdAt: nowIso(),
    status: "active",
  };

  db.users.unshift(user);
  db.profiles.unshift({
    userId: user.id,
    keywords: [],
    intro: "",
    updatedAt: nowIso(),
  });

  saveDb(db);
  return { ok: true, user };
}


