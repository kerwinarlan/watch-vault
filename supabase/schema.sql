-- The Watch Alley PH (watch-vault) — Supabase schema
-- Run in the Supabase SQL editor, then run seed.sql for sample data.

create table if not exists public.watches (
  id bigint generated always as identity primary key,
  title text not null,
  brand text not null,
  reference text,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'PHP')),
  condition text not null default 'New' check (condition in ('New', 'Pre-owned', 'Mint')),
  status text not null default 'Available' check (status in ('Available', 'Reserved', 'Sold')),
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.watches enable row level security;

-- Public read: anyone with the anon key can browse the catalog.
create policy "watches_public_read" on public.watches
  for select using (true);

-- Admin write: authenticated users only.
-- The admin dashboard writes through the service-role key server-side
-- (app/api/admin/watches/route.ts), which bypasses RLS. These policies
-- guard the database directly and enable a future Supabase Auth login.
create policy "watches_admin_insert" on public.watches
  for insert to authenticated with check (true);

create policy "watches_admin_update" on public.watches
  for update to authenticated using (true) with check (true);

create policy "watches_admin_delete" on public.watches
  for delete to authenticated using (true);

-- Catalog filter indexes
create index if not exists watches_brand_idx on public.watches (brand);
create index if not exists watches_status_idx on public.watches (status);
