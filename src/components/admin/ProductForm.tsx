"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product, ProductVariant } from "@/lib/types";

type VariantDraft = {
  id: string;
  label: string;
  price: string;
  image_url: string | null;
  imageFile: File | null;
  isExisting: boolean;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function makeTempId() {
  return `tmp_${Math.random().toString(36).slice(2)}`;
}

export default function ProductForm({
  existingProduct,
  categories,
}: {
  existingProduct?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const isEditing = !!existingProduct;

  const [name, setName] = useState(existingProduct?.name ?? "");
  const [description, setDescription] = useState(existingProduct?.description ?? "");
  const [categoryId, setCategoryId] = useState<string>(
    existingProduct?.category_id ?? categories[0]?.id ?? ""
  );
  const [isActive, setIsActive] = useState(existingProduct?.is_active ?? true);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(existingProduct?.image_url ?? null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const [variants, setVariants] = useState<VariantDraft[]>(
    existingProduct?.variants?.length
      ? existingProduct.variants.map((v: ProductVariant) => ({
          id: v.id,
          label: v.label,
          price: String(v.price),
          image_url: v.image_url,
          imageFile: null,
          isExisting: true,
        }))
      : [{ id: makeTempId(), label: "", price: "", image_url: null, imageFile: null, isExisting: false }]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addVariant() {
    setVariants((v) => [
      ...v,
      { id: makeTempId(), label: "", price: "", image_url: null, imageFile: null, isExisting: false },
    ]);
  }

  function removeVariant(id: string) {
    setVariants((v) => v.filter((variant) => variant.id !== id));
  }

  function updateVariant(id: string, patch: Partial<VariantDraft>) {
    setVariants((v) => v.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)));
  }

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    const validVariants = variants.filter((v) => v.label.trim() && v.price.trim());
    if (validVariants.length === 0) {
      setError("Add at least one option with a label and price.");
      return;
    }
    if (!categoryId) {
      setError("Please choose a category. If there are none, add one under Categories first.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      let finalMainImageUrl = mainImageUrl;
      if (mainImageFile) {
        finalMainImageUrl = await uploadImage(mainImageFile);
      }

      const slug = isEditing ? existingProduct!.slug : slugify(name) + "-" + Math.random().toString(36).slice(2, 6);

      let productId = existingProduct?.id;

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("products")
          .update({
            name,
            description: description || null,
            category_id: categoryId,
            image_url: finalMainImageUrl,
            is_active: isActive,
          })
          .eq("id", productId);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert({
            name,
            slug,
            description: description || null,
            category_id: categoryId,
            image_url: finalMainImageUrl,
            is_active: isActive,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        productId = data.id;
      }

      for (let i = 0; i < validVariants.length; i++) {
        const v = validVariants[i];
        let variantImageUrl = v.image_url;
        if (v.imageFile) {
          variantImageUrl = await uploadImage(v.imageFile);
        }

        if (v.isExisting) {
          const { error: variantError } = await supabase
            .from("product_variants")
            .update({
              label: v.label,
              price: parseFloat(v.price),
              image_url: variantImageUrl,
              sort_order: i,
            })
            .eq("id", v.id);
          if (variantError) throw variantError;
        } else {
          const { error: variantError } = await supabase.from("product_variants").insert({
            product_id: productId,
            label: v.label,
            price: parseFloat(v.price),
            image_url: variantImageUrl,
            sort_order: i,
          });
          if (variantError) throw variantError;
        }
      }

      if (isEditing && existingProduct?.variants) {
        const remainingIds = new Set(validVariants.filter((v) => v.isExisting).map((v) => v.id));
        const removedIds = existingProduct.variants
          .filter((v) => !remainingIds.has(v.id))
          .map((v) => v.id);

        if (removedIds.length > 0) {
          const { error: deleteError } = await supabase
            .from("product_variants")
            .delete()
            .in("id", removedIds);
          if (deleteError) throw deleteError;
        }
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <p className="text-sm text-burgundy bg-blush rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="rounded-2xl border border-gold/30 bg-white p-6">
        <h2 className="font-display text-lg text-burgundy font-semibold mb-5">
          Product Details
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 20 Inch Straight Bone Straight Wig"
              className="w-full rounded-lg border border-gold/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Soft, natural-looking, long-lasting. Describe the product."
              className="w-full rounded-lg border border-gold/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Category
            </label>
            {categories.length === 0 ? (
              <p className="text-sm text-burgundy bg-blush rounded-lg px-3 py-2">
                No categories yet. Add one under the Categories tab first.
              </p>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-gold/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Main Photo
            </label>
            <div className="flex items-center gap-4">
              {mainImageUrl && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-blush flex-shrink-0">
                  <Image src={mainImageUrl} alt="Product" fill className="object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMainImageFile(file);
                    setMainImageUrl(URL.createObjectURL(file));
                  }
                }}
                className="text-sm"
              />
            </div>
            <p className="text-xs text-charcoal/50 mt-1">
              Used as the default photo. Each option below can have its own
              photo too (e.g. if styles look different).
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
            Visible on the website
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-gold/30 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg text-burgundy font-semibold">
            Options &amp; Pricing
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm font-semibold text-burgundy hover:text-gold-dark transition-colors"
          >
            + Add Option
          </button>
        </div>

        <p className="text-xs text-charcoal/50 mb-4">
          Add one option per size, length, or style, each with its own price.
          For a single-price item (like a bag), just add one option called
          &quot;One Size&quot; or similar.
        </p>

        <div className="flex flex-col gap-4">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end border border-gold/20 rounded-lg p-3"
            >
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  Option Label
                </label>
                <input
                  type="text"
                  value={variant.label}
                  onChange={(e) => updateVariant(variant.id, { label: e.target.value })}
                  placeholder="e.g. 20 inch Curly"
                  className="w-full rounded-lg border border-gold/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  Price (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  value={variant.price}
                  onChange={(e) => updateVariant(variant.id, { price: e.target.value })}
                  placeholder="e.g. 45000"
                  className="w-full rounded-lg border border-gold/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      updateVariant(variant.id, {
                        imageFile: file,
                        image_url: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className="text-xs w-36"
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariant(variant.id)}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors mb-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-burgundy text-cream px-7 py-3 text-sm font-semibold hover:bg-burgundy-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border-2 border-gold/40 text-charcoal px-7 py-3 text-sm font-semibold hover:border-gold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}