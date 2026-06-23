import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/whatsapp";

export default function ProductCard({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const lowestPrice = variants.length
    ? Math.min(...variants.map((v) => v.price))
    : null;
  const hasMultipleVariants = variants.length > 1;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-gold/30 bg-white overflow-hidden hover:shadow-lg hover:border-gold transition-all"
    >
      <div className="relative aspect-square bg-blush">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-burgundy/30 font-display text-sm">
            Royal Beauty
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="font-body font-semibold text-sm sm:text-base text-charcoal leading-snug line-clamp-2">
          {product.name}
        </h3>
        {lowestPrice !== null && (
          <p className="font-display text-burgundy font-semibold text-sm sm:text-base">
            {hasMultipleVariants ? "From " : ""}
            {formatNaira(lowestPrice)}
          </p>
        )}
      </div>
    </Link>
  );
}
