import { motion } from 'framer-motion'
import { inView } from '../lib/motion.js'
import ImagePlaceholder from './ImagePlaceholder.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Branded placeholders until the salon's own editorial shoot lands.
const work = [
  { label: 'Braid extensions', span: 'aspect-[3/4]', logo: 112 },
  { label: 'Extensions', span: 'aspect-[3/4]', logo: 112 },
  { label: 'The Space', span: 'aspect-[3/4]', logo: 112 },
  { label: 'Length & Finish', span: 'aspect-[16/10] lg:col-span-2', logo: 132 },
  { label: 'Locs & Styling', span: 'aspect-[16/10] lg:aspect-[3/4]', logo: 112 },
]

export default function Gallery() {
  return (
    <section id="work" className="scroll-mt-20 bg-canvas py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="display-lg font-display font-black text-ink">
            The <span className="italic font-medium">Work</span>
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-ink/55 md:text-right">
            Our editorial portfolio is being shot now — braids, locs, length and
            finish, the craft seen close.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w, i) => (
            <motion.figure
              key={w.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: EASE }}
              className={`group relative ${w.span}`}
            >
              <ImagePlaceholder
                label={w.label}
                logoSize={w.logo}
                className="h-full w-full rounded-2xl transition-transform duration-700 ease-luxe group-hover:scale-[1.015]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-gold/40" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
