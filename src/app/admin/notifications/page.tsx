"use client";

import { ClientOnly } from "@/components/common/ClientOnly";
import { loadDb } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNotificationsPage() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminNotificationsInner />
    </ClientOnly>
  );
}

function AdminNotificationsInner() {
  const db = loadDb();
  const logs = db.notificationLogs;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">알림/메일 발송 내역</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>로그</span>
            <Badge variant="outline">{logs.length}건</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              로그가 없습니다.
            </div>
          ) : (
            logs.map((l) => (
              <div
                key={l.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{l.subject}</div>
                    <div className="text-xs text-[color:var(--muted-2)]">
                      to: {l.to} · {new Date(l.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={l.type === "email" ? "brand" : "outline"}>
                    {l.type === "email" ? "메일" : "관리자"}
                  </Badge>
                </div>
                <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
                  {JSON.stringify(l.payload, null, 2)}
                </pre>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}


