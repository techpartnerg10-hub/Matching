"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-2)] outline-none transition focus:border-white/30 focus:ring-2 focus:ring-[color:var(--brand)]/40",
        className,
      )}
      {...props}
    />
  );
}


