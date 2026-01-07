import Link from "next/link";
import { Building2, GraduationCap } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupIndexPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="text-2xl font-semibold">회원가입</div>
        <p className="text-sm text-[color:var(--muted)]">
          기업/학생 중 역할을 선택해 데모 계정을 생성합니다(LocalStorage 저장).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>기업 회원가입</CardTitle>
              <Building2 className="h-5 w-5 text-[color:var(--muted-2)]" />
            </div>
            <CardDescription>학생 검색/매칭 요청 기능을 이용합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signup/company">
              <Button className="w-full" variant="secondary">
                기업 가입하기
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>학생 회원가입</CardTitle>
              <GraduationCap className="h-5 w-5 text-[color:var(--muted-2)]" />
            </div>
            <CardDescription>기업 리스트 조회 기능을 이용합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signup/student">
              <Button className="w-full" variant="secondary">
                학생 가입하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-[color:var(--muted-2)]">
        이미 계정이 있으신가요?{" "}
        <Link className="text-white/90 hover:underline" href="/auth/login">
          로그인
        </Link>
      </div>
    </div>
  );
}


