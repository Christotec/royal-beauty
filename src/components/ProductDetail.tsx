"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { buildProductWhatsAppLink, formatNaira } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_1 || "2347013532484";

export default function ProductDetail({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const [selectedId, setSelectedId] = useState(variants[0]?.id);

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const displayImage = selected?.image_url || product.image_url;

  const whatsappLink = selected
    ? buildProductWhatsAppLink(
        WHATSAPP_NUMBER,
        product.name,
        selected.label,
        selected.price
      )
    : "#";

  return (
    <div className="grid sm:grid-cols-2 gap-10">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-blush border border-gold/30">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={`${product.name}${selected ? ` - ${selected.label}` : ""}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-burgundy/30 font-display text-lg">
            Royal Beauty
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-burgundy font-semibold mb-3">
          {product.name}
        </h1>

        {product.description && (
          <p className="text-charcoal/75 leading-relaxed mb-6 text-sm sm:text-base">
            {product.description}
          </p>
        )}

        {variants.length > 0 && (
          <>
            <p className="text-xs uppercase tracking-[0.16em] text-gold-dark font-semibold mb-3">
              Choose an option
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedId(variant.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                    selectedId === variant.id
                      ? "bg-burgundy text-cream border-burgundy"
                      : "bg-white text-charcoal border-gold/40 hover:border-gold"
                  }`}
                >
                  {variant.label}
                </button>
              ))}
            </div>

            {selected && (
              <p className="font-display text-2xl text-burgundy font-semibold mb-8">
                {formatNaira(selected.price)}
              </p>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-burgundy text-cream px-8 py-4 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
            >
              Buy on WhatsApp
            </a>
            <p className="text-xs text-charcoal/50 mt-3">
              You&apos;ll be taken to WhatsApp to confirm availability and
              arrange payment and delivery directly with us.
            </p>
          </>
        )}

        {variants.length === 0 && (
          <p className="text-charcoal/60 text-sm">
            This product currently has no options available. Please check
            back soon.
          </p>
        )}
      </div>
    </div>
  );
}
