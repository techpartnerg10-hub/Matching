"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { KeywordMultiSelect } from "@/components/keywords/KeywordMultiSelect";
import { searchStudents, getKeywordName } from "@/lib/demoActions";
import { loadDb } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const router = useRouter();
  const db = loadDb();
  const { results } = searchStudents({ keywordIds, mode });
  const keywordNames = keywordIds.map((id) => getKeywordName(db, id));
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [filterKeywords, setFilterKeywords] = React.useState<string[]>(keywordIds);
  const [filterMode, setFilterMode] = React.useState<"all" | "any">(mode);

  function onApplyFilter() {
    const qs = new URLSearchParams();
    if (filterKeywords.length) qs.set("keywords", filterKeywords.join(","));
    qs.set("mode", filterMode);
    router.push(`/company/students?${qs.toString()}`);
    setShowFilterModal(false);
  }

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
          <Button variant="secondary" onClick={() => setShowFilterModal(true)}>
            <Filter className="h-4 w-4" />
            필터 수정
          </Button>
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <Card className="bg-black/35">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>필터 수정</CardTitle>
                  <CardDescription>키워드는 다중 선택이 가능합니다.</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="rounded-xl p-2 hover:bg-white/10"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm text-[color:var(--muted-2)]">매칭 방식</div>
                  <button
                    type="button"
                    onClick={() => setFilterMode("all")}
                    className={[
                      "rounded-full px-3 py-2 text-sm border transition",
                      filterMode === "all"
                        ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    ].join(" ")}
                  >
                    AND
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode("any")}
                    className={[
                      "rounded-full px-3 py-2 text-sm border transition",
                      filterMode === "any"
                        ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    ].join(" ")}
                  >
                    OR
                  </button>
                  <Badge variant="outline">
                    선택 {filterKeywords.length}개
                  </Badge>
                </div>

                <KeywordMultiSelect
                  keywords={db.keywords}
                  value={filterKeywords}
                  onChange={setFilterKeywords}
                  placeholder="예) 프론트엔드, 데이터, UI/UX…"
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowFilterModal(false)}
                  >
                    취소
                  </Button>
                  <Button className="flex-1" onClick={onApplyFilter}>
                    적용
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

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


