import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger } from '../lib/motion.js'
import { site } from '../lib/site.js'
import Wordmark from '../components/Wordmark.jsx'
import { IconPhone, IconArrowUpRight } from '../components/icons.jsx'

// Phase 1 stub — the route and shell for the Phase 2 three-step booking flow
// (Services → Date & Time → Details, with a sticky price bar).
const steps = [
  { n: '01', title: 'Select service', copy: 'Browse the menu with duration and price.' },
  { n: '02', title: 'Date & time', copy: 'Pick a slot from live, colour-coded availability.' },
  { n: '03', title: 'Your details', copy: 'Name, phone, email and a reference photo.' },
]

export default function Booking() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-canvas">
      <header className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Wordmark size="md" />
        <Link
          to="/"
          className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <motion.div variants={stagger(0.12, 0.1)} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="label-caps text-gold">
            Coming in Phase 2
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="display-lg mt-6 font-display font-semibold text-ink"
          >
            Book your chair.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-md text-lg font-light leading-relaxed text-ink/60"
          >
            Online booking is on its way — a clean, three-step flow styled in the
            VAULT aesthetic. For now, call the salon and we will sort you out.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col justify-center gap-3.5 sm:flex-row"
          >
            <a href={site.phoneHref} className="btn-gold">
              <IconPhone className="h-[1.1rem] w-[1.1rem]" />
              Call {site.phoneDisplay}
            </a>
            <a
              href={site.directionsHref}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Get Directions
              <IconArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Preview of the flow to come */}
          <motion.ul
            variants={stagger(0.1, 0.3)}
            className="mt-20 grid gap-4 text-left sm:grid-cols-3"
          >
            {steps.map((s) => (
              <motion.li
                key={s.n}
                variants={fadeUp}
                className="rounded-2xl border border-ink/10 bg-surface p-6"
              >
                <span className="font-display text-2xl text-gold">{s.n}</span>
                <h2 className="mt-3 font-display text-lg text-ink">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/50">
                  {s.copy}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </main>

      {/* Hint of the mandatory sticky price bar to come */}
      <div className="sticky bottom-0 border-t border-ink/10 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <span className="text-sm text-ink/40">Total</span>
          <span className="font-display text-lg text-ink/40">£—</span>
        </div>
      </div>
    </div>
  )
}
