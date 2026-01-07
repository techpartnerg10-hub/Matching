"use client";

import { ClientOnly } from "@/components/common/ClientOnly";
import { getAdminStats } from "@/lib/demoActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeywordUsageBar, RequestStatusDoughnut } from "@/components/charts/AdminCharts";

export default function AdminStatsPage() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminStatsInner />
    </ClientOnly>
  );
}

function AdminStatsInner() {
  const { counts, topKeywords } = getAdminStats();
  const labels = topKeywords.map((k) => k.name);
  const values = topKeywords.map((k) => k.count);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">통계</div>
        <div className="text-sm text-[color:var(--muted)]">
          회원 수/요청 수/키워드 사용 빈도를 시각화합니다.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>회원 수</CardTitle>
            <CardDescription>역할별</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="outline">기업 {counts.companies}</Badge>
            <Badge variant="outline">학생 {counts.students}</Badge>
            <Badge variant="outline">관리자 {counts.admins}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>매칭 요청</CardTitle>
            <CardDescription>총 {counts.requests}건</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="brand">대기 {counts.pending}</Badge>
            <Badge variant="green">승인 {counts.approved}</Badge>
            <Badge variant="outline">반려 {counts.rejected}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 키워드</CardTitle>
            <CardDescription>프로필에서 많이 선택된 순</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topKeywords.slice(0, 6).map((k) => (
              <Badge key={k.id} variant="outline">
                {k.name} · {k.count}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>키워드 사용 빈도</CardTitle>
            <CardDescription>Top 8</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[280px] w-full min-w-0">
              <KeywordUsageBar labels={labels} values={values} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>요청 상태 분포</CardTitle>
            <CardDescription>대기/승인/반려</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[280px] w-full max-w-sm mx-auto">
              <RequestStatusDoughnut
                pending={counts.pending}
                approved={counts.approved}
                rejected={counts.rejected}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


