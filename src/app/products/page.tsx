import { getActiveProducts } from "@/lib/products";
import { CATEGORY_LIST, CATEGORY_LABELS, type Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = CATEGORY_LIST.includes(params.category as Category)
    ? (params.category as Category)
    : undefined;

  const products = await getActiveProducts(activeCategory);

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-burgundy font-semibold mb-2">
          Shop
        </h1>
        <p className="text-charcoal/70 text-sm sm:text-base">
          Tap any item to see pricing for each size or style, then order
          straight on WhatsApp.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/products"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            !activeCategory
              ? "bg-burgundy text-cream"
              : "bg-white border border-gold/40 text-charcoal hover:border-gold"
          }`}
        >
          All
        </Link>
        {CATEGORY_LIST.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${cat}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? "bg-burgundy text-cream"
                : "bg-white border border-gold/40 text-charcoal hover:border-gold"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gold/40 rounded-2xl">
          <p className="font-display text-lg text-burgundy mb-2">
            Nothing here yet
          </p>
          <p className="text-charcoal/60 text-sm">
            New pieces are added regularly, check back soon or message us on
            WhatsApp for what&apos;s currently in stock.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
