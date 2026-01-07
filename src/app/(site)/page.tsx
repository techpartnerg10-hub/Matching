"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { Role } from "@/lib/demoDbTypes";
import { loginWithEmailPassword, clearSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

const ROLE_LABEL: Record<Role, string> = {
  company: "기업",
  student: "학생",
  admin: "관리자",
};

function LandingPageContent() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "";
  const [role, setRole] = React.useState<Role>("company");
  const [email, setEmail] = React.useState("company1@demo.com");
  const [password, setPassword] = React.useState("demo1234");
  const [loading, setLoading] = React.useState(false);

  // "/" 경로 호출 시 모든 로그인 캐시 정보 및 히스토리 삭제
  React.useEffect(() => {
    clearSession();
    // 브라우저 히스토리를 현재 페이지로 교체하여 이전 히스토리 제거
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  function routeAfterLogin(r: Role) {
    if (next && next !== "/") return next;
    if (r === "admin") return "/admin";
    if (r === "company") return "/company/search";
    return "/student/companies";
  }

  function onChangeRole(r: Role) {
    setRole(r);
    if (r === "company") setEmail("company1@demo.com");
    if (r === "student") setEmail("student1@demo.com");
    if (r === "admin") setEmail("admin@demo.com");
    setPassword("demo1234");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = loginWithEmailPassword({ email, password, role });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`${ROLE_LABEL[res.user.role]} 로그인 완료`, {
        // description: `${res.user.name}님, 데모를 시작합니다.`,
      });
      router.replace(routeAfterLogin(res.user.role));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <OnboardingModal />
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(closest-side,rgba(124,58,237,.35),transparent)]" />

      <div className="mx-auto max-w-md">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            기업-학생 키워드 <br />매칭 플랫폼
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted">
            기업과 학생을 키워드 기반으로 연결하여 맞춤형 인재 탐색과 매칭 요청을 지원하는 모바일 최적화 웹 플랫폼입니다.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-2">
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(["company", "student", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChangeRole(r)}
                  className={[
                    "h-10 rounded-xl border text-sm transition",
                    role === r
                      ? "border-(--brand)/50 bg-(--brand)/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="space-y-1">
                <div className="text-xs text-muted-2">이메일</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-2">비밀번호</div>
                <Input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" isLoading={loading} type="submit">
                로그인
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/auth/signup"
                className="text-muted hover:text-foreground"
              >
                회원가입
              </Link>
              <Link
                href="/auth/reset"
                className="text-muted hover:text-foreground"
              >
                비밀번호 재설정
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <LandingPageContent />
    </Suspense>
  );
}


