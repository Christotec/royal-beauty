"use client";

import Image from "next/image";
import { useState } from "react";
import { buildServiceWhatsAppLink } from "@/lib/whatsapp";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_1 || "2347013532484";

export default function ServiceCard({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border border-gold/30 bg-white overflow-hidden hover:border-gold hover:shadow-md transition-all">
      <div className="relative aspect-[4/3] bg-blush">
        {!imageFailed ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-display text-burgundy/40 text-base text-center px-4">
              {name}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          <h3 className="font-display text-lg text-burgundy font-semibold mb-2">
            {name}
          </h3>
          <p className="text-charcoal/70 text-sm leading-relaxed mb-5">
            {description}
          </p>
        </div>
        <a
          href={buildServiceWhatsAppLink(WHATSAPP_NUMBER, name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-center rounded-full bg-burgundy text-cream px-5 py-2.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
        >
          Book on WhatsApp
        </a>
      </div>
    </div>
  );
}