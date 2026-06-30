-- Royal Beauty — Migration v2
-- Adds: categories table, services table, service_images table.
-- Converts products.category (text) to reference the categories table.
-- SAFE TO RUN ONCE on your existing database. Run in Supabase SQL Editor.

-- ============================================================
-- 1. CATEGORIES TABLE
-- ============================================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order integer not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed the 5 existing categories (only if they don't already exist)
insert into categories (slug, name, sort_order) values
  ('human-hair', '100% Human Hair', 1),
  ('hair-extensions', 'Hair Extensions', 2),
  ('hair-accessories', 'Hair Accessories', 3),
  ('bags', 'Bags', 4),
  ('shoes', 'Shoes', 5)
on conflict (slug) do nothing;

-- ============================================================
-- 2. LINK PRODUCTS TO CATEGORIES
-- Add a category_id column. Keep the old text column for now so nothing breaks.
-- ============================================================
alter table products add column if not exists category_id uuid references categories(id);

-- Backfill: match each product's existing text category to the new table
update products p
set category_id = c.id
from categories c
where p.category = c.slug
and p.category_id is null;

-- ============================================================
-- 3. SERVICES TABLE
-- ============================================================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  cover_image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. SERVICE IMAGES TABLE (multiple photos per service)
-- ============================================================
create table if not exists service_images (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_service_images_service_id on service_images(service_id);

-- Seed the 5 starting services she can edit or delete
insert into services (slug, name, description, sort_order) values
  ('hydra-facial', 'Hydra Facial', 'Deep cleansing, hydrating facial treatment for a refreshed, glowing complexion.', 1),
  ('professional-makeup', 'Professional Makeup', 'Bridal, event and everyday makeup application by our skilled artists.', 2),
  ('braiding-services', 'Braiding Services', 'All styles of cornrows and braids, neatly and skillfully done.', 3),
  ('wig-revamping', 'Wig Revamping', 'Bring an old wig back to life: washing, styling, and restoring its shine.', 4),
  ('barbing', 'Barbing', 'Sharp, clean cuts and lineups for men and boys.', 5)
on conflict (slug) do nothing;

-- ============================================================
-- 5. ROW LEVEL SECURITY for new tables
-- ============================================================
alter table categories enable row level security;
alter table services enable row level security;
alter table service_images enable row level security;

-- CATEGORIES policies
create policy "Public can view active categories"
  on categories for select using (is_active = true);
create policy "Authenticated can view all categories"
  on categories for select to authenticated using (true);
create policy "Authenticated can insert categories"
  on categories for insert to authenticated with check (true);
create policy "Authenticated can update categories"
  on categories for update to authenticated using (true);
create policy "Authenticated can delete categories"
  on categories for delete to authenticated using (true);

-- SERVICES policies
create policy "Public can view active services"
  on services for select using (is_active = true);
create policy "Authenticated can view all services"
  on services for select to authenticated using (true);
create policy "Authenticated can insert services"
  on services for insert to authenticated with check (true);
create policy "Authenticated can update services"
  on services for update to authenticated using (true);
create policy "Authenticated can delete services"
  on services for delete to authenticated using (true);

-- SERVICE IMAGES policies
create policy "Public can view images of active services"
  on service_images for select using (
    exists (select 1 from services where services.id = service_images.service_id and services.is_active = true)
  );
create policy "Authenticated can view all service images"
  on service_images for select to authenticated using (true);
create policy "Authenticated can insert service images"
  on service_images for insert to authenticated with check (true);
create policy "Authenticated can update service images"
  on service_images for update to authenticated using (true);
create policy "Authenticated can delete service images"
  on service_images for delete to authenticated using (true);