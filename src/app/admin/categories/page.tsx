import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
      <h1 className="font-display text-2xl text-burgundy font-semibold mb-2">
        Categories
      </h1>
      <p className="text-sm text-charcoal/60 mb-8">
        These are the product groups shown in your shop (like Human Hair, Bags,
        Shoes). Add a new one any time, or hide ones you are not using.
      </p>
      <CategoriesManager initialCategories={(data ?? []) as Category[]} />
    </div>
  );
}