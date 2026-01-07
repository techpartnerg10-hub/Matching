"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KEY = "matching_demo_onboarding_seen_v1";

const steps = [
  {
    title: "목표",
    body: "DB/서버 없이도 ‘실제처럼’ 보이는 흐름(가입→프로필→검색→요청→관리자)을 5~7분 내 데모할 수 있게 구성했습니다.",
  },
  {
    title: "추천 데모 시나리오",
    body: "기업 로그인 → 키워드 필터로 학생 검색 → 매칭 요청 → 관리자에서 요청/로그 확인 → 통계로 마무리",
  },
  {
    title: "핵심 포인트",
    body: "모든 데이터는 LocalStorage에 저장됩니다. 상단 ‘데모 초기화’로 언제든 초기 상태로 되돌릴 수 있습니다.",
  },
];

function hasSeen() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(KEY) === "1";
}

function markSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "1");
}

export function OnboardingModal() {
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (!hasSeen()) setOpen(true);
  }, []);

  if (!open) return null;

  const step = steps[idx];
  const isLast = idx === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg">
        <Card className="bg-black/35">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>데모 온보딩</CardTitle>
              <div className="text-sm text-[color:var(--muted)]">
                {idx + 1} / {steps.length}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                markSeen();
                setOpen(false);
              }}
              className="rounded-xl p-2 hover:bg-white/10"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="text-base font-semibold">{step.title}</div>
              <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {step.body}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  markSeen();
                  setOpen(false);
                }}
              >
                다시 보지 않기
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setIdx((x) => Math.max(0, x - 1))}
                  disabled={idx === 0}
                >
                  이전
                </Button>
                {isLast ? (
                  <Button
                    onClick={() => {
                      markSeen();
                      setOpen(false);
                    }}
                  >
                    데모 시작
                  </Button>
                ) : (
                  <Button onClick={() => setIdx((x) => Math.min(steps.length - 1, x + 1))}>
                    다음
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


