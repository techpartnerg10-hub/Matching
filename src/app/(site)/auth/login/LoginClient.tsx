"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { Role } from "@/lib/demoDbTypes";
import { loginWithEmailPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ROLE_LABEL: Record<Role, string> = {
  company: "기업",
  student: "학생",
  admin: "관리자",
};

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  const [role, setRole] = React.useState<Role>("company");
  const [email, setEmail] = React.useState("company1@demo.com");
  const [password, setPassword] = React.useState("demo1234");
  const [loading, setLoading] = React.useState(false);

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
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>로그인</CardTitle>
            <Badge variant="outline">샘플 계정 제공</Badge>
          </div>
          <p className="text-sm text-[color:var(--muted)]">
            DB 없이 LocalStorage로 동작하는 데모입니다.
          </p>
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
                    ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                {ROLE_LABEL[r]}
              </button>
            ))}
          </div>

          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1">
              <div className="text-xs text-[color:var(--muted-2)]">이메일</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-[color:var(--muted-2)]">비밀번호</div>
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
              className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              회원가입
            </Link>
            <Link
              href="/auth/reset"
              className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              비밀번호 재설정
            </Link>
            <Link
              href="/"
              className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              홈으로
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


