import { Suspense } from "react";
import MatchRequestClient from "./MatchRequestClient";

export default function MatchRequestNewPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <MatchRequestClient />
    </Suspense>
  );
}


