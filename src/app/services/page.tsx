import Image from "next/image";
import Link from "next/link";
import { getActiveServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-16">
      <div className="mb-10 sm:mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-dark font-semibold mb-3">
          Walk-In Services Available
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-burgundy font-semibold mb-4">
          Salon Services
        </h1>
        <p className="text-charcoal/75 leading-relaxed text-sm sm:text-base">
          Royal Beauty is a full unisex salon. Tap any service to see photos
          and book on WhatsApp, or simply walk in at our Karsana, Abuja
          location.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gold/40 rounded-2xl">
          <p className="font-display text-lg text-burgundy mb-2">
            Services coming soon
          </p>
          <p className="text-charcoal/60 text-sm">
            Check back shortly, or message us on WhatsApp to book.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service) => {
            const cover =
              service.cover_image_url || service.images?.[0]?.image_url;
            const photoCount = service.images?.length ?? 0;
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-2xl border border-gold/30 bg-white overflow-hidden hover:border-gold hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] bg-blush">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-burgundy/40 text-base text-center px-4">
                        {service.name}
                      </span>
                    </div>
                  )}
                  {photoCount > 1 && (
                    <span className="absolute top-2 right-2 text-[11px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
                      {photoCount} photos
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-burgundy font-semibold mb-2">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-charcoal/70 text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <span className="inline-block mt-3 text-sm font-semibold text-burgundy group-hover:text-gold-dark transition-colors">
                    View &amp; Book &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}