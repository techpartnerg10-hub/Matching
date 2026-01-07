"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signupDemoUser, loginWithEmailPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StudentSignupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("demo1234");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = signupDemoUser({ role: "student", email, name, password });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      loginWithEmailPassword({ email, password, role: "student" });
      toast.success("학생 회원가입 완료", {
        description: "프로필(키워드)을 등록해 주세요.",
      });
      router.replace("/profile/edit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>학생 회원가입</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Input
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
            <Button className="w-full" isLoading={loading} type="submit">
              가입하고 계속하기
            </Button>
          </form>
          <div className="flex items-center justify-between text-sm">
            <Link
              className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
              href="/auth/signup"
            >
              역할 다시 선택
            </Link>
            <Link
              className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
              href="/"
            >
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


