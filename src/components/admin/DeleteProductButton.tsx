"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${productName}"? This will remove it and all its options permanently.`
    );
    if (!confirmed) return;

    setLoading(true);
    const supabase = createClient();

    // product_variants has ON DELETE CASCADE, so deleting the product
    // automatically removes its variants too.
    const { error } = await supabase.from("products").delete().eq("id", productId);

    setLoading(false);

    if (error) {
      alert("Could not delete product: " + error.message);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
