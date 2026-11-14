import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, Camera } from 'lucide-react'
import { gbp } from '../lib/services.js'
import { useServices } from '../lib/content.js'
import { site } from '../lib/site.js'
import { supabase } from '../lib/supabase.js'
import Wordmark from '../components/Wordmark.jsx'
import GoodToKnow from '../components/GoodToKnow.jsx'

const EASE = [0.16, 1, 0.3, 1]
const STEPS = [
  { full: 'Service', short: 'Service' },
  { full: 'Date & Time', short: 'Date' },
  { full: 'Details', short: 'Details' },
]
const SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']

// Next 12 open days (skip Sundays — salon closed).
function upcomingDays(n = 12) {
  const out = []
  const d = new Date()
  while (out.length < n) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) out.push(new Date(d))
  }
  return out
}

// Deterministic pseudo-availability so slots feel real + colour-coded.
function slotState(date, slot) {
  const h = (date.getDate() * 7 + SLOTS.indexOf(slot) * 13) % 10
  if (h < 2) return 'full'
  if (h < 4) return 'limited'
  return 'open'
}

export default function Booking() {
  const [params] = useSearchParams()
  const preset = params.get('service')
  const cancelled = params.get('cancelled') // returned from an abandoned Stripe checkout

  const services = useServices()
  const [step, setStep] = useState(1)
  const [picked, setPicked] = useState(() =>
    preset ? [preset] : [],
  )
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [styleBySlug, setStyleBySlug] = useState({})
  const [details, setDetails] = useState({ name: '', phone: '', email: '', photo: '' })
  const [paymentType, setPaymentType] = useState('deposit') // 'deposit' | 'full'
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const days = useMemo(() => upcomingDays(), [])
  const total = useMemo(
    () => picked.reduce((sum, slug) => sum + (services.find((s) => s.slug === slug)?.price || 0), 0),
    [picked, services],
  )

  // Drop any pre-selected service that isn't a real, active menu item (e.g. a
  // stale ?service= link) once the live menu has loaded.
  useEffect(() => {
    setPicked((p) => p.filter((slug) => services.some((s) => s.slug === slug)))
  }, [services])

  const toggle = (slug) =>
    setPicked((p) => {
      if (p.includes(slug)) {
        // Deselecting a service clears any style chosen for it.
        setStyleBySlug((m) => {
          const n = { ...m }
          delete n[slug]
          return n
        })
        return p.filter((s) => s !== slug)
      }
      return [...p, slug]
    })

  // Optional style within a service; clicking the active chip again clears it.
  const pickStyle = (slug, style) =>
    setStyleBySlug((m) => ({ ...m, [slug]: m[slug] === style ? undefined : style }))

  const canContinue =
    (step === 1 && picked.length > 0) ||
    (step === 2 && date && time) ||
    (step === 3 && details.name.trim() && details.phone.trim())

  // Insert one row per chosen service (matching the per-service line items the
  // owner portal + tax export expect), all tied to one booking_group, then hand
  // off to Stripe Checkout for the £20 deposit. The stripe-webhook flips the
  // group to Confirmed once the deposit is captured.
  const submit = async () => {
    if (!canContinue || submitting) return
    setError('')

    // Demo fallback: if the backend isn't configured (e.g. the static mirror),
    // confirm without saving or charging.
    if (!supabase) {
      setDone(true)
      return
    }

    const appointmentDate = date ? date.toLocaleDateString('en-CA') : null // YYYY-MM-DD
    const bookingGroup = crypto.randomUUID() // one deposit covers every row
    const rows = picked.map((slug) => {
      const s = services.find((x) => x.slug === slug)
      return {
        client_name: details.name.trim(),
        client_phone: details.phone.trim(),
        client_email: details.email.trim() || null,
        service: s?.name || slug,
        service_slug: slug,
        style: styleBySlug[slug] || null,
        price: s?.price || 0,
        appointment_date: appointmentDate,
        appointment_time: time,
        status: 'Awaiting Payment',
        booking_group: bookingGroup,
        photo_name: details.photo || null,
      }
    })

    setSubmitting(true)
    const { error: insertError } = await supabase.from('bookings').insert(rows)
    if (insertError) {
      // Surface the real Postgres error (code + message) so a failure is
      // diagnosable from the browser console instead of just the generic copy.
      console.error('[booking] insert failed:', insertError)
      setSubmitting(false)
      setError(
        'We couldn’t save your booking just now. Please try again, or call the salon and we’ll sort it.',
      )
      return
    }

    // Open secure Stripe Checkout for the deposit, then redirect the browser.
    const names = picked.map((slug) => services.find((x) => x.slug === slug)?.name).filter(Boolean)
    const serviceLabel =
      names.length <= 1 ? names[0] || 'Appointment' : `${names[0]} +${names.length - 1} more`

    const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
      body: { booking_group: bookingGroup, service_name: serviceLabel, payment_type: paymentType },
    })
    setSubmitting(false)

    if (fnError || !data?.url) {
      setError(
        'Your booking is saved, but we couldn’t open secure checkout. Please call the salon to pay and confirm.',
      )
      return
    }
    window.location.href = data.url
  }

  const next = () => {
    if (!canContinue) return
    if (step < 3) setStep(step + 1)
    else submit()
  }

  const fmtDay = (d) =>
    d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="flex min-h-[100svh] flex-col bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <Wordmark size="md" />
          <Link to="/" className="text-sm font-medium text-ink/60 transition-colors hover:text-ink">
            ← Back to site
          </Link>
        </div>
      </header>

      {/* Step indicator */}
      {!done && (
        <div className="mx-auto w-full max-w-4xl px-5 pt-10 sm:px-8">
          <ol className="flex items-center gap-3 text-sm">
            {STEPS.map((stepItem, i) => {
              const n = i + 1
              const active = n === step
              const complete = n < step
              return (
                <li key={stepItem.full} className="flex flex-1 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                      active
                        ? 'border-gold bg-gold text-obsidian'
                        : complete
                          ? 'border-gold/60 text-gold'
                          : 'border-ink/30 text-ink/55'
                    }`}
                  >
                    {complete ? <Check className="h-4 w-4" /> : `0${n}`}
                  </span>
                  <span className={`font-display text-base whitespace-nowrap ${active ? 'text-ink' : 'text-ink/55'}`}>
                    <span className="sm:hidden">{stepItem.short}</span>
                    <span className="hidden sm:inline">{stepItem.full}</span>
                  </span>
                  {n < 3 && <span className="hidden h-px flex-1 bg-ink/15 sm:block" />}
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {/* Body */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-40 pt-12 sm:px-8">
        {cancelled && !done && (
          <div className="mb-8 rounded-xl border border-gold/30 bg-gold/[0.06] px-4 py-3 text-sm text-ink/70">
            Payment wasn't completed, so nothing was charged. Pick your details again whenever
            you're ready — or call the salon on{' '}
            <a href={site.phoneHref} className="text-gold underline-offset-2 hover:underline">
              {site.phoneDisplay}
            </a>
            .
          </div>
        )}
        {done ? (
          <Confirmation picked={picked} date={date} time={time} fmtDay={fmtDay} styleBySlug={styleBySlug} services={services} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-ink"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}

              {step === 1 && (
                <>
                  <h1 className="display-md font-display font-semibold text-ink">
                    Choose your services
                  </h1>
                  <p className="mt-3 text-ink/55">Pick one or more — the total updates below.</p>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {services.map((s) => {
                      const on = picked.includes(s.slug)
                      return (
                        <li
                          key={s.slug}
                          className={`rounded-2xl border transition-all duration-300 ease-luxe ${
                            on ? 'border-gold bg-gold/[0.06]' : 'border-ink/12 bg-surface hover:border-gold/50'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggle(s.slug)}
                            aria-pressed={on}
                            className="flex w-full items-start justify-between gap-4 p-5 text-left"
                          >
                            <span>
                              <span className="block font-display text-xl text-ink">{s.name}</span>
                              <span className="mt-1 block text-sm text-ink/50">{s.duration}</span>
                            </span>
                            <span className="flex flex-col items-end gap-2">
                              <span className="font-display text-lg text-gold">{gbp(s.price)}</span>
                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                                  on ? 'border-gold bg-gold text-obsidian' : 'border-ink/30'
                                }`}
                              >
                                {on && <Check className="h-3.5 w-3.5" />}
                              </span>
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {on && s.styles?.length > 0 && (
                              <motion.div
                                key="styles"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-gold/15 px-5 pb-5 pt-4">
                                  <div className="label-caps mb-3 text-ink/40">
                                    Choose a style — optional
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {s.styles.map((st) => {
                                      const active = styleBySlug[s.slug] === st
                                      return (
                                        <button
                                          key={st}
                                          type="button"
                                          onClick={() => pickStyle(s.slug, st)}
                                          aria-pressed={active}
                                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                                            active
                                              ? 'border-gold bg-gold text-obsidian'
                                              : 'border-ink/20 text-ink/65 hover:border-gold/60 hover:text-ink'
                                          }`}
                                        >
                                          {st}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="display-md font-display font-semibold text-ink">Pick a date & time</h1>
                  <p className="mt-3 text-ink/55">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gold" /> Open
                    </span>
                    <span className="ml-4 inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full border border-gold" /> Limited
                    </span>
                    <span className="ml-4 inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-ink/25" /> Full
                    </span>
                  </p>

                  <div className="mt-8 flex gap-2.5 overflow-x-auto pb-3">
                    {days.map((d) => {
                      const on = date && d.toDateString() === date.toDateString()
                      return (
                        <button
                          type="button"
                          key={d.toISOString()}
                          onClick={() => { setDate(d); setTime(null) }}
                          className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 transition-all duration-300 ${
                            on ? 'border-gold bg-gold/[0.06]' : 'border-ink/12 bg-surface hover:border-gold/50'
                          }`}
                        >
                          <span className="text-xs uppercase tracking-wide text-ink/45">
                            {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                          </span>
                          <span className="mt-1 font-display text-2xl text-ink">{d.getDate()}</span>
                          <span className="text-xs text-ink/45">
                            {d.toLocaleDateString('en-GB', { month: 'short' })}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {date && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {SLOTS.map((slot) => {
                            const st = slotState(date, slot)
                            const on = time === slot
                            const disabled = st === 'full'
                            return (
                              <button
                                type="button"
                                key={slot}
                                disabled={disabled}
                                onClick={() => setTime(slot)}
                                className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-all duration-300 ${
                                  disabled
                                    ? 'cursor-not-allowed border-ink/10 text-ink/25'
                                    : on
                                      ? 'border-gold bg-gold/[0.06] text-ink'
                                      : 'border-ink/12 bg-surface text-ink hover:border-gold/50'
                                }`}
                              >
                                <span className="font-medium">{slot}</span>
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    st === 'open' ? 'bg-gold' : st === 'limited' ? 'border border-gold' : 'bg-ink/25'
                                  }`}
                                />
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="display-md font-display font-semibold text-ink">Your details</h1>
                  <p className="mt-3 text-ink/55">
                    Choose how you'd like to pay below — you'll pay securely with Stripe on the
                    next step.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name *" value={details.name} onChange={(v) => setDetails({ ...details, name: v })} placeholder="Jane Doe" />
                    <Field label="Phone *" value={details.phone} onChange={(v) => setDetails({ ...details, phone: v })} placeholder="07…" type="tel" />
                    <div className="sm:col-span-2">
                      <Field label="Email" value={details.email} onChange={(v) => setDetails({ ...details, email: v })} placeholder="you@email.com" type="email" />
                    </div>
                    <label className="sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-ink/70">Inspiration photo (optional)</span>
                      <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink/25 bg-surface px-4 py-4 text-sm text-ink/55 transition-colors hover:border-gold/50">
                        <Camera className="h-5 w-5 text-gold" />
                        <span className="truncate">{details.photo || 'Upload a reference look'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setDetails({ ...details, photo: e.target.files?.[0]?.name || '' })}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Payment choice — £20 deposit or the full booking now */}
                  <div className="mt-10">
                    <div className="label-caps mb-3 text-ink/40">How would you like to pay?</div>
                    <div
                      role="radiogroup"
                      aria-label="Payment option"
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {[
                        {
                          id: 'deposit',
                          title: 'Pay £20 deposit',
                          amount: gbp(20),
                          note: 'Balance paid in the salon',
                        },
                        {
                          id: 'full',
                          title: 'Pay in full',
                          amount: gbp(total),
                          note: 'Nothing further to pay',
                        },
                      ].map((opt) => {
                        const on = paymentType === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setPaymentType(opt.id)}
                            className={`flex items-start justify-between gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ease-luxe ${
                              on
                                ? 'border-gold bg-gold/[0.06]'
                                : 'border-ink/12 bg-surface hover:border-gold/50'
                            }`}
                          >
                            <span>
                              <span className="block font-display text-lg text-ink">{opt.title}</span>
                              <span className="mt-1 block text-sm text-ink/50">{opt.note}</span>
                              <span className="mt-2 block font-display text-xl text-gold">
                                {opt.amount}
                              </span>
                            </span>
                            <span
                              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                on ? 'border-gold bg-gold text-obsidian' : 'border-ink/30'
                              }`}
                            >
                              {on && <Check className="h-3.5 w-3.5" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* The salon's own deposit / cancellation wording, editable
                      from the owner portal. */}
                  <GoodToKnow compact className="mt-12" only={['deposit', 'cancellation']} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Sticky price bar */}
      {!done && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-canvas/85 backdrop-blur-xl">
          {error && (
            <div className="mx-auto max-w-4xl px-5 pt-3 sm:px-8">
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div>
              <div className="text-xs uppercase tracking-wide text-ink/55">
                Total{picked.length ? ` · ${picked.length} service${picked.length > 1 ? 's' : ''}` : ''}
              </div>
              <div className="font-display text-2xl text-ink">{gbp(total)}</div>
            </div>
            <button
              type="button"
              onClick={next}
              disabled={!canContinue || submitting}
              className="btn-gold !px-10 !py-4"
            >
              {step < 3
                ? 'Continue'
                : submitting
                  ? 'Opening secure checkout…'
                  : paymentType === 'full'
                    ? `Pay in full · ${gbp(total)}`
                    : 'Pay £20 deposit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/70">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 bg-surface px-4 py-3.5 text-ink placeholder:text-ink/50 transition-colors focus:border-gold/70 focus:outline-none"
      />
    </label>
  )
}

function Confirmation({ picked, date, time, fmtDay, styleBySlug = {}, services = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mx-auto max-w-lg py-10 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
        <Check className="h-8 w-8" />
      </div>
      <h1 className="display-md mt-8 font-display font-semibold text-ink">Request received</h1>
      <p className="mt-4 text-ink/60">
        Thank you — your request is in, and we'll call to confirm your{' '}
        {date && time ? `appointment for ${fmtDay(date)} at ${time}` : 'appointment'}.
        Nothing has been charged — payment is taken in the salon.
      </p>
      <div className="mt-8 rounded-2xl border border-ink/12 bg-surface p-6 text-left">
        <div className="label-caps text-ink/40">Your selection</div>
        <ul className="mt-3 space-y-1.5">
          {picked.map((slug) => {
            const s = services.find((x) => x.slug === slug)
            const style = styleBySlug[slug]
            return (
              <li key={slug} className="flex justify-between gap-4 text-ink/80">
                <span>
                  {s?.name}
                  {style && <span className="text-ink/50"> — {style}</span>}
                </span>
                <span className="shrink-0 text-gold">{gbp(s?.price || 0)}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={site.phoneHref} className="btn-gold">Call {site.phoneDisplay}</a>
        <Link to="/" className="btn-ghost">Back to site</Link>
      </div>
    </motion.div>
  )
}
