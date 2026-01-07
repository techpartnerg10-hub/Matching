"use client";

import { ClientOnly } from "@/components/common/ClientOnly";
import { loadDb } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSystemPage() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminSystemInner />
    </ClientOnly>
  );
}

function AdminSystemInner() {
  const db = loadDb();
  const admins = db.users.filter((u) => u.role === "admin");
  const audits = db.auditLogs.slice(0, 20);

  const metrics = [
    { label: "서버 상태", value: "Healthy", badge: "green" as const },
    { label: "DB 상태", value: "OK (LocalStorage)", badge: "outline" as const },
    { label: "캐시", value: "N/A", badge: "outline" as const },
    { label: "최근 에러", value: "0", badge: "brand" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">시스템 관리</div>
        <div className="text-sm text-[color:var(--muted)]">
          모니터링/보안/관리자 계정 UI 목업(데모)입니다.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>모니터링</CardTitle>
            <CardDescription>서버/DB/로그 상태</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-sm">{m.label}</div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.badge}>{m.value}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>관리자 계정</CardTitle>
            <CardDescription>권한 관리(목업)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {admins.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{a.name}</div>
                  <div className="text-xs text-[color:var(--muted-2)] truncate">
                    {a.email}
                  </div>
                </div>
                <Badge variant="outline">super-admin</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>감사 로그</span>
            <Badge variant="outline">{db.auditLogs.length}건</Badge>
          </CardTitle>
          <CardDescription>키워드/회원 변경 등의 이벤트가 기록됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {audits.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              로그가 없습니다.
            </div>
          ) : (
            audits.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{a.message}</div>
                  <Badge variant={a.level === "warn" ? "outline" : a.level === "error" ? "brand" : "green"}>
                    {a.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-[color:var(--muted-2)]">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
                {a.meta && (
                  <pre className="mt-2 overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
                    {JSON.stringify(a.meta, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}


