"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";

import { clearSession, getCurrentUser } from "@/lib/auth";
import { loadDb } from "@/lib/storage";
import { deleteUser, getProfileByUserId, updateProfile } from "@/lib/demoActions";
import { ClientOnly } from "@/components/common/ClientOnly";
import { KeywordMultiSelect } from "@/components/keywords/KeywordMultiSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileEditClient() {
  return (
    <ClientOnly
      fallback={
        <div className="space-y-3">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-72 w-full" />
        </div>
      }
    >
      <ProfileEditInner />
    </ClientOnly>
  );
}

function ProfileEditInner() {
  const router = useRouter();
  const user = getCurrentUser();
  const db = loadDb();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>프로필을 수정하려면 로그인해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/login">
            <Button variant="secondary">로그인</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const userId = user.id;

  const profile = getProfileByUserId(db, user.id);
  const [keywords, setKeywords] = React.useState<string[]>(profile.keywords);
  const [intro, setIntro] = React.useState(profile.intro ?? "");
  const [saving, setSaving] = React.useState(false);

  async function onSave() {
    setSaving(true);
    try {
      updateProfile({ userId, keywords, intro });
      toast.success("프로필 저장 완료");
      router.push("/profile");
    } finally {
      setSaving(false);
    }
  }

  function onResetProfile() {
    if (!confirm("프로필 내용을 초기화할까요?")) return;
    setKeywords([]);
    setIntro("");
    updateProfile({ userId, keywords: [], intro: "" });
    toast.success("프로필 초기화 완료");
  }

  function onDeleteAccount() {
    if (!confirm("계정을 삭제할까요? (데모 데이터에서 제거됩니다)")) return;
    deleteUser(userId);
    clearSession();
    toast.success("계정 삭제 완료");
    router.replace("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">프로필 수정</div>
          <div className="text-sm text-[color:var(--muted)]">
            {user.role === "company" ? "기업" : "학생"} · {user.email}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onResetProfile}>
            초기화
          </Button>
          <Button onClick={onSave} isLoading={saving}>
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>키워드 선택</CardTitle>
          <CardDescription>매칭 검색/추천에 사용됩니다(다중 선택).</CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordMultiSelect
            keywords={db.keywords}
            value={keywords}
            onChange={setKeywords}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>소개</CardTitle>
          <CardDescription>한 줄 소개/강점/희망 분야 등을 작성해 주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="예) React/Next 기반 UI 구현에 강점이 있고, 실험-분석-개선 루프를 좋아합니다."
          />
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              취소
            </Link>
            <button
              type="button"
              onClick={onDeleteAccount}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-200 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              계정 삭제
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


