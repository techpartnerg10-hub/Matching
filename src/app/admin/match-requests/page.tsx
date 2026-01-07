"use client";

import * as React from "react";
import { toast } from "sonner";

import { ClientOnly } from "@/components/common/ClientOnly";
import { getUserById, setMatchRequestStatus } from "@/lib/demoActions";
import { loadDb } from "@/lib/storage";
import type { MatchStatus } from "@/lib/demoDbTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMatchRequestsPage() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminMatchRequestsInner />
    </ClientOnly>
  );
}

function statusBadge(status: MatchStatus) {
  if (status === "approved") return <Badge variant="green">승인</Badge>;
  if (status === "rejected") return <Badge variant="outline">반려</Badge>;
  return <Badge variant="brand">대기</Badge>;
}

function AdminMatchRequestsInner() {
  const [tick, setTick] = React.useState(0);
  void tick;
  const db = loadDb();
  const items = db.matchRequests;

  function refresh() {
    setTick((x) => x + 1);
  }

  function setStatus(id: string, status: MatchStatus) {
    setMatchRequestStatus({ id, status });
    toast.success("상태 변경 완료");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">매칭 요청 관리</div>
        <div className="text-sm text-[color:var(--muted)]">
          요청 내역 확인 및 승인/반려 처리가 가능합니다.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>요청 내역</span>
            <Badge variant="outline">{items.length}건</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              요청이 없습니다.
            </div>
          ) : (
            items.map((mr) => {
              const c = getUserById(db, mr.companyId);
              const s = getUserById(db, mr.studentId);
              return (
                <div
                  key={mr.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {c?.name ?? "기업"} → {s?.name ?? "학생"} · #{mr.id}
                      </div>
                      <div className="text-xs text-[color:var(--muted-2)]">
                        {new Date(mr.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(mr.status)}
                      <Button size="sm" variant="secondary" onClick={() => setStatus(mr.id, "pending")}>
                        대기
                      </Button>
                      <Button size="sm" onClick={() => setStatus(mr.id, "approved")}>
                        승인
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setStatus(mr.id, "rejected")}>
                        반려
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-[color:var(--muted)]">{mr.message}</div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}


