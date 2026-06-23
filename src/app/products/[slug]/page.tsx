import { getProductBySlug } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark font-semibold mb-3">
        {CATEGORY_LABELS[product.category]}
      </p>
      <ProductDetail product={product} />
    </main>
  );
}
