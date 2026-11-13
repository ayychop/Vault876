import { motion } from 'framer-motion'
import { fadeUp, imageReveal, stagger, inView } from '../lib/motion.js'
import {
  IconQuality,
  IconHealthyHair,
  IconConfidence,
  IconPremium,
} from './icons.jsx'

const promises = [
  {
    Icon: IconQuality,
    title: 'Quality',
    copy: 'Every style finished to a standard we would wear ourselves — no rushed work, ever.',
  },
  {
    Icon: IconHealthyHair,
    title: 'Healthy Hair',
    copy: 'Techniques and tension that protect your hair, so it thrives long after you leave the chair.',
  },
  {
    Icon: IconConfidence,
    title: 'Confidence',
    copy: 'You walk out feeling seen — the kind of look that changes how you carry the whole day.',
  },
  {
    Icon: IconPremium,
    title: 'Premium Products',
    copy: 'Only trusted, professional-grade products touch your hair and skin. Nothing less.',
  },
]

export default function Promise() {
  return (
    <section id="promise" className="scroll-mt-20 bg-canvas py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Editorial image */}
          <motion.div
            variants={imageReveal}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative order-last lg:order-first"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[3/4]">
              <img
                src="/images/work-salon.jpg"
                alt="Inside the VAULT 876 salon — the chair where the work happens"
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 rounded-2xl" />
            </div>
            {/* Gold corner accent */}
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-br-2xl border-b border-r border-gold/50" />
          </motion.div>

          {/* Promises */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.h2
              variants={fadeUp}
              className="display-lg font-display font-semibold text-ink"
            >
              Our promise
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-md text-base leading-relaxed text-ink/55"
            >
              VAULT 876 is built on four things we never compromise on — whatever
              style you walk in for.
            </motion.p>

            <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/5 sm:grid-cols-2">
              {promises.map(({ Icon, title, copy }) => (
                <motion.li
                  key={title}
                  variants={fadeUp}
                  className="group bg-canvas p-7 transition-colors duration-500 hover:bg-surface"
                >
                  <Icon className="h-7 w-7 text-gold transition-transform duration-500 ease-luxe group-hover:scale-110" />
                  <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/50">
                    {copy}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
