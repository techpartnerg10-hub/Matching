"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyMatchRequests, getUserById } from "@/lib/demoActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SentClient() {
  const search = useSearchParams();
  const id = search.get("id");

  return (
    <RequireRole roles={["company"]} redirectTo="/">
      <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
        <SentInner id={id} />
      </ClientOnly>
    </RequireRole>
  );
}

function statusBadge(status: string) {
  if (status === "approved") return <Badge variant="green">승인</Badge>;
  if (status === "rejected") return <Badge variant="outline">반려</Badge>;
  return <Badge variant="brand">대기</Badge>;
}

function SentInner({ id }: { id: string | null }) {
  const company = getCurrentUser();
  if (!company) return null;
  const { db, items } = getCompanyMatchRequests(company.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">매칭 요청 내역</div>
          <div className="text-sm text-[color:var(--muted)]">
            기업이 보낸 매칭 요청의 상태를 확인합니다.
          </div>
        </div>
      </div>

      {id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[color:var(--brand-2)]" />
              매칭 요청이 접수되었습니다
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>매칭 요청 내역</span>
            <Badge variant="outline">{items.length}건</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              아직 요청이 없습니다. 학생 검색에서 매칭 요청을 만들어 보세요.
            </div>
          ) : (
            items.map((mr) => {
              const student = getUserById(db, mr.studentId);
              return (
                <div
                  key={mr.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {student?.name ?? "학생"} · 요청 #{mr.id}
                    </div>
                    <div className="text-xs text-[color:var(--muted-2)]">
                      {new Date(mr.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">
                      {mr.message}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                    {statusBadge(mr.status)}
                    <Link href="/admin/login" className="text-sm text-white/80 hover:underline">
                      관리자 보기
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}


