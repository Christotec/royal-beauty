"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { slugify, type Service, type ServiceImage } from "@/lib/types";

type PhotoDraft = {
  id: string;
  image_url: string;
  file: File | null;
  isExisting: boolean;
};

function makeTempId() {
  return `tmp_${Math.random().toString(36).slice(2)}`;
}

export default function ServiceForm({
  existingService,
}: {
  existingService?: Service;
}) {
  const router = useRouter();
  const isEditing = !!existingService;

  const [name, setName] = useState(existingService?.name ?? "");
  const [description, setDescription] = useState(existingService?.description ?? "");
  const [isActive, setIsActive] = useState(existingService?.is_active ?? true);

  const [photos, setPhotos] = useState<PhotoDraft[]>(
    existingService?.images?.length
      ? existingService.images.map((img: ServiceImage) => ({
          id: img.id,
          image_url: img.image_url,
          file: null,
          isExisting: true,
        }))
      : []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const newOnes: PhotoDraft[] = Array.from(files).map((file) => ({
      id: makeTempId(),
      image_url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));
    setPhotos((p) => [...p, ...newOnes]);
  }

  function removePhoto(id: string) {
    setPhotos((p) => p.filter((photo) => photo.id !== id));
  }

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `services/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file);
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Service name is required.");
      return;
    }
    setSaving(true);

    try {
      const supabase = createClient();

      const uploadedUrls: { id: string; url: string }[] = [];
      for (const photo of photos) {
        if (!photo.isExisting && photo.file) {
          const url = await uploadImage(photo.file);
          uploadedUrls.push({ id: photo.id, url });
        }
      }

      const firstPhoto = photos[0];
      let coverUrl: string | null = null;
      if (firstPhoto) {
        if (firstPhoto.isExisting) coverUrl = firstPhoto.image_url;
        else {
          const found = uploadedUrls.find((u) => u.id === firstPhoto.id);
          coverUrl = found?.url ?? null;
        }
      }

      let serviceId = existingService?.id;

      if (isEditing) {
        const { error: updErr } = await supabase
          .from("services")
          .update({
            name,
            description: description || null,
            cover_image_url: coverUrl,
            is_active: isActive,
          })
          .eq("id", serviceId);
        if (updErr) throw updErr;
      } else {
        const slug = slugify(name) + "-" + Math.random().toString(36).slice(2, 6);
        const { data, error: insErr } = await supabase
          .from("services")
          .insert({
            name,
            slug,
            description: description || null,
            cover_image_url: coverUrl,
            is_active: isActive,
            sort_order: 999,
          })
          .select()
          .single();
        if (insErr) throw insErr;
        serviceId = data.id;
      }

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (!photo.isExisting) {
          const found = uploadedUrls.find((u) => u.id === photo.id);
          if (found) {
            const { error: imgErr } = await supabase.from("service_images").insert({
              service_id: serviceId,
              image_url: found.url,
              sort_order: i,
            });
            if (imgErr) throw imgErr;
          }
        } else {
          await supabase
            .from("service_images")
            .update({ sort_order: i })
            .eq("id", photo.id);
        }
      }

      if (isEditing && existingService?.images) {
        const stillHere = new Set(
          photos.filter((p) => p.isExisting).map((p) => p.id)
        );
        const removed = existingService.images
          .filter((img) => !stillHere.has(img.id))
          .map((img) => img.id);
        if (removed.length > 0) {
          await supabase.from("service_images").delete().in("id", removed);
        }
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
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
          Service Details
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hydra Facial, Bridal Makeup"
              className="w-full rounded-lg border border-gold/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the service so customers know what to expect."
              className="w-full rounded-lg border border-gold/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
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
        <h2 className="font-display text-lg text-burgundy font-semibold mb-2">
          Photos
        </h2>
        <p className="text-xs text-charcoal/50 mb-4">
          Add as many photos as you like. The first photo becomes the main
          cover shown on the homepage. Customers see all photos when they open
          the service.
        </p>

        <label className="inline-block rounded-full border-2 border-gold/40 text-charcoal px-5 py-2.5 text-sm font-semibold hover:border-gold transition-colors cursor-pointer">
          + Add Photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => addPhotos(e.target.files)}
            className="hidden"
          />
        </label>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-blush border border-gold/30"
              >
                <Image src={photo.image_url} alt="" fill className="object-cover" />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] font-semibold bg-burgundy text-cream px-2 py-0.5 rounded-full">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
                  aria-label="Remove photo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-burgundy text-cream px-7 py-3 text-sm font-semibold hover:bg-burgundy-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Service"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="rounded-full border-2 border-gold/40 text-charcoal px-7 py-3 text-sm font-semibold hover:border-gold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}