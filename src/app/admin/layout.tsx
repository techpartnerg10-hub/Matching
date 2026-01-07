import { DemoInit } from "@/components/providers/DemoInit";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RequireRole } from "@/components/auth/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-grid">
      <DemoInit />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-[30px] md:px-4 py-10">
        <RequireRole roles={["admin"]} redirectTo="/admin/login">
          {children}
        </RequireRole>
      </main>
    </div>
  );
}


