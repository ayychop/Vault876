import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { site } from '../lib/site.js'
import Wordmark from '../components/Wordmark.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Shown when Stripe redirects back after a captured deposit. The booking is
// confirmed server-side by the stripe-webhook; this page is the client's
// thank-you. (We intentionally don't re-confirm from the browser — the webhook
// is the source of truth so a closed tab can't leave a booking unconfirmed.)
export default function BookingSuccess() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <Wordmark size="md" />
          <Link to="/" className="text-sm font-medium text-ink/60 transition-colors hover:text-ink">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-5 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-lg py-10 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="display-md mt-8 font-display font-semibold text-ink">
            Deposit received — you're booked in
          </h1>
          <p className="mt-4 text-ink/60">
            Thank you. Your <span className="text-gold">£20 deposit</span> is paid and your
            appointment at VAULT 876 is confirmed. The balance is settled in the salon on the day —
            we can't wait to see you.
          </p>
          <p className="mt-3 text-sm text-ink/45">
            If you gave us your email, a confirmation is on its way. Need to change anything? Just
            give the salon a call.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={site.phoneHref} className="btn-gold">
              Call {site.phoneDisplay}
            </a>
            <Link to="/" className="btn-ghost">
              Back to site
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
