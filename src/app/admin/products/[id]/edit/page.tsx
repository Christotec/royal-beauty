import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Product, Category } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product, error }, { data: cats }] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (error || !product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
      <h1 className="font-display text-2xl text-burgundy font-semibold mb-8">
        Edit Product
      </h1>
      <ProductForm
        existingProduct={product as Product}
        categories={(cats ?? []) as Category[]}
      />
    </div>
  );
}