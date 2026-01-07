"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Pencil, Sparkles, LogOut } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { loadDb } from "@/lib/storage";
import { getProfileByUserId, getKeywordName } from "@/lib/demoActions";
import { ClientOnly } from "@/components/common/ClientOnly";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileClient() {
  return (
    <ClientOnly
      fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}
    >
      <ProfileClientInner />
    </ClientOnly>
  );
}

function ProfileClientInner() {
  const router = useRouter();
  const user = getCurrentUser();
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>프로필을 보려면 먼저 로그인해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/login">
            <Button variant="secondary">로그인</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const db = loadDb();
  const profile = getProfileByUserId(db, user.id);
  const keywordNames = profile.keywords.map((id) => getKeywordName(db, id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">마이 페이지</div>
          <div className="text-sm text-[color:var(--muted)]">
            {user.role === "company" ? "기업" : "학생"} · {user.email}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/profile/edit">
            <Button variant="secondary">
              <Pencil className="h-4 w-4" />
              프로필 수정
            </Button>
          </Link>
          {user.role === "company" ? (
            <Link href="/company/search">
              <Button>
                <Building2 className="h-4 w-4" />
                학생 검색
              </Button>
            </Link>
          ) : (
            <Link href="/student/companies">
              <Button>
                <Sparkles className="h-4 w-4" />
                기업 리스트
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>키워드 기반 매칭을 위한 요약 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">키워드</div>
            <div className="flex flex-wrap gap-2">
              {keywordNames.length === 0 ? (
                <div className="text-sm text-[color:var(--muted-2)]">
                  아직 키워드가 없습니다. 프로필을 수정해 추가해 주세요.
                </div>
              ) : (
                keywordNames.map((name) => (
                  <Badge key={name} variant="brand">
                    {name}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">소개</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--muted)]">
              {profile.intro?.trim()
                ? profile.intro
                : "소개가 비어있습니다. 프로필 수정에서 작성해 주세요."}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <Link href="/logout" className="block w-full">
          <Button variant="secondary" className="w-full">
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </Link>
      </div>
    </div>
  );
}


