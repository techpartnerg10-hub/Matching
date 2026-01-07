"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { loginWithEmailPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminLoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [email, setEmail] = React.useState("admin@demo.com");
  const [password, setPassword] = React.useState("demo1234");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = loginWithEmailPassword({ email, password, role: "admin" });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("관리자 로그인 완료");
      router.replace(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>관리자 로그인</CardTitle>
            <Badge variant="outline">demo</Badge>
          </div>
          <p className="text-sm text-[color:var(--muted)]">
            샘플 계정: admin@demo.com / demo1234
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" isLoading={loading} type="submit">
              로그인
            </Button>
          </form>
          <Link
            href="/"
            className="block text-center text-sm text-[color:var(--muted-2)] hover:text-[color:var(--foreground)]"
          >
            홈으로
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}


