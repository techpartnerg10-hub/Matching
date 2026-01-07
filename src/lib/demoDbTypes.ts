export type Role = "company" | "student" | "admin";
export type UserStatus = "active" | "disabled";
export type MatchStatus = "pending" | "approved" | "rejected";
export type NotificationType = "email" | "admin";
export type AuditLevel = "info" | "warn" | "error";

export type User = {
  id: string;
  role: Role;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  status: UserStatus;
};

export type Keyword = {
  id: string;
  name: string;
  category?: string;
};

export type Profile = {
  userId: string;
  keywords: string[]; // keyword ids
  intro: string;
  avatarUrl?: string;
  updatedAt: string;
};

export type MatchRequest = {
  id: string;
  companyId: string;
  studentId: string;
  keywordsSnapshot: string[]; // keyword ids
  message: string;
  status: MatchStatus;
  createdAt: string;
};

export type NotificationLog = {
  id: string;
  type: NotificationType;
  to: string;
  subject: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  level: AuditLevel;
  message: string;
  createdAt: string;
  meta?: Record<string, unknown>;
};

export type DemoDb = {
  schemaVersion: 1;
  users: User[];
  keywords: Keyword[];
  profiles: Profile[];
  matchRequests: MatchRequest[];
  notificationLogs: NotificationLog[];
  auditLogs: AuditLog[];
};


