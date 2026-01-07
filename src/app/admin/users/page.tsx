"use client";

import * as React from "react";

import { ClientOnly } from "@/components/common/ClientOnly";
import { deleteUser, setUserStatus } from "@/lib/demoActions";
import { loadDb } from "@/lib/storage";
import type { Role } from "@/lib/demoDbTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminUsersInner />
    </ClientOnly>
  );
}

function AdminUsersInner() {
  const [tab, setTab] = React.useState<Role>("company");
  const [tick, setTick] = React.useState(0);
  void tick;

  const db = loadDb();
  const users = db.users
    .filter((u) => u.role === tab)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function refresh() {
    setTick((x) => x + 1);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">회원 관리</div>
        <div className="text-sm text-[color:var(--muted)]">
          기업/학생 계정을 관리합니다.
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["company", "student"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setTab(r)}
            className={[
              "rounded-full px-3 py-2 text-sm border transition",
              tab === r
                ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/15"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            ].join(" ")}
          >
            {r === "company" ? "기업" : "학생"}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{tab === "company" ? "기업" : "학생"} 회원</span>
            <Badge variant="outline">{users.length}명</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              회원이 없습니다.
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {u.name} · {u.email}
                  </div>
                  <div className="text-xs text-[color:var(--muted-2)]">
                    가입: {new Date(u.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={u.status === "active" ? "green" : "outline"}>
                    {u.status === "active" ? "활성" : "비활성"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setUserStatus({
                        userId: u.id,
                        status: u.status === "active" ? "disabled" : "active",
                      });
                      refresh();
                    }}
                  >
                    상태 토글
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (!confirm("정말 삭제할까요?")) return;
                      deleteUser(u.id);
                      refresh();
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}


