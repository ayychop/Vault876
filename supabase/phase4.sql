-- ============================================================================
-- VAULT 876 — Phase 4: Stripe booking deposits
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER schema.sql. Safe to re-run
-- (idempotent).
--
-- Flow:
--   • The public booking form inserts one row PER chosen service, all sharing a
--     single `booking_group` UUID, as status 'Awaiting Payment' with
--     deposit_paid = false. One £20 Stripe payment covers the whole group.
--   • The anon key can only ever create UNPAID, unconfirmed rows (see the RLS
--     policy below) — it cannot self-confirm a booking without paying.
--   • Only the `stripe-webhook` Edge Function (service role, which bypasses RLS)
--     flips deposit_paid = true and status = 'Confirmed' once Stripe reports the
--     deposit was captured.
-- ============================================================================

-- Columns the deposit flow needs. deposit_paid + stripe_payment_intent_id are
-- the two the client asked for; booking_group ties the per-service rows to one
-- payment, stripe_session_id lets the webhook reconcile, paid_at timestamps it.
alter table public.bookings add column if not exists booking_group            uuid;
alter table public.bookings add column if not exists deposit_paid             boolean not null default false;
alter table public.bookings add column if not exists stripe_session_id        text;
alter table public.bookings add column if not exists stripe_payment_intent_id text;
alter table public.bookings add column if not exists paid_at                  timestamptz;

create index if not exists bookings_booking_group_idx     on public.bookings (booking_group);
create index if not exists bookings_stripe_session_id_idx on public.bookings (stripe_session_id);

-- Public inserts may only create UNPAID, not-yet-confirmed bookings. This stops
-- anyone holding the anon key from marking a booking Confirmed without paying.
-- 'Pending' stays allowed so the pre-deposit fallback keeps working.
drop policy if exists "anon can insert bookings" on public.bookings;
create policy "anon can insert bookings" on public.bookings
  for insert to anon
  with check (
    status in ('Pending', 'Awaiting Payment')
    and deposit_paid = false
  );

-- Reads still require a signed-in admin (unchanged from schema.sql). The webhook
-- uses the service role, so it needs no anon/authenticated write policy.
