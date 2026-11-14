-- ============================================================================
-- VAULT 876 — Phase 6: Owner self-service content manager
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER schema.sql / phase4 / phase5.
-- Safe to re-run (idempotent).
--
-- What this adds, so the salon owner can update her OWN website from /admin:
--   1. services     — editable menu (prices, copy, styles). Already created in
--                     schema.sql; here we add the `copy`/`active` columns and
--                     the WRITE policies so a signed-in admin can edit prices.
--                     The website menu, the booking form AND the Stripe
--                     "pay in full" amount all read from this one table, so a
--                     price edit can never desync from what the client is charged.
--   2. site_content — free-text policy blocks (cancellations, lateness, etc.)
--                     shown in the "Good to know" section + on the booking page.
--   3. site_media   — one image/video per site panel (hero + the gallery),
--                     plus the Storage bucket the files live in.
--
-- 🔐 ACCESS MODEL (same spirit as the rest of the app):
--     • Public (anon) can READ services, site_content and site_media — the
--       live website needs them.
--     • Only a signed-in admin (authenticated) can INSERT / UPDATE / DELETE.
--       There is no public self-signup, so only the salon owner can edit.
-- ============================================================================


-- ============ 1 · SERVICES (editable menu) ==================================
-- `copy` is the one-line description shown on the menu; `active` lets the owner
-- hide a service without deleting it.
alter table public.services add column if not exists copy   text;
alter table public.services add column if not exists active boolean not null default true;

-- Backfill the descriptions so the live menu keeps its wording on first run.
update public.services set copy = coalesce(copy, d.copy) from (values
  ('wig-installations',  'Polished wig styling to help you step out feeling confident.'),
  ('relaxers',           'Smooth, healthy relaxing for a sleek, manageable finish that lasts.'),
  ('braid-extensions',   'Neat, long-lasting braid extensions, styled to protect and flatter.'),
  ('kids-hair-braiding', 'Gentle, patient braiding for little ones, with styles they will love.'),
  ('eyelash-extensions', 'Full, flattering lashes that open up and lift the whole look.'),
  ('locs',               'Expert loc starting, retwisting and styling, cared for with real attention.')
) as d(slug, copy) where public.services.slug = d.slug;

-- The owner edits the menu, so a signed-in admin needs full write access.
-- (schema.sql already grants public SELECT; we leave that in place.)
drop policy if exists "authenticated can write services" on public.services;
create policy "authenticated can write services" on public.services
  for all to authenticated using (true) with check (true);

grant insert, update, delete on public.services to authenticated;


-- ============ 2 · SITE CONTENT (rules & policies) ===========================
create table if not exists public.site_content (
  key         text primary key,            -- stable id, e.g. 'cancellation'
  title       text not null,
  body        text not null default '',
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "anon can read site_content" on public.site_content;
create policy "anon can read site_content" on public.site_content
  for select to anon using (true);

drop policy if exists "authenticated can read site_content" on public.site_content;
create policy "authenticated can read site_content" on public.site_content
  for select to authenticated using (true);

drop policy if exists "authenticated can write site_content" on public.site_content;
create policy "authenticated can write site_content" on public.site_content
  for all to authenticated using (true) with check (true);

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

-- Seed the starting policy blocks (only if they don't exist yet — never
-- overwrites the owner's own wording on a re-run).
insert into public.site_content (key, title, body, sort_order) values
  ('deposit',      'Deposits & payment',
   'A £20 deposit secures your appointment and comes off your final total. You can also choose to pay in full when you book. The balance is settled in the salon.', 1),
  ('cancellation', 'Cancellations & rescheduling',
   'Please give at least 48 hours'' notice to cancel or move your appointment. Deposits for appointments cancelled with less notice cannot be refunded.', 2),
  ('lateness',     'Running late',
   'If you''re more than 15 minutes late we may need to shorten or rebook your appointment so the next client isn''t kept waiting. A quick call always helps.', 3),
  ('preparation',  'Before you arrive',
   'Come with your hair washed and blow-dried unless your service includes it. Bring any extensions or hair pieces you''d like us to use, and a reference photo if you have one.', 4)
on conflict (key) do nothing;


-- ============ 3 · SITE MEDIA (photos / video per panel) =====================
-- One row per panel. `panel_id` matches the ids the website components look up
-- (hero, work_1 … work_5). `filters` stores the chosen look (preset + slider
-- values) so a video can keep its filter at display time and an image can be
-- re-edited later — images are also baked with the filter at upload.
create table if not exists public.site_media (
  id         uuid primary key default gen_random_uuid(),
  panel_id   text unique not null,
  media_url  text not null,
  media_type text not null default 'image',          -- 'image' | 'video'
  filters    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_media
  add constraint site_media_type_check
  check (media_type in ('image', 'video')) not valid;

alter table public.site_media enable row level security;

drop policy if exists "anon can read site_media" on public.site_media;
create policy "anon can read site_media" on public.site_media
  for select to anon using (true);

drop policy if exists "authenticated can read site_media" on public.site_media;
create policy "authenticated can read site_media" on public.site_media
  for select to authenticated using (true);

drop policy if exists "authenticated can write site_media" on public.site_media;
create policy "authenticated can write site_media" on public.site_media
  for all to authenticated using (true) with check (true);

grant select on public.site_media to anon, authenticated;
grant insert, update, delete on public.site_media to authenticated;


-- ============ 4 · STORAGE BUCKET for the uploaded files ======================
-- Public bucket so the live site can show the images/videos by URL. (You can
-- also create this in Dashboard → Storage → New bucket → name "site_media",
-- Public = on — this statement does the same thing.)
insert into storage.buckets (id, name, public)
values ('site_media', 'site_media', true)
on conflict (id) do update set public = true;

-- Anyone may READ files in this bucket (it's public); only a signed-in admin
-- may upload, replace or delete them.
drop policy if exists "site_media public read" on storage.objects;
create policy "site_media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'site_media');

drop policy if exists "site_media admin insert" on storage.objects;
create policy "site_media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site_media');

drop policy if exists "site_media admin update" on storage.objects;
create policy "site_media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'site_media') with check (bucket_id = 'site_media');

drop policy if exists "site_media admin delete" on storage.objects;
create policy "site_media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site_media');
