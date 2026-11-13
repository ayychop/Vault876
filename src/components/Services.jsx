import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/motion.js'
import { IconArrowUpRight } from './icons.jsx'

const services = [
  {
    name: 'Wig Installations',
    copy: 'Seamless, natural-looking installs — lace melted, baby hairs laid, finished to sit flawlessly.',
  },
  {
    name: 'Relaxers',
    copy: 'Gentle, healthy-hair relaxing for a sleek, manageable finish that protects the strand.',
  },
  {
    name: 'Braid Extensions',
    copy: 'Knotless, box and feed-in braids, plaited with care and a tension built to last for weeks.',
  },
  {
    name: 'Kids Hair Braiding',
    copy: 'Patient, gentle styling for little ones — cornrows, beads and protective styles they will love.',
  },
  {
    name: 'Eyelash Extensions',
    copy: 'Classic through to volume sets that frame the eyes and lift the whole face.',
  },
  {
    name: 'Locs',
    copy: 'Starting, retwisting and styling — locs maintained with precision and real patience.',
  },
]

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-canvas py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <motion.h2
            variants={fadeUp}
            className="display-lg font-display font-semibold text-ink"
          >
            The services
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-sm text-base leading-relaxed text-ink/55 md:text-right"
          >
            A focused menu, every style done properly. Prices are confirmed at
            consultation — call us and we will talk it through.
          </motion.p>
        </motion.div>

        <div className="mt-6 rule" />

        {/* Grid */}
        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <motion.li key={s.name} variants={fadeUp}>
              <a
                href="/booking"
                className="group relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-surface p-7 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-gold/70"
              >
                {/* Gold wash that warms in on hover */}
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
                </span>

                <div className="relative flex items-start justify-between gap-4">
                  <h3 className="font-display text-[1.6rem] leading-tight text-ink">
                    {s.name}
                  </h3>
                  <IconArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink/30 transition-all duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
                </div>

                <p className="relative mt-6 text-[0.95rem] leading-relaxed text-ink/55">
                  {s.copy}
                </p>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
