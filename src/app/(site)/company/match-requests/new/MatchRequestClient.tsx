"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { getCurrentUser } from "@/lib/auth";
import { loadDb } from "@/lib/storage";
import { createMatchRequest, getKeywordName, getProfileByUserId } from "@/lib/demoActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function MatchRequestClient() {
  return (
    <RequireRole roles={["company"]} redirectTo="/auth/login">
      <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
        <MatchRequestInner />
      </ClientOnly>
    </RequireRole>
  );
}

function MatchRequestInner() {
  const router = useRouter();
  const search = useSearchParams();
  const studentId = search.get("studentId") || "";
  const keywordIds = (search.get("keywords") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const company = getCurrentUser();
  const db = loadDb();
  const student = db.users.find((u) => u.id === studentId) ?? null;
  const studentProfile = student ? getProfileByUserId(db, student.id) : null;

  const [message, setMessage] = React.useState(
    "안녕하세요! 키워드 기반으로 매칭 요청드립니다. 간단히 이야기 나눠보고 싶습니다.",
  );
  const [loading, setLoading] = React.useState(false);

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/auth/login">
            <Button variant="secondary">로그인</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const companyId = company.id;

  if (!student || !studentProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>학생 정보를 찾을 수 없습니다</CardTitle>
          <CardDescription>학생 리스트에서 다시 선택해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/company/search">
            <Button variant="secondary">학생 검색으로</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const targetStudentId = student.id;

  async function onSubmit() {
    setLoading(true);
    try {
      const { id } = createMatchRequest({
        companyId,
        studentId: targetStudentId,
        keywordsSnapshot: keywordIds,
        message,
      });
      toast.success("매칭 요청 완료", {
        description: "관리자에게 알림/메일이 발송된 것으로 기록됩니다.",
      });
      router.replace(`/company/match-requests/sent?id=${encodeURIComponent(id)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">매칭 요청</div>
        <div className="text-sm text-[color:var(--muted)]">
          선택한 학생에게 매칭 요청 메시지를 작성합니다.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>대상 학생</CardTitle>
          <CardDescription>학생 프로필 요약</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold">{student.name}</div>
              <div className="text-sm text-[color:var(--muted-2)]">{student.email}</div>
            </div>
            <Badge variant="outline">학생</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {studentProfile.keywords.slice(0, 10).map((id) => (
              <Badge key={id} variant={keywordIds.includes(id) ? "brand" : "outline"}>
                {getKeywordName(db, id)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>요청 메시지</CardTitle>
          <CardDescription>관리자에게도 함께 전달되는 것으로 기록됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link href="/company/search">
              <Button variant="secondary" className="w-full sm:w-auto">
                취소
              </Button>
            </Link>
            <Button className="w-full sm:w-auto" isLoading={loading} onClick={onSubmit}>
              요청 보내기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


