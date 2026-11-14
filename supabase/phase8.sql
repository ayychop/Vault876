-- ============================================================================
-- VAULT 876 — Phase 8: let signed-in users book too (booking-form bugfix)
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER the earlier phases. Safe to re-run
-- (idempotent).
--
-- THE BUG IT FIXES:
--   The booking form was failing with "We couldn't save your booking just now"
--   — but ONLY for the salon owner, and ONLY while she was signed into /admin in
--   the same browser. A logged-out public visitor could book fine.
--
--   Why: the whole app shares one Supabase client with persistSession = true, so
--   once the owner signs into the admin portal her login token is attached to
--   EVERY request — including the public booking form. That makes the booking
--   INSERT run as the `authenticated` role instead of `anon`.
--
--   Every insert policy + grant up to now was scoped to `anon` only (see
--   schema.sql / phase4 / phase5). The `authenticated` role had no INSERT policy,
--   no table INSERT privilege, and no grant on the ref sequence — so Postgres
--   rejected the row ("new row violates row-level security policy" / "permission
--   denied"), which the form shows as the generic save error.
--
-- THE FIX:
--   Allow `authenticated` to insert bookings too, under the EXACT SAME
--   constraints as `anon`. This is safe: the WITH CHECK still forces every
--   anon- OR admin-created row to be UNPAID and unconfirmed, so no one — signed
--   in or not — can forge a paid/Confirmed booking. Only the service-role Stripe
--   webhook can do that. Admin READ access is unchanged.
-- ============================================================================

-- One insert policy covering BOTH the public (anon) and any signed-in user
-- (authenticated). WITH CHECK is identical to phase5's hardened rule.
drop policy if exists "anon can insert bookings"              on public.bookings;
drop policy if exists "public and admin can insert bookings"  on public.bookings;
create policy "public and admin can insert bookings" on public.bookings
  for insert to anon, authenticated
  with check (
    status in ('Pending', 'Awaiting Payment')
    and deposit_paid = false
    and payment_type is null
    and amount_paid is null
  );

-- Table-level + sequence privileges the `authenticated` role was missing. anon
-- already has these from schema.sql; this just adds the signed-in role so its
-- inserts aren't blocked before RLS is even evaluated.
grant insert on public.bookings to authenticated;
grant usage, select on sequence public.bookings_ref_seq to authenticated;
