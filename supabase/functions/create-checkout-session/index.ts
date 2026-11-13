// ============================================================================
// create-checkout-session — starts a Stripe Checkout for the £20 booking deposit
// ----------------------------------------------------------------------------
// Called from the browser (anon JWT) by the booking form after it has inserted
// the per-service rows under one `booking_group`. It verifies the group is real
// and still unpaid, opens a fixed £20 Checkout Session tagged with that group,
// records the session id back on the rows, and returns the hosted Checkout URL.
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
    const { booking_group, service_name } = await req.json().catch(() => ({}))
    if (!booking_group) return json({ error: 'Missing booking_group' }, 400)

    // Service role so we can read the just-inserted rows regardless of RLS.
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: rows, error } = await admin
      .from('bookings')
      .select('id, client_email, deposit_paid')
      .eq('booking_group', booking_group)
    if (error) throw error
    if (!rows || rows.length === 0) return json({ error: 'Booking not found' }, 404)
    if (rows.some((r) => r.deposit_paid)) return json({ error: 'Deposit already paid' }, 409)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: rows[0].client_email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: DEPOSIT_PENCE,
            product_data: {
              name: 'VAULT 876 booking deposit',
              description: service_name
                ? `Deposit for: ${service_name} — balance paid in the salon`
                : 'Secures your appointment — balance paid in the salon',
            },
          },
        },
      ],
      // The webhook reads this to know which booking to confirm.
      metadata: { booking_group },
      payment_intent_data: { metadata: { booking_group } },
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
