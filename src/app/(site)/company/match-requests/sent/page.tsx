import { Suspense } from "react";
import SentClient from "./SentClient";

export default function MatchRequestSentPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <SentClient />
    </Suspense>
  );
}


