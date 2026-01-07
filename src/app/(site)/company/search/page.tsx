"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { KeywordMultiSelect } from "@/components/keywords/KeywordMultiSelect";
import { getCurrentUser } from "@/lib/auth";
import { loadDb } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CompanySearchPage() {
  return (
    <RequireRole roles={["company"]} redirectTo="/auth/login">
      <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
        <CompanySearchInner />
      </ClientOnly>
    </RequireRole>
  );
}

function CompanySearchInner() {
  const router = useRouter();
  const user = getCurrentUser();
  const db = loadDb();

  const [mode, setMode] = React.useState<"all" | "any">("all");
  const [keywords, setKeywords] = React.useState<string[]>([]);

  function onSearch() {
    const qs = new URLSearchParams();
    if (keywords.length) qs.set("keywords", keywords.join(","));
    qs.set("mode", mode);
    router.push(`/company/students?${qs.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">키워드 검색</div>
          <div className="text-sm text-[color:var(--muted)]">
            {user?.name ?? "기업"}님이 원하는 학생 키워드를 선택해 주세요.
          </div>
        </div>
        {/* <div className="flex gap-2">
          <Link href="/company/match-requests/sent">
            <Button variant="secondary">내 요청 내역</Button>
          </Link>
          <Button onClick={onSearch}>
            <Search className="h-4 w-4" />
            검색
          </Button>
        </div> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>필터 옵션</CardTitle>
          <CardDescription>키워드는 다중 선택이 가능합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-[color:var(--muted-2)]">매칭 방식</div>
            <button
              type="button"
              onClick={() => setMode("all")}
              className={[
                "rounded-full px-3 py-2 text-sm border transition",
                mode === "all"
                  ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              AND
            </button>
            <button
              type="button"
              onClick={() => setMode("any")}
              className={[
                "rounded-full px-3 py-2 text-sm border transition",
                mode === "any"
                  ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              OR
            </button>
            <Badge variant="outline">
              선택 {keywords.length}개
            </Badge>
          </div>

          <KeywordMultiSelect
            keywords={db.keywords}
            value={keywords}
            onChange={setKeywords}
            placeholder="예) 프론트엔드, 데이터, UI/UX…"
          />
        </CardContent>
      </Card>
    </div>
  );
}


