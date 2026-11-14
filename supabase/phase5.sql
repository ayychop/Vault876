-- ============================================================================
-- VAULT 876 — Phase 5: "Pay in full" option
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER phase4.sql. Safe to re-run
-- (idempotent).
--
-- What this adds:
--   • payment_type — 'deposit' (the fixed £20) or 'full' (the whole booking),
--     NULL until a payment is captured.
--   • amount_paid  — the exact amount Stripe captured, in GBP (e.g. 20.00 or
--     155.00), so the owner portal + tax export show real money taken.
--
-- Who writes them: ONLY the `stripe-webhook` Edge Function (service role),
-- derived from Stripe's own `amount_total`. The public anon key can never set
-- them (see the hardened insert policy below), so no one can forge a
-- "paid in full" booking without actually paying.
-- ============================================================================

alter table public.bookings add column if not exists payment_type text;
alter table public.bookings add column if not exists amount_paid  numeric(10, 2);

-- payment_type may only ever be 'deposit' or 'full' (NULL while unpaid).
alter table public.bookings drop constraint if exists bookings_payment_type_check;
alter table public.bookings add constraint bookings_payment_type_check
  check (payment_type is null or payment_type in ('deposit', 'full'));

-- Harden the public insert policy: the anon key may still only create UNPAID,
-- unconfirmed rows, and now it also cannot pre-set payment_type or amount_paid.
-- Those are stamped server-side by the webhook from the real Stripe total.
drop policy if exists "anon can insert bookings" on public.bookings;
create policy "anon can insert bookings" on public.bookings
  for insert to anon
  with check (
    status in ('Pending', 'Awaiting Payment')
    and deposit_paid = false
    and payment_type is null
    and amount_paid is null
  );
