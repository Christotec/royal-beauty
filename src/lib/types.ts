// Shared TypeScript types mirroring the Supabase schema.

export interface Category {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string; // e.g. "20 inch Straight", "Curly Bob", "One Size"
  price: number; // stored in Naira
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  variants?: ProductVariant[];
  category?: Category | null;
}

export interface ServiceImage {
  id: string;
  service_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  images?: ServiceImage[];
}

// Helper to turn a name into a URL-friendly slug
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}