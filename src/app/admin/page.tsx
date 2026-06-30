import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/whatsapp";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
  }

  const list = (products ?? []) as Product[];

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-burgundy font-semibold mb-1">
            Products
          </h1>
          <p className="text-sm text-charcoal/60">
            {list.length} product{list.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-burgundy text-cream px-5 py-2.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gold/40 rounded-2xl">
          <p className="font-display text-lg text-burgundy mb-2">
            No products yet
          </p>
          <p className="text-charcoal/60 text-sm mb-6">
            Add your first product to start building the shop.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-block rounded-full bg-burgundy text-cream px-6 py-3 text-sm font-semibold hover:bg-burgundy-dark transition-colors"
          >
            + Add Product
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((product) => {
            const variants = product.variants ?? [];
            const lowestPrice = variants.length
              ? Math.min(...variants.map((v) => v.price))
              : null;

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-xl border border-gold/30 bg-white p-4"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-blush flex-shrink-0">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-charcoal truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-charcoal/60">
                    {product.category?.name ?? "Uncategorized"} &middot;{" "}
                    {variants.length} option{variants.length === 1 ? "" : "s"}
                    {lowestPrice !== null && ` · from ${formatNaira(lowestPrice)}`}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 ${
                    product.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {product.is_active ? "Visible" : "Hidden"}
                </span>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm font-semibold text-burgundy hover:text-gold-dark transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}