"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { RequireRole } from "@/components/auth/RequireRole";
import { ClientOnly } from "@/components/common/ClientOnly";
import { getProfileByUserId } from "@/lib/demoActions";
import { loadDb } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyCard } from "@/components/cards/CompanyCard";

export default function StudentCompaniesPage() {
  return (
    <RequireRole roles={["student"]} redirectTo="/">
      <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
        <StudentCompaniesInner />
      </ClientOnly>
    </RequireRole>
  );
}

function StudentCompaniesInner() {
  const db = loadDb();
  const companies = db.users.filter((u) => u.role === "company" && u.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">기업 리스트</div>
          <div className="text-sm text-[color:var(--muted)]">
            카드형 UI로 기업 정보/키워드를 탐색합니다.
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>전체 기업</span>
            <Badge variant="outline">{companies.length}개</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-[color:var(--muted)]">
              표시할 기업이 없습니다.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {companies.map((u) => (
                <CompanyCard
                  key={u.id}
                  db={db}
                  user={u}
                  profile={getProfileByUserId(db, u.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


