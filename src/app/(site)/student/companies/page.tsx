import { Suspense } from "react";
import StudentCompaniesClient from "./StudentCompaniesClient";

export default function StudentCompaniesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <StudentCompaniesClient />
    </Suspense>
  );
}


