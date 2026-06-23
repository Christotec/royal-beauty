// Shared TypeScript types mirroring the Supabase schema (see supabase/schema.sql).

export type Category =
  | "human-hair"
  | "hair-extensions"
  | "hair-accessories"
  | "bags"
  | "shoes";

export const CATEGORY_LABELS: Record<Category, string> = {
  "human-hair": "100% Human Hair",
  "hair-extensions": "Hair Extensions",
  "hair-accessories": "Hair Accessories",
  bags: "Bags",
  shoes: "Shoes",
};

export const CATEGORY_LIST: Category[] = [
  "human-hair",
  "hair-extensions",
  "hair-accessories",
  "bags",
  "shoes",
];

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string; // e.g. "20 inch Straight", "Curly Bob", "One Size"
  price: number; // stored in Naira, whole numbers
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: Category;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  variants?: ProductVariant[];
}
