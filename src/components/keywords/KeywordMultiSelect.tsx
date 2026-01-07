"use client";

import * as React from "react";
import { Check, Plus, X } from "lucide-react";

import type { Keyword } from "@/lib/demoDbTypes";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function KeywordMultiSelect({
  keywords,
  value,
  onChange,
  placeholder = "키워드 검색…",
}: {
  keywords: Keyword[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [q, setQ] = React.useState("");
  const selected = new Set(value);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return keywords;
    return keywords.filter((k) => k.name.toLowerCase().includes(qq));
  }, [keywords, q]);

  function toggle(id: string) {
    const next = new Set(value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <div className="text-sm text-[color:var(--muted-2)]">
            선택된 키워드가 없습니다.
          </div>
        ) : (
          value.map((id) => {
            const k = keywords.find((x) => x.id === id);
            return (
              <Badge key={id} variant="brand" className="gap-1">
                {k?.name ?? id}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="rounded-full p-0.5 hover:bg-white/10"
                  aria-label="키워드 제거"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })
        )}
      </div>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
      />

      <div className="max-h-56 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2">
        <div className="grid gap-1">
          {filtered.map((k) => {
            const isOn = selected.has(k.id);
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => toggle(k.id)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition",
                  isOn
                    ? "bg-[color:var(--brand)]/15 ring-1 ring-[color:var(--brand)]/30"
                    : "hover:bg-white/10",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate">{k.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[color:var(--muted-2)]">
                  {isOn ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-[color:var(--muted-2)]">
              검색 결과가 없어요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


