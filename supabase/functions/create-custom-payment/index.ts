// ============================================================================
// create-custom-payment — Stripe Checkout for an open "pay what you owe" amount
// ----------------------------------------------------------------------------
// Called from the browser (anon JWT) by the public /pay page. The client sends
// the amount the salon told them to pay plus their name (and an optional note /
// email). We create the payment record ourselves with the service role, open a
// Stripe Checkout for that amount, and the stripe-webhook marks it Paid.
//
// The amount is inherently client-specified here (it's "pay what you owe"), so
// we don't trust it blindly: it's bounded (£1–£2000) and the row we store is
// the one Checkout charges, with the webhook recording what Stripe captured.
//
// Secrets required: STRIPE_SECRET_KEY.
// Auto-provided: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. Optional: SITE_URL.
// ============================================================================
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
})
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://vault876.boanetworks.com').replace(/\/$/, '')
const MIN_PENCE = 100 // £1
const MAX_PENCE = 200000 // £2,000 — a sane ceiling for an online card payment

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const name = String(body.name ?? '').trim()
    const note = String(body.note ?? '').trim()
    const email = String(body.email ?? '').trim()
    const pence = Math.round(Number(body.amount) * 100)

    if (!name) return json({ error: 'Please enter your name.' }, 400)
    if (!Number.isFinite(pence) || pence < MIN_PENCE)
      return json({ error: 'Please enter an amount of at least £1.' }, 400)
    if (pence > MAX_PENCE)
      return json({ error: 'That amount is too large to pay online — please contact the salon.' }, 400)

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: row, error } = await admin
      .from('payments')
      .insert({
        name,
        note: note || null,
        email: email || null,
        amount: pence / 100,
        status: 'Pending',
      })
      .select('id')
      .single()
    if (error) throw error

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: pence,
            product_data: {
              name: 'VAULT 876 payment',
              description: note ? `Payment — ${note}` : 'Payment to VAULT 876',
            },
          },
        },
      ],
      metadata: { kind: 'custom_payment', payment_id: row.id },
      payment_intent_data: { metadata: { kind: 'custom_payment', payment_id: row.id } },
      success_url: `${SITE_URL}/pay?paid=1`,
      cancel_url: `${SITE_URL}/pay?cancelled=1`,
    })

    await admin.from('payments').update({ stripe_session_id: session.id }).eq('id', row.id)

    return json({ url: session.url })
  } catch (e) {
    console.error('[create-custom-payment]', e)
    return json({ error: 'Could not start the payment. Please try again.' }, 500)
  }
})
