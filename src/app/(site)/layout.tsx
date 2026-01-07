import { SiteHeader, UserNavigationBar } from "@/components/layout/SiteHeader";
import { DemoInit } from "@/components/providers/DemoInit";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-grid">
      <DemoInit />
      <SiteHeader />
      <UserNavigationBar />
      <main className="mx-auto w-full max-w-6xl px-[30px] md:px-4 pt-[30px] pb-15">{children}</main>
      <footer className="mx-auto w-full max-w-6xl px-[30px] md:px-4 pb-15 pt-2 text-xs text-[color:var(--muted-2)]">
        {/* DB/서버 연동 없는 데모용 프로토타입 — Vercel 배포 가능 */}
      </footer>
    </div>
  );
}


