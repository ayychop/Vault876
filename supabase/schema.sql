-- ============================================================================
-- VAULT 876 — Supabase schema for live bookings + services
-- ----------------------------------------------------------------------------
-- HOW TO RUN: Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run more than once (idempotent). It creates/aligns the tables, opens
-- the row-level-security policies the public site needs, and seeds the menu.
--
-- 🔐 ACCESS MODEL:
--     • Anyone (anon) can INSERT a booking — that's the public booking form.
--     • Only a logged-in admin (Supabase Auth) can READ bookings — the owner
--       portal at /admin requires sign-in, so client names + phone numbers are
--       never exposed to the public anon key.
--     • The service menu is public, read-only.
--
--     CREATE THE ADMIN LOGIN: Dashboard → Authentication → Users → "Add user"
--       → email: info@boanetworks.com, set a password, and TICK
--       "Auto Confirm User" so it works immediately. Add the salon owner's email
--       the same way when she's ready — there is no public self-signup.
-- ============================================================================

-- ============ SERVICES ======================================================
create table if not exists public.services (
  slug        text primary key,
  name        text not null,
  price       numeric not null default 0,
  duration    text,
  styles      jsonb  not null default '[]'::jsonb,
  sort_order  int    not null default 0
);

-- ============ BOOKINGS ======================================================
-- Human-friendly reference (VB-1043, VB-1044, …) continuing past the demo data.
create sequence if not exists public.bookings_ref_seq start 1043;

create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  ref              text not null default ('VB-' || nextval('public.bookings_ref_seq')),
  created_at       timestamptz not null default now(),
  client_name      text not null,
  client_phone     text not null,
  client_email     text,
  service          text not null,
  service_slug     text,
  style            text,
  price            numeric not null default 0,
  appointment_date date,
  appointment_time text,
  status           text not null default 'Pending',
  photo_name       text
);

-- Bring an already-existing bookings table up to the expected shape.
alter table public.bookings add column if not exists ref              text;
alter table public.bookings add column if not exists created_at       timestamptz not null default now();
alter table public.bookings add column if not exists client_name      text;
alter table public.bookings add column if not exists client_phone     text;
alter table public.bookings add column if not exists client_email     text;
alter table public.bookings add column if not exists service          text;
alter table public.bookings add column if not exists service_slug     text;
alter table public.bookings add column if not exists style            text;
alter table public.bookings add column if not exists price            numeric not null default 0;
alter table public.bookings add column if not exists appointment_date date;
alter table public.bookings add column if not exists appointment_time text;
alter table public.bookings add column if not exists status           text not null default 'Pending';
alter table public.bookings add column if not exists photo_name       text;

-- ============ ROW-LEVEL SECURITY ===========================================
alter table public.bookings enable row level security;
alter table public.services enable row level security;

-- Public booking form inserts new bookings (no login needed).
drop policy if exists "anon can insert bookings" on public.bookings;
create policy "anon can insert bookings" on public.bookings
  for insert to anon with check (true);

-- Owner portal reads require a signed-in admin (Supabase Auth). The old public
-- read policy is dropped so the anon key can no longer read client data.
drop policy if exists "anon can read bookings" on public.bookings;
drop policy if exists "authenticated can read bookings" on public.bookings;
create policy "authenticated can read bookings" on public.bookings
  for select to authenticated using (true);

-- Service menu is public, read-only (site + portal).
drop policy if exists "anon can read services" on public.services;
create policy "anon can read services" on public.services
  for select to anon using (true);
drop policy if exists "authenticated can read services" on public.services;
create policy "authenticated can read services" on public.services
  for select to authenticated using (true);

-- PostgREST also needs table-level privileges alongside the RLS policies.
grant usage on schema public to anon, authenticated;
grant insert on public.bookings to anon;
grant select on public.bookings to authenticated;
grant select on public.services to anon, authenticated;
grant usage, select on sequence public.bookings_ref_seq to anon;

-- ============ SEED THE SERVICE MENU ========================================
insert into public.services (slug, name, price, duration, styles, sort_order) values
  ('wig-installations',  'Wig installations',  65, '2 hr',      '["Lace frontal","Lace closure","360 install","Glueless install"]', 1),
  ('relaxers',           'Relaxers',           45, '1 hr 30',   '["Full relaxer","Regrowth retouch"]', 2),
  ('braid-extensions',   'Braid extensions',   90, '3 hr',      '["Knotless braids","Box braids","Cornrows","Feed-in braids","Fulani braids","Ghana braids","Boho braids","Passion twists"]', 3),
  ('kids-hair-braiding', 'Kids hair braid',    35, '1 hr 30',   '["Cornrows","Box braids","Twists","Beads & cuffs"]', 4),
  ('eyelash-extensions', 'Eyelash extensions', 45, '1 hr 30',   '["Classic","Hybrid","Volume","Mega volume"]', 5),
  ('locs',               'Locs',               70, '2 hr 30',   '["Starter locs","Retwist & maintenance","Interlocking","Barrel twists","Faux locs","Two-strand twists","Bantu knots","Twist-out"]', 6)
on conflict (slug) do update set
  name       = excluded.name,
  price      = excluded.price,
  duration   = excluded.duration,
  styles     = excluded.styles,
  sort_order = excluded.sort_order;
