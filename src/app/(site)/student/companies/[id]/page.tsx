import CompanyDetailClient from "./CompanyDetailClient";

export default function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CompanyDetailClient companyId={params.id} />;
}


