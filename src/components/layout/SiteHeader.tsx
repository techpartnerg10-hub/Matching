"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { clearSession, getCurrentUser } from "@/lib/auth";
import { resetDb } from "@/lib/storage";
import { Menu, Handshake, LogOut, User, Search, FileText } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const [userName, setUserName] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      setUserName(null);
      setUserRole(null);
      return;
    }
    setUserName(u.name);
    setUserRole(u.role);
  }, [pathname]);

  // 모바일 메뉴 열림/닫힘 시 스크롤 위치 유지
  React.useEffect(() => {
    if (mobileOpen) {
      // 메뉴가 열릴 때: 현재 스크롤 위치 저장 및 body 스크롤 방지
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 메뉴가 닫힐 때: 저장된 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        const parsedScrollY = parseInt(scrollY.replace("px", ""), 10);
        if (!isNaN(parsedScrollY)) {
          window.scrollTo(0, Math.abs(parsedScrollY));
        }
      }
    }

    // cleanup: 컴포넌트 언마운트 시 스타일 초기화
    return () => {
      if (mobileOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        if (scrollY) {
          const parsedScrollY = parseInt(scrollY.replace("px", ""), 10);
          if (!isNaN(parsedScrollY)) {
            window.scrollTo(0, Math.abs(parsedScrollY));
          }
        }
      }
    };
  }, [mobileOpen]);

  // 메뉴 영역 밖 클릭 시 메뉴 닫기
  React.useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    // 약간의 지연을 두어 메뉴 토글 버튼 클릭 이벤트가 먼저 처리되도록 함
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  // 사용자 타입에 따라 메뉴 항목 필터링
  const nav = React.useMemo(() => {
    // 로그인하지 않은 경우: 메뉴 없음
    if (!userName) {
      return [];
    }

    // 관리자 메뉴
    if (userRole === "admin") {
      return [
        { href: "/admin", label: "대시보드" },
        { href: "/admin/users", label: "회원 관리" },
        { href: "/admin/keywords", label: "키워드 관리" },
        { href: "/admin/match-requests", label: "매칭 요청" },
        { href: "/admin/notifications", label: "알림/메일 로그" },
        { href: "/admin/stats", label: "통계" },
        { href: "/admin/system", label: "시스템" },
      ];
    }

    // 로그인한 경우: 유저 타입에 따른 기능 메뉴만 표시 (홈, 로그인, 회원가입 제외)
    const items: Array<{ href: string; label: string }> = [];

    if (userRole === "company") {
      items.push({ href: "/company/students", label: "학생 검색" });
    } else if (userRole === "student") {
      items.push({ href: "/student/companies", label: "기업 검색" });
    }

    return items;
  }, [userName, userRole]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-white/10 bg-black/15 backdrop-blur relative">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-[30px] md:px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--brand)]/20 ring-1 ring-[color:var(--brand)]/30">
            <Handshake className="h-5 w-5 text-[color:var(--brand)]" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Matching Platform</div>
          </div>
        </Link>

        {userName && userRole === "admin" && nav.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--foreground)] transition",
                    active && "bg-white/10 text-[color:var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {userName && userRole === "admin" && (
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 md:hidden"
              aria-label="메뉴"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {userName && (
            <Link href="/logout">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                aria-label="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && userName && userRole === "admin" && (
        <div className="absolute left-0 right-0 top-full border-t border-white/10 bg-black/90 backdrop-blur-xl px-[30px] py-3 md:hidden">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--foreground)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// 기업/학생 유저용 내비게이션 바
export function UserNavigationBar() {
  const pathname = usePathname();
  const [userName, setUserName] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      setUserName(null);
      setUserRole(null);
      return;
    }
    setUserName(u.name);
    setUserRole(u.role);
  }, [pathname]);

  // 기업/학생 유저가 아니면 표시하지 않음
  if (!userName || userRole === "admin" || (!userRole)) {
    return null;
  }

  const navItems = [
    {
      href: userRole === "company" ? "/company/students" : "/student/companies",
      label: "검색",
      icon: Search,
    },
    ...(userRole === "company"
      ? [
          {
            href: "/company/match-requests/sent",
            label: "요청",
            icon: FileText,
          },
        ]
      : []),
    {
      href: "/profile",
      label: "마이",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/15 backdrop-blur safe-area-inset-bottom">
      <div className="mx-auto flex max-w-6xl items-center justify-around px-[30px] md:px-4 py-2">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/profile" && pathname?.startsWith("/profile")) ||
            (item.href?.includes("/match-requests") && pathname?.includes("/match-requests"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs transition",
                active
                  ? "bg-[color:var(--brand)]/30 text-[color:var(--foreground)] font-semibold"
                  : "text-[color:var(--muted)]",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-[color:var(--foreground)]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


