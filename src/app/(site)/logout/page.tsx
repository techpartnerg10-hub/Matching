"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearSession } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    clearSession();
    toast.success("로그아웃 완료");
    router.replace("/");
  }, [router]);

  return (
    <div className="text-sm text-[color:var(--muted)]">로그아웃 처리 중…</div>
  );
}


