import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/motion.js'
import { useSiteContent } from '../lib/content.js'

// The salon's own rules & policies, editable from the /admin "Edit Website"
// → Policies tab. Two looks:
//   • full    — a standalone editorial section for the homepage
//   • compact — a slim list for inside the booking flow
// `only` optionally limits which blocks show (by key), e.g. ['deposit'].
export default function GoodToKnow({ compact = false, className = '', only = null }) {
  const all = useSiteContent()
  const blocks = (only ? all.filter((b) => only.includes(b.key)) : all).filter(
    (b) => b.title && b.body,
  )
  if (blocks.length === 0) return null

  if (compact) {
    return (
      <div className={`rounded-2xl border border-ink/12 bg-surface p-6 ${className}`}>
        <div className="label-caps mb-4 text-ink/40">Good to know</div>
        <dl className="space-y-4">
          {blocks.map((b) => (
            <div key={b.key}>
              <dt className="font-display text-base text-ink">{b.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink/55">{b.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  return (
    <section id="good-to-know" className="scroll-mt-20 bg-canvas py-16 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-10 flex flex-col gap-5 sm:mb-14 md:flex-row md:items-end md:justify-between"
        >
          <motion.h2 variants={fadeUp} className="display-lg font-display font-black text-ink">
            Good to <span className="italic font-medium">know</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-sm text-base leading-relaxed text-ink/55 md:text-right"
          >
            A few things that keep every appointment running beautifully.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid gap-4 sm:grid-cols-2"
        >
          {blocks.map((b) => (
            <motion.div
              key={b.key}
              variants={fadeUp}
              className="rounded-2xl border border-ink/12 bg-surface p-6 sm:p-7"
            >
              <h3 className="font-display text-xl text-ink">{b.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/60">{b.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
