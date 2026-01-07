"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { Role } from "@/lib/demoDbTypes";
import { loginWithEmailPassword, clearSession } from "@/lib/auth";
import { resetPasswordByEmail } from "@/lib/demoActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [mode, setMode] = React.useState<"login" | "reset">("login");
  const [role, setRole] = React.useState<Role>("company");
  const [email, setEmail] = React.useState("company1@demo.com");
  const [password, setPassword] = React.useState("demo1234");
  const [loading, setLoading] = React.useState(false);
  const [resetStep, setResetStep] = React.useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [resetting, setResetting] = React.useState(false);

  // "/" 경로 호출 시 모든 캐시, 세션, 히스토리, 로그인 정보 삭제
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. 세션 클리어 (로그인 정보 제거)
    clearSession();

    // 2. 로그인 폼 입력값 초기화
    setMode("login");
    setRole("company");
    setEmail("");
    setPassword("");
    setLoading(false);
    setResetStep(1);
    setResetEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setResetting(false);

    // 3. Next.js 라우터 캐시 새로고침
    router.refresh();

    // 4. 브라우저 히스토리 정리
    // 현재 히스토리를 루트로 교체하고 모든 이전 히스토리 제거
    window.history.replaceState(null, "", "/");
    
    // 5. 히스토리 스택을 완전히 정리하기 위해 pushState 후 replaceState
    if (window.history.length > 1) {
      window.history.pushState(null, "", "/");
      window.history.replaceState(null, "", "/");
    }

    // 6. Next.js 프리페치 캐시 정리 (가능한 경우)
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes("next") || cacheName.includes("route")) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // 7. sessionStorage도 정리 (혹시 모를 로그인 관련 정보)
    try {
      sessionStorage.clear();
    } catch {
      // sessionStorage를 사용할 수 없는 경우 무시
    }
  }, [router]);

  function routeAfterLogin(r: Role) {
    if (next && next !== "/") return next;
    if (r === "admin") return "/admin";
    if (r === "company") return "/company/students";
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

  async function onResetPassword() {
    if (resetStep === 1) {
      if (!resetEmail.trim()) {
        toast.error("이메일을 입력해 주세요.");
        return;
      }
      toast.success("재설정 메일 발송(연출)", {
        description: `${resetEmail}로 안내 메일을 보냈다고 가정합니다.`,
      });
      setResetStep(2);
    } else {
      if (!newPassword || !confirmPassword) {
        toast.error("새 비밀번호를 입력해 주세요.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPassword.length < 4) {
        toast.error("비밀번호는 최소 4자 이상이어야 합니다.");
        return;
      }

      setResetting(true);
      try {
        const res = resetPasswordByEmail({
          email: resetEmail,
          newPassword,
        });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success("비밀번호가 재설정되었습니다.");
        setMode("login");
        setResetStep(1);
        setResetEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } finally {
        setResetting(false);
      }
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

        {mode === "login" ? (
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
                <button
                  type="button"
                  onClick={() => {
                    setMode("reset");
                    setResetStep(1);
                    setResetEmail("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-muted hover:text-foreground"
                >
                  비밀번호 재설정
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>비밀번호 재설정(데모)</CardTitle>
              <CardDescription>
                실제 메일 발송/인증은 하지 않고, 화면 흐름만 제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resetStep === 1 ? (
                <>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-2">이메일</div>
                    <Input
                      placeholder="이메일 입력"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      type="email"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={onResetPassword}
                    isLoading={resetting}
                  >
                    재설정 메일 발송
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-2">새 비밀번호</div>
                    <Input
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-2">새 비밀번호 확인</div>
                    <Input
                      placeholder="새 비밀번호 확인"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={onResetPassword}
                    isLoading={resetting}
                  >
                    비밀번호 변경
                  </Button>
                </>
              )}

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setResetStep(1);
                    setResetEmail("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-muted hover:text-foreground"
                >
                  로그인으로
                </button>
                <Link
                  href="/auth/signup"
                  className="text-muted hover:text-foreground"
                >
                  회원가입
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
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


