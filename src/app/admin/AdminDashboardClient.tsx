"use client";

import Link from "next/link";
import { Users } from "lucide-react";

import { ClientOnly } from "@/components/common/ClientOnly";
import { getAdminStats, getUserById } from "@/lib/demoActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardClient() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminDashboardInner />
    </ClientOnly>
  );
}

function AdminDashboardInner() {
  const { db, counts } = getAdminStats();
  const recent = db.matchRequests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">대시보드</div>
          <div className="text-sm text-[color:var(--muted)]">
            회원/키워드/요청/로그/통계를 한눈에 확인합니다.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[color:var(--muted-2)]" />
              회원
            </CardTitle>
            <CardDescription>기업/학생/관리자</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">기업 {counts.companies}</Badge>
              <Badge variant="outline">학생 {counts.students}</Badge>
              <Badge variant="outline">관리자 {counts.admins}</Badge>
            </div>
            <Link href="/admin/users">
              <Button className="w-full" variant="secondary">
                회원 관리
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>매칭 요청</CardTitle>
            <CardDescription>상태별 집계</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">대기 {counts.pending}</Badge>
              <Badge variant="green">승인 {counts.approved}</Badge>
              <Badge variant="outline">반려 {counts.rejected}</Badge>
            </div>
            <Link href="/admin/match-requests">
              <Button className="w-full" variant="secondary">
                요청 관리
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>키워드</CardTitle>
            <CardDescription>프로필/검색에 사용</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">총 {db.keywords.length}개</Badge>
            </div>
            <Link href="/admin/keywords">
              <Button className="w-full" variant="secondary">
                키워드 관리
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>최근 매칭 요청</span>
            <Badge variant="outline">{counts.requests}건</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recent.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              아직 요청이 없습니다.
            </div>
          ) : (
            recent.map((mr) => {
              const c = getUserById(db, mr.companyId);
              const s = getUserById(db, mr.studentId);
              return (
                <div
                  key={mr.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {c?.name ?? "기업"} → {s?.name ?? "학생"} · #{mr.id}
                    </div>
                    <div className="text-xs text-[color:var(--muted-2)]">
                      {new Date(mr.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={mr.status === "approved" ? "green" : mr.status === "rejected" ? "outline" : "brand"}>
                      {mr.status === "approved"
                        ? "승인"
                        : mr.status === "rejected"
                          ? "반려"
                          : "대기"}
                    </Badge>
                    <Link href="/admin/match-requests">
                      <Button size="sm" variant="secondary">
                        관리
                      </Button>
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


