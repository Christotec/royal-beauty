import { getServiceBySlug } from "@/lib/services";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";

export const dynamic = "force-dynamic";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-16">
      <ServiceDetail service={service} />
    </main>
  );
}