-- Royal Beauty Unisex Salon — Supabase schema
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run

-- ============================================================
-- 1. PRODUCTS TABLE
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text not null check (category in (
    'human-hair', 'hair-extensions', 'hair-accessories', 'bags', 'shoes'
  )),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. PRODUCT VARIANTS TABLE (size/color/style options, each with its own price)
-- ============================================================
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,           -- e.g. "20 inch Straight", "One Size"
  price numeric(10, 2) not null,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_variants_product_id on product_variants(product_id);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_is_active on products(is_active);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- Public (anonymous) visitors can only READ active products.
-- Only authenticated users (the admin account you create) can write.
-- ============================================================
alter table products enable row level security;
alter table product_variants enable row level security;

create policy "Public can view active products"
  on products for select
  using (is_active = true);

create policy "Authenticated users can view all products"
  on products for select
  to authenticated
  using (true);

create policy "Authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update products"
  on products for update
  to authenticated
  using (true);

create policy "Authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);

create policy "Public can view variants of active products"
  on product_variants for select
  using (
    exists (
      select 1 from products
      where products.id = product_variants.product_id
      and products.is_active = true
    )
  );

create policy "Authenticated users can view all variants"
  on product_variants for select
  to authenticated
  using (true);

create policy "Authenticated users can insert variants"
  on product_variants for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update variants"
  on product_variants for update
  to authenticated
  using (true);

create policy "Authenticated users can delete variants"
  on product_variants for delete
  to authenticated
  using (true);

-- ============================================================
-- 4. STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
