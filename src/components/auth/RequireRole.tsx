"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadSession } from "@/lib/auth";
import type { Role } from "@/lib/demoDbTypes";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireRole({
  roles,
  redirectTo,
  children,
}: {
  roles?: Role[];
  redirectTo: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = React.useState(false);

  React.useEffect(() => {
    const s = loadSession();
    if (!s) {
      const next = encodeURIComponent(pathname ?? "/");
      router.replace(`${redirectTo}?next=${next}`);
      return;
    }
    if (roles && !roles.includes(s.role)) {
      router.replace("/");
      return;
    }
    setOk(true);
  }, [pathname, redirectTo, roles, router]);

  if (!ok) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}


