"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { searchStudents, getKeywordName } from "@/lib/demoActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentCard } from "@/components/cards/StudentCard";

export default function StudentsClient() {
  const search = useSearchParams();
  const keywordIds = (search.get("keywords") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const mode = (search.get("mode") === "any" ? "any" : "all") as "all" | "any";

  return (
    <RequireRole roles={["company"]} redirectTo="/">
      <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
        <StudentsInner keywordIds={keywordIds} mode={mode} />
      </ClientOnly>
    </RequireRole>
  );
}

function StudentsInner({ keywordIds, mode }: { keywordIds: string[]; mode: "all" | "any" }) {
  const { db, results } = searchStudents({ keywordIds, mode });
  const keywordNames = keywordIds.map((id) => getKeywordName(db, id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">학생 리스트</div>
          <div className="text-sm text-[color:var(--muted)]">
            {keywordIds.length === 0
              ? "전체 학생을 표시합니다."
              : `선택 키워드(${mode === "all" ? "AND" : "OR"}): ${keywordNames.join(", ")}`}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/company/search">
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              필터 수정
            </Button>
          </Link>
          <Link href="/company/match-requests/sent">
            <Button variant="secondary">내 요청 내역</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>검색 결과</span>
            <Badge variant="outline">{results.length}명</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              조건에 맞는 학생이 없습니다. 필터를 조정해 주세요.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map(({ user, profile, matches }) => (
                <StudentCard
                  key={user.id}
                  db={db}
                  user={user}
                  profile={profile}
                  matchKeywordIds={matches}
                  selectedKeywordIds={keywordIds}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


