"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { slugify, type Category } from "@/lib/types";

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    setCategories((data ?? []) as Category[]);
    router.refresh();
  }

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `categories/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file);
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handlePhoto(cat: Category, file: File | undefined) {
    if (!file) return;
    setUploadingId(cat.id);
    setError("");
    try {
      const url = await uploadImage(file);
      const supabase = createClient();
      const { error: updErr } = await supabase
        .from("categories")
        .update({ image_url: url })
        .eq("id", cat.id);
      if (updErr) throw updErr;
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload photo.");
    } finally {
      setUploadingId(null);
    }
  }

  async function addCategory() {
    setError("");
    if (!newName.trim()) {
      setError("Type a category name first.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const baseSlug = slugify(newName);
    const slug = baseSlug + "-" + Math.random().toString(36).slice(2, 5);
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order), 0);

    const { error: insErr } = await supabase.from("categories").insert({
      name: newName.trim(),
      slug,
      sort_order: maxOrder + 1,
      is_active: true,
    });
    setBusy(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    setNewName("");
    refresh();
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    setBusy(true);
    const supabase = createClient();
    const { error: updErr } = await supabase
      .from("categories")
      .update({ name: editName.trim() })
      .eq("id", id);
    setBusy(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setEditingId(null);
    refresh();
  }

  async function toggleActive(cat: Category) {
    const supabase = createClient();
    await supabase
      .from("categories")
      .update({ is_active: !cat.is_active })
      .eq("id", cat.id);
    refresh();
  }

  async function deleteCategory(cat: Category) {
    const confirmed = window.confirm(
      `Delete "${cat.name}"? Products in this category will stay, but they will no longer show under this category. This cannot be undone.`
    );
    if (!confirmed) return;
    const supabase = createClient();
    const { error: delErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", cat.id);
    if (delErr) {
      alert(
        "Could not delete this category. It may still have products linked to it. Move those products to another category first, or hide this category instead."
      );
      return;
    }
    refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add new */}
      <div className="rounded-2xl border border-gold/30 bg-white p-5">
        <label className="block text-sm font-semibold text-charcoal mb-2">
          Add a new category
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Skincare, Perfumes, Jewelry"
            className="flex-1 rounded-lg border border-gold/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            onClick={addCategory}
            disabled={busy}
            className="rounded-full bg-burgundy text-cream px-6 py-2.5 text-sm font-semibold hover:bg-burgundy-dark transition-colors disabled:opacity-60"
          >
            Add
          </button>
        </div>
        {error && <p className="text-sm text-burgundy mt-3">{error}</p>}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {categories.length === 0 && (
          <p className="text-sm text-charcoal/60">No categories yet.</p>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 rounded-xl border border-gold/30 bg-white p-4"
          >
            {/* Photo + uploader */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-blush flex-shrink-0">
              {cat.image_url ? (
                <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[10px] text-burgundy/40 text-center px-1">
                  No photo
                </div>
              )}
            </div>
            <label className="text-xs font-semibold text-burgundy hover:text-gold-dark cursor-pointer whitespace-nowrap">
              {uploadingId === cat.id
                ? "Uploading..."
                : cat.image_url
                ? "Change"
                : "Add photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingId === cat.id}
                onChange={(e) => handlePhoto(cat, e.target.files?.[0])}
              />
            </label>

            {editingId === cat.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 rounded-lg border border-gold/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            ) : (
              <span className="flex-1 font-semibold text-sm text-charcoal">
                {cat.name}
              </span>
            )}

            <span
              className={`text-xs font-semibold rounded-full px-3 py-1 ${
                cat.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {cat.is_active ? "Visible" : "Hidden"}
            </span>

            {editingId === cat.id ? (
              <>
                <button
                  onClick={() => saveEdit(cat.id)}
                  disabled={busy}
                  className="text-sm font-semibold text-burgundy hover:text-gold-dark"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm font-semibold text-charcoal/60 hover:text-charcoal"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                  className="text-sm font-semibold text-burgundy hover:text-gold-dark"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(cat)}
                  className="text-sm font-semibold text-charcoal/70 hover:text-charcoal"
                >
                  {cat.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => deleteCategory(cat)}
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}