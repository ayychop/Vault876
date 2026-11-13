import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { services, gbp } from '../lib/services.js'
import { fadeUp, stagger, inView } from '../lib/motion.js'
import { IconArrowUpRight } from './icons.jsx'

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-canvas pb-16 pt-2 sm:pb-36 sm:pt-4">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <motion.h2
            variants={fadeUp}
            className="display-lg font-display font-black text-ink"
          >
            The <span className="italic font-medium">Menu</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-xs text-sm leading-relaxed text-ink/50 md:text-right"
          >
            Guide prices — your exact quote is confirmed at consultation. Tap any
            service to begin booking.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="border-t border-ink/12"
        >
          {services.map((s, i) => (
            <motion.li key={s.slug} variants={fadeUp} className="border-b border-ink/12">
              <Link
                to={`/booking?service=${s.slug}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-8 transition-all duration-500 ease-luxe hover:scale-[1.012] hover:bg-gold/[0.04] hover:shadow-[0_26px_70px_-30px_rgba(212,175,55,0.6)] sm:gap-6"
              >
                {/* Editorial menu index — faint, slides + warms to gold on hover */}
                <span
                  aria-hidden
                  className="shrink-0 self-start pt-1.5 font-display text-sm tabular-nums text-ink/25 transition-all duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:text-gold sm:text-base"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-x-4 sm:gap-x-6">
                    <h3
                      className="min-w-0 font-accent font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-gold"
                      style={{ fontSize: 'clamp(1.4rem, 3.8vw, 2.4rem)' }}
                    >
                      {s.name}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap font-display text-lg text-gold sm:text-2xl">
                      from {gbp(s.price)}
                    </span>
                  </div>
                  <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed text-ink/55">
                    {s.copy}
                    <span className="text-ink/50"> · {s.duration}</span>
                  </p>
                </div>
                <IconArrowUpRight className="hidden h-6 w-6 shrink-0 text-ink/25 transition-all duration-500 ease-luxe group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold sm:block" />
                {/* Gold gleam sweeping across the row on hover */}
                <span aria-hidden className="service-gleam" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
