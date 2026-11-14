// ============================================================================
// stripe-webhook — confirms a booking once Stripe captures the deposit
// ----------------------------------------------------------------------------
// Stripe calls this endpoint directly (no Supabase JWT — see config.toml, which
// sets verify_jwt = false). It verifies the Stripe signature, then on a
// `checkout.session.completed` event marks every row in the booking_group
// deposit_paid = true / status = 'Confirmed' and stores the payment-intent id.
//
// The update is idempotent: it only touches rows still deposit_paid = false, so
// Stripe retries can't double-process.
//
// Secrets required (supabase secrets set …): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
// Auto-provided by the platform: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// ============================================================================
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendClientConfirmation, sendOwnerNotification } from '../_shared/email.ts'

const DEPOSIT_GBP = 20 // the fixed £20 deposit, for the confirmation emails

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
})
// Async (WebCrypto) signature verification — required in the Deno runtime.
const cryptoProvider = Stripe.createSubtleCryptoProvider()
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature ?? '',
      WEBHOOK_SECRET,
      undefined,
      cryptoProvider,
    )
  } catch (e) {
    console.error('[stripe-webhook] signature verification failed:', (e as Error).message)
    return new Response(`Webhook Error: ${(e as Error).message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingGroup = session.metadata?.booking_group
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? null)

    // What Stripe actually captured. amount_total is in pence → store GBP.
    const amountPaid =
      typeof session.amount_total === 'number' ? session.amount_total / 100 : null

    // --- "Pay what you owe" custom payments (Phase 7) -----------------------
    // These carry our own kind + payment_id metadata and live in the `payments`
    // table — there's no booking to confirm. Mark it Paid and return. Idempotent
    // via the status guard, so Stripe retries are harmless.
    const paymentId = session.metadata?.payment_id
    if (session.metadata?.kind === 'custom_payment' && paymentId) {
      const admin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )
      const { error } = await admin
        .from('payments')
        .update({
          status: 'Paid',
          amount_paid: amountPaid,
          stripe_payment_intent_id: paymentIntentId,
          stripe_session_id: session.id,
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .neq('status', 'Paid')
      if (error) console.error('[stripe-webhook] payment update failed:', error)
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Trust our own metadata first; fall back to the captured total (anything
    // above the £20 deposit is a full payment).
    const paymentType =
      session.metadata?.payment_type === 'full'
        ? 'full'
        : session.metadata?.payment_type === 'deposit'
          ? 'deposit'
          : session.amount_total != null && session.amount_total > DEPOSIT_GBP * 100
            ? 'full'
            : 'deposit'
    const paidInFull = paymentType === 'full'

    if (bookingGroup) {
      const admin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      const { data: confirmed, error } = await admin
        .from('bookings')
        .update({
          deposit_paid: true, // the "payment captured" flag (deposit OR full)
          status: 'Confirmed',
          payment_type: paymentType,
          amount_paid: amountPaid,
          stripe_payment_intent_id: paymentIntentId,
          stripe_session_id: session.id,
          paid_at: new Date().toISOString(),
        })
        .eq('booking_group', bookingGroup)
        .eq('deposit_paid', false) // idempotent: ignore already-confirmed rows
        .select('*')

      if (error) {
        console.error('[stripe-webhook] booking update failed:', error)
      } else if (confirmed && confirmed.length > 0) {
        // Rows actually flipped on THIS event (a Stripe retry finds 0 and skips),
        // so the confirmation emails go out exactly once per booking. Email
        // failures are logged but never fail the webhook — Stripe must still get
        // its 200, and the booking is already confirmed in the database.
        const first = confirmed[0]
        const summary = {
          clientName: first.client_name ?? 'there',
          clientEmail: first.client_email ?? null,
          clientPhone: first.client_phone ?? '',
          date: first.appointment_date ?? null,
          time: first.appointment_time ?? null,
          lines: confirmed.map((r) => ({
            service: r.service,
            style: r.style ?? null,
            price: Number(r.price) || 0,
          })),
          total: confirmed.reduce((sum, r) => sum + (Number(r.price) || 0), 0),
          amountPaid: amountPaid ?? (paidInFull ? 0 : DEPOSIT_GBP),
          paidInFull,
        }
        try {
          await Promise.all([sendClientConfirmation(summary), sendOwnerNotification(summary)])
        } catch (e) {
          console.error('[stripe-webhook] confirmation email failed:', (e as Error).message)
        }
      }
    } else {
      console.warn('[stripe-webhook] checkout.session.completed with no booking_group')
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
