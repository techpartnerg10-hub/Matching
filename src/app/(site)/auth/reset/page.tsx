"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PasswordResetPage() {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [email, setEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 재설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {step === 1 ? (
            <>
              <Input
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <Button
                className="w-full"
                onClick={() => {
                  toast.success("재설정 메일 발송(연출)", {
                    description: `${email || "입력한 이메일"}로 안내 메일을 보냈다고 가정합니다.`,
                  });
                  setStep(2);
                }}
              >
                재설정 메일 발송
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
              />
              <Button
                className="w-full"
                onClick={() => {
                  toast.success("비밀번호 재설정 완료(연출)");
                }}
              >
                비밀번호 변경
              </Button>
            </>
          )}

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/"
              className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              로그인으로
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


