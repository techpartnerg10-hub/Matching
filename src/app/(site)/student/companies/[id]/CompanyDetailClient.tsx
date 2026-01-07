"use client";

import Link from "next/link";
import { Building2, ChevronLeft } from "lucide-react";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { getKeywordName, getProfileByUserId } from "@/lib/demoActions";
import { loadDb } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanyDetailClient({ companyId }: { companyId: string }) {
  return (
    <RequireRole roles={["student"]} redirectTo="/">
      <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
        <CompanyDetailInner companyId={companyId} />
      </ClientOnly>
    </RequireRole>
  );
}

function CompanyDetailInner({ companyId }: { companyId: string }) {
  const db = loadDb();
  const decodedId = decodeURIComponent(companyId);
  const company = db.users.find((u) => u.id === decodedId && u.role === "company" && u.status === "active") ?? null;

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>기업 정보를 찾을 수 없습니다</CardTitle>
          <CardDescription>기업 리스트에서 다시 선택해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-xs text-[color:var(--muted-2)]">
            찾는 ID: {decodedId}
          </div>
          <Link href="/student/companies">
            <Button variant="secondary">
              <ChevronLeft className="h-4 w-4" />
              기업 리스트로
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const profile = getProfileByUserId(db, company.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">기업 정보</div>
          <div className="text-sm text-[color:var(--muted)]">
            학생용 기업 상세 페이지(프로필, 키워드, 소개)
          </div>
        </div>
        <Link href="/student/companies">
          <Button variant="secondary">
            <ChevronLeft className="h-4 w-4" />
            기업 리스트
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[color:var(--muted-2)]" />
              {company.name}
            </span>
            <Badge variant="outline">기업</Badge>
          </CardTitle>
          <CardDescription>{company.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">키워드</div>
            <div className="flex flex-wrap gap-2">
              {profile.keywords.length === 0 ? (
                <div className="text-sm text-[color:var(--muted-2)]">키워드가 없습니다.</div>
              ) : (
                profile.keywords.map((id) => (
                  <Badge key={id} variant="brand">
                    {getKeywordName(db, id)}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">소개</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--muted)]">
              {profile.intro?.trim() ? profile.intro : "소개가 비어있습니다."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


