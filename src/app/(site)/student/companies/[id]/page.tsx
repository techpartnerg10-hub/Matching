import { Suspense } from "react";
import CompanyDetailClient from "./CompanyDetailClient";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <CompanyDetailClient companyId={id} />
    </Suspense>
  );
}


