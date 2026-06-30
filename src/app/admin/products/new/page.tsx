import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
      <h1 className="font-display text-2xl text-burgundy font-semibold mb-8">
        Add Product
      </h1>
      <ProductForm categories={(data ?? []) as Category[]} />
    </div>
  );
}