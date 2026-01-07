import { Suspense } from "react";
import StudentsClient from "./StudentsClient";

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <StudentsClient />
    </Suspense>
  );
}


