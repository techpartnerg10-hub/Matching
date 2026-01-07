"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  checkedLabel?: string;
  uncheckedLabel?: string;
};

export function Switch({
  className,
  checked,
  onChange,
  disabled,
  checkedLabel = "활성",
  uncheckedLabel = "비활성",
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-9 w-24 items-center rounded-xl border-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden px-1",
        checked
          ? "bg-[color:var(--brand-2)]/20 border-[color:var(--brand-2)]/30"
          : "bg-white/10 border-white/10",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute flex h-7 items-center justify-center rounded-lg bg-white shadow-sm transition-all duration-200 ease-in-out text-xs font-bold px-3 min-w-[3.5rem]",
          checked 
            ? "right-1 text-[color:var(--brand-2)]" 
            : "left-1 text-gray-500"
        )}
      >
        {checked ? checkedLabel : uncheckedLabel}
      </span>
    </button>
  );
}

