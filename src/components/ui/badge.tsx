"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "green" | "outline";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    default:
      "bg-white/10 text-[color:var(--foreground)] border border-white/10",
    brand:
      "bg-[color:var(--brand)]/20 text-[color:var(--foreground)] border border-[color:var(--brand)]/30",
    green:
      "bg-[color:var(--brand-2)]/18 text-[color:var(--foreground)] border border-[color:var(--brand-2)]/30",
    outline:
      "bg-transparent text-[color:var(--muted)] border border-[color:var(--border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}


