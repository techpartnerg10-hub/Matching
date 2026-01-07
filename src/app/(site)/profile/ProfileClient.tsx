"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, LogOut, Lock, X } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { loadDb } from "@/lib/storage";
import { getProfileByUserId, getKeywordName, updateUserPassword } from "@/lib/demoActions";
import { ClientOnly } from "@/components/common/ClientOnly";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfileClient() {
  return (
    <ClientOnly
      fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}
    >
      <ProfileClientInner />
    </ClientOnly>
  );
}

function ProfileClientInner() {
  const router = useRouter();
  const user = getCurrentUser();
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>프로필을 보려면 먼저 로그인해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button variant="secondary">로그인</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const db = loadDb();
  const profile = getProfileByUserId(db, user.id);
  const keywordNames = profile.keywords.map((id) => getKeywordName(db, id));
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [changing, setChanging] = React.useState(false);

  async function onChangePassword() {
    if (!newPassword || !confirmPassword || !currentPassword) {
      toast.error("모든 필드를 입력해 주세요.");
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

    setChanging(true);
    try {
      const res = updateUserPassword({
        userId: user.id,
        currentPassword,
        newPassword,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("비밀번호가 변경되었습니다.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">마이 페이지</div>
          <div className="text-sm text-[color:var(--muted)]">
            {user.role === "company" ? "기업" : "학생"} · {user.email}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>키워드 기반 매칭을 위한 요약 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">키워드</div>
            <div className="flex flex-wrap gap-2">
              {keywordNames.length === 0 ? (
                <div className="text-sm text-[color:var(--muted-2)]">
                  아직 키워드가 없습니다. 프로필을 수정해 추가해 주세요.
                </div>
              ) : (
                keywordNames.map((name) => (
                  <Badge key={name} variant="brand">
                    {name}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">소개</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--muted)]">
              {profile.intro?.trim()
                ? profile.intro
                : "소개가 비어있습니다. 프로필 수정에서 작성해 주세요."}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 pt-4">
        <Link href="/profile/edit" className="block w-full">
          <Button variant="secondary" className="w-full">
            <Pencil className="h-4 w-4" />
            프로필 수정
          </Button>
        </Link>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setShowPasswordModal(true)}
        >
          <Lock className="h-4 w-4" />
          비밀번호 변경
        </Button>
        <Link href="/logout" className="block w-full">
          <Button variant="secondary" className="w-full">
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </Link>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <Card className="bg-black/35">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>비밀번호 변경</CardTitle>
                  <CardDescription>새로운 비밀번호를 입력해 주세요.</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded-xl p-2 hover:bg-white/10"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="text-xs text-[color:var(--muted-2)]">현재 비밀번호</div>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-[color:var(--muted-2)]">새 비밀번호</div>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 입력"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-[color:var(--muted-2)]">새 비밀번호 확인</div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    취소
                  </Button>
                  <Button className="flex-1" onClick={onChangePassword} isLoading={changing}>
                    변경
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}


