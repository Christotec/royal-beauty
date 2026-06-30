import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*, images:service_images(*)")
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-burgundy font-semibold mb-1">
            Services
          </h1>
          <p className="text-sm text-charcoal/60">
            {services.length} service{services.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-burgundy text-cream px-5 py-2.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
        >
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gold/40 rounded-2xl">
          <p className="font-display text-lg text-burgundy mb-2">No services yet</p>
          <Link
            href="/admin/services/new"
            className="inline-block mt-4 rounded-full bg-burgundy text-cream px-6 py-3 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
          >
            + Add Service
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((service) => {
            const photoCount = service.images?.length ?? 0;
            const cover = service.cover_image_url || service.images?.[0]?.image_url;
            return (
              <div
                key={service.id}
                className="flex items-center gap-4 rounded-xl border border-gold/30 bg-white p-4"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-blush flex-shrink-0">
                  {cover && (
                    <Image src={cover} alt={service.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-charcoal truncate">
                    {service.name}
                  </p>
                  <p className="text-xs text-charcoal/60">
                    {photoCount} photo{photoCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 ${
                    service.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {service.is_active ? "Visible" : "Hidden"}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="text-sm font-semibold text-burgundy hover:text-gold-dark transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}