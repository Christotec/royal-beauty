import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

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
        {product.category?.name ?? ""}
      </p>
      <ProductDetail product={product} />
    </main>
  );
}