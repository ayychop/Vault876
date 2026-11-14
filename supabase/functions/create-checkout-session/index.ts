// ============================================================================
// create-checkout-session — starts a Stripe Checkout for a booking payment
// ----------------------------------------------------------------------------
// Called from the browser (anon JWT) by the booking form after it has inserted
// the per-service rows under one `booking_group`. It verifies the group is real
// and still unpaid, then opens a Checkout Session tagged with that group:
//   • payment_type 'deposit' → the fixed £20 deposit (balance paid in the salon)
//   • payment_type 'full'    → the WHOLE booking, priced server-side from the
//                              sum of the group's own rows (the client-sent
//                              amount is never trusted).
// It records the session id back on the rows and returns the hosted Checkout URL.
//
// Secrets required (supabase secrets set …): STRIPE_SECRET_KEY.
// Auto-provided by the platform: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Optional: SITE_URL (defaults to the production domain) for the return links.
// ============================================================================
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
})
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://vault876.boanetworks.com').replace(/\/$/, '')
const DEPOSIT_PENCE = 2000 // £20.00 fixed deposit

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const { booking_group, service_name } = body
    // 'full' pays the whole booking now; anything else is the £20 deposit.
    const paymentType = body.payment_type === 'full' ? 'full' : 'deposit'
    if (!booking_group) return json({ error: 'Missing booking_group' }, 400)

    // Service role so we can read the just-inserted rows regardless of RLS.
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: rows, error } = await admin
      .from('bookings')
      .select('id, client_email, deposit_paid, price, service_slug')
      .eq('booking_group', booking_group)
    if (error) throw error
    if (!rows || rows.length === 0) return json({ error: 'Booking not found' }, 404)
    if (rows.some((r) => r.deposit_paid)) return json({ error: 'Already paid' }, 409)

    // The amount is decided on the server, never from the client. For a full
    // payment we price from the AUTHORITATIVE `services` table (keyed by each
    // row's service_slug) — the same table the website menu reads — so Stripe
    // always charges the owner's current price and a tampered client-side price
    // can't take effect. If a slug is missing from the menu we fall back to the
    // price snapshot stored on the row.
    const slugs = [...new Set(rows.map((r) => r.service_slug).filter(Boolean))]
    const priceBySlug: Record<string, number> = {}
    if (slugs.length) {
      const { data: svc, error: svcErr } = await admin
        .from('services')
        .select('slug, price')
        .in('slug', slugs)
      if (svcErr) throw svcErr
      for (const s of svc ?? []) priceBySlug[s.slug] = Number(s.price) || 0
    }
    const fullGbp = rows.reduce((sum, r) => {
      const authoritative =
        r.service_slug && priceBySlug[r.service_slug] != null
          ? priceBySlug[r.service_slug]
          : Number(r.price) || 0
      return sum + authoritative
    }, 0)
    const fullPence = Math.round(fullGbp * 100)
    const isFull = paymentType === 'full'
    if (isFull && fullPence < DEPOSIT_PENCE) {
      // A full total below the deposit would be nonsensical — never happens with
      // the real menu, but guard rather than charge a strange amount.
      return json({ error: 'Invalid booking total' }, 400)
    }
    const unitAmount = isFull ? fullPence : DEPOSIT_PENCE

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: rows[0].client_email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: unitAmount,
            product_data: {
              name: isFull ? 'VAULT 876 booking — paid in full' : 'VAULT 876 booking deposit',
              description: isFull
                ? service_name
                  ? `Full payment for: ${service_name} — nothing further to pay`
                  : 'Your appointment, paid in full — nothing further to pay'
                : service_name
                  ? `Deposit for: ${service_name} — balance paid in the salon`
                  : 'Secures your appointment — balance paid in the salon',
            },
          },
        },
      ],
      // The webhook reads these to know which booking to confirm and how it paid.
      metadata: { booking_group, payment_type: paymentType },
      payment_intent_data: { metadata: { booking_group, payment_type: paymentType } },
      success_url: `${SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/booking?cancelled=1`,
    })

    // Record the session id against every row in the group for reconciliation.
    await admin
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('booking_group', booking_group)

    return json({ url: session.url })
  } catch (e) {
    console.error('[create-checkout-session]', e)
    return json({ error: 'Could not start checkout' }, 500)
  }
})
