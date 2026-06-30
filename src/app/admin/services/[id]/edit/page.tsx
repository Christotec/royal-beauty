import { createClient } from "@/lib/supabase/server";
import ServiceForm from "@/components/admin/ServiceForm";
import type { Service } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*, images:service_images(*)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const service = data as Service;
  if (service.images) {
    service.images.sort((a, b) => a.sort_order - b.sort_order);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
      <h1 className="font-display text-2xl text-burgundy font-semibold mb-8">
        Edit Service
      </h1>
      <ServiceForm existingService={service} />
    </div>
  );
}