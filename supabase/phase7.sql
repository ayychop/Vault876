-- ============================================================================
-- VAULT 876 — Phase 7: "Pay what you owe" (custom-amount payments)
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER the earlier phases. Safe to re-run.
--
-- Why: so a client can go back to the website and pay a balance (or any amount
-- the owner tells them) by card — handy when there's no card machine in the
-- shop, or the client has no cash. The owner sees these in her portal.
--
-- 🔐 ACCESS MODEL:
--     • The `create-custom-payment` Edge Function (service role) CREATES each
--       payment row and the Stripe Checkout. The `stripe-webhook` (service role)
--       marks it Paid. Both bypass RLS, so there is NO anon access at all —
--       the public anon key can neither read nor write this table.
--     • Only a signed-in admin (the owner portal) can READ payments.
-- ============================================================================

create sequence if not exists public.payments_ref_seq start 5001;

create table if not exists public.payments (
  id                        uuid primary key default gen_random_uuid(),
  ref                       text not null default ('PAY-' || nextval('public.payments_ref_seq')),
  created_at                timestamptz not null default now(),
  name                      text,
  note                      text,              -- what it's for, e.g. "balance for braids"
  email                     text,
  amount                    numeric not null default 0,   -- requested amount (GBP)
  amount_paid               numeric,                       -- what Stripe captured (GBP)
  status                    text not null default 'Pending', -- 'Pending' | 'Paid'
  stripe_session_id         text,
  stripe_payment_intent_id  text,
  paid_at                   timestamptz
);

create index if not exists payments_stripe_session_id_idx on public.payments (stripe_session_id);

alter table public.payments enable row level security;

-- Owner-only reads. The functions write with the service role (bypasses RLS),
-- so there is deliberately no anon or write policy here.
drop policy if exists "authenticated can read payments" on public.payments;
create policy "authenticated can read payments" on public.payments
  for select to authenticated using (true);

grant select on public.payments to authenticated;
