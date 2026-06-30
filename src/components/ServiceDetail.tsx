"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Service } from "@/lib/types";
import { buildServiceWhatsAppLink } from "@/lib/whatsapp";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_1 || "2347013532484";

export default function ServiceDetail({ service }: { service: Service }) {
  const images = service.images ?? [];
  const gallery = images.length
    ? images.map((i) => i.image_url)
    : service.cover_image_url
    ? [service.cover_image_url]
    : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = gallery[activeIdx];

  const whatsappLink = buildServiceWhatsAppLink(WHATSAPP_NUMBER, service.name);

  return (
    <div>
      <Link
        href="/services"
        className="inline-block text-sm font-semibold text-burgundy hover:text-gold-dark transition-colors mb-6"
      >
        &larr; All Services
      </Link>

      <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-blush border border-gold/30">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={service.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-burgundy/40 text-lg">
                  {service.name}
                </span>
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {gallery.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === activeIdx ? "border-gold" : "border-transparent"
                  }`}
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold-dark font-semibold mb-3">
            Salon Service
          </p>
          <h1 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold mb-4">
            {service.name}
          </h1>
          {service.description && (
            <p className="text-charcoal/75 leading-relaxed mb-8 text-sm sm:text-base">
              {service.description}
            </p>
          )}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-burgundy text-cream px-8 py-4 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
          >
            Book on WhatsApp
          </a>
          <p className="text-xs text-charcoal/50 mt-3">
            You&apos;ll be taken to WhatsApp to confirm a time and arrange your
            appointment directly with us. You can also walk in at our Karsana,
            Abuja location.
          </p>
        </div>
      </div>
    </div>
  );
}