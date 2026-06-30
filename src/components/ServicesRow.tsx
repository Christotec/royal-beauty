import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/types";

export default function ServicesRow({ services }: { services: Service[] }) {
  return (
    <section className="py-10 sm:py-16 bg-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark mb-2">
              Walk-In Services
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold">
              Our Services
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-burgundy hover:text-gold-dark transition-colors whitespace-nowrap"
          >
            View all &rarr;
          </Link>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 px-5 sm:px-8 mx-auto max-w-6xl w-max sm:w-auto">
          {services.map((service) => {
            const cover =
              service.cover_image_url || service.images?.[0]?.image_url;
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex-shrink-0 w-44 sm:w-56"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/30 bg-blush group-hover:border-gold group-hover:shadow-md transition-all">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-burgundy/40 text-sm text-center px-3">
                        {service.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 font-display text-base text-cream font-semibold leading-snug">
                    {service.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}