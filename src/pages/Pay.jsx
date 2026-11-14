import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Lock, RefreshCw } from 'lucide-react'
import { gbp } from '../lib/services.js'
import { site } from '../lib/site.js'
import { supabase } from '../lib/supabase.js'
import Wordmark from '../components/Wordmark.jsx'

const EASE = [0.16, 1, 0.3, 1]
const QUICK = [20, 40, 60, 80] // quick-pick amounts

// Public "pay what you owe" page. A client can settle a balance (or pay any
// amount the salon tells them) by card — no card machine or cash needed.
export default function Pay() {
  const [params] = useSearchParams()
  const paid = params.get('paid')
  const cancelled = params.get('cancelled')

  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const amt = Number(amount)
  const valid = name.trim() && Number.isFinite(amt) && amt >= 1

  const pay = async () => {
    if (!valid || submitting) return
    setError('')
    if (!supabase) {
      setError('Online payments aren’t available just now — please call the salon.')
      return
    }
    setSubmitting(true)
    const { data, error: fnError } = await supabase.functions.invoke('create-custom-payment', {
      body: { amount: amt, name: name.trim(), note: note.trim(), email: email.trim() },
    })
    setSubmitting(false)
    if (fnError || !data?.url) {
      setError(data?.error || 'We couldn’t start the payment just now. Please try again or call the salon.')
      return
    }
    window.location.href = data.url
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-2xl items-center justify-between px-5 sm:px-8">
          <Wordmark size="md" />
          <Link to="/" className="text-sm font-medium text-ink/60 transition-colors hover:text-ink">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-14 sm:px-8">
        {paid ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto max-w-lg py-10 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="display-md mt-8 font-display font-semibold text-ink">Payment received</h1>
            <p className="mt-4 text-ink/60">
              Thank you — your payment has gone through. A receipt from Stripe will arrive by email if
              you entered one. See you soon at VAULT 876.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className="btn-gold">Back to site</Link>
              <a href={site.phoneHref} className="btn-ghost">Call {site.phoneDisplay}</a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h1 className="display-md font-display font-semibold text-ink">Pay your balance</h1>
            <p className="mt-3 max-w-md text-ink/55">
              Pop in the amount the salon gave you and pay securely by card — perfect for settling up
              after your appointment, wherever you are.
            </p>

            {cancelled && (
              <div className="mt-6 rounded-xl border border-gold/30 bg-gold/[0.06] px-4 py-3 text-sm text-ink/70">
                No payment was taken. Whenever you're ready, enter the amount below and try again.
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-ink/12 bg-surface p-6 sm:p-8">
              {/* Amount */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink/70">Amount to pay *</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl text-gold">£</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={1}
                    step={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-ink/15 bg-canvas py-4 pl-10 pr-4 font-display text-2xl text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold/70"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(String(q))}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        amt === q ? 'border-gold bg-gold text-obsidian' : 'border-ink/20 text-ink/65 hover:border-gold/60'
                      }`}
                    >
                      {gbp(q)}
                    </button>
                  ))}
                </div>
              </label>

              <div className="mt-6 grid gap-4">
                <Field label="Your name *" value={name} onChange={setName} placeholder="Jane Doe" />
                <Field label="What's it for? (optional)" value={note} onChange={setNote} placeholder="e.g. balance for knotless braids" />
                <Field label="Email for receipt (optional)" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
              </div>

              {error && (
                <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={pay}
                disabled={!valid || submitting}
                className="btn-gold mt-7 w-full !py-4 !text-base"
              >
                {submitting ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Opening secure checkout…</>
                ) : (
                  <>Pay {Number.isFinite(amt) && amt >= 1 ? gbp(amt) : 'now'} securely</>
                )}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink/45">
                <Lock className="h-3.5 w-3.5" /> Secured by Stripe · card details never touch our site
              </p>
            </div>
          </motion.div>
        )}
      </main>
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
        className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3.5 text-ink placeholder:text-ink/50 outline-none transition-colors focus:border-gold/70"
      />
    </label>
  )
}
