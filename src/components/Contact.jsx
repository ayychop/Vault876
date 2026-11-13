import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/motion.js'
import { site } from '../lib/site.js'
import { IconPhone, IconPin, IconArrowUpRight } from './icons.jsx'
import ImagePlaceholder from './ImagePlaceholder.jsx'

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-canvas py-16 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-10 flex flex-col gap-5 sm:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <motion.h2
            variants={fadeUp}
            className="display-lg font-display font-black text-ink"
          >
            Visit the <span className="italic font-medium">Salon</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-sm text-base leading-relaxed text-ink/55 md:text-right"
          >
            Step inside our chair in the heart of Aylesbury. Book ahead, or call
            and we will find you a slot.
          </motion.p>
        </motion.div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Branded placeholder until the studio shoot lands */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[22rem] lg:min-h-[32rem]"
          >
            <ImagePlaceholder
              className="h-full w-full rounded-2xl"
              label="The Studio"
              tag="Coming soon"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex flex-col justify-between rounded-2xl border border-ink/12 bg-surface p-8 sm:p-10"
          >
            <div>
              <motion.div variants={fadeUp}>
                <h3 className="label-caps text-ink/40">Address</h3>
                <address className="mt-4 font-display text-xl not-italic leading-relaxed text-ink/90">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city} {site.address.postcode}
                </address>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-9">
                <h3 className="label-caps text-ink/40">Opening Hours</h3>
                <dl className="mt-4 space-y-3">
                  {site.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex items-baseline justify-between gap-4 border-b border-ink/8 pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-ink/70">{h.day}</dt>
                      <dd
                        className={
                          h.closed
                            ? 'text-sm uppercase tracking-wide text-ink/35'
                            : 'tabular-nums text-ink/90'
                        }
                      >
                        {h.open}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-9">
                <h3 className="label-caps text-ink/40">Call</h3>
                <a
                  href={site.phoneHref}
                  className="mt-4 inline-flex items-center gap-2.5 font-display text-xl text-ink/90 transition-colors hover:text-gold"
                >
                  <IconPhone className="h-5 w-5 text-gold/80" />
                  {site.phoneDisplay}
                </a>
              </motion.div>
            </div>

            <motion.a
              variants={fadeUp}
              href={site.directionsHref}
              target="_blank"
              rel="noreferrer"
              className="btn-gold mt-11"
            >
              <IconPin className="h-[1.05rem] w-[1.05rem]" />
              Get Directions
              <IconArrowUpRight className="h-3.5 w-3.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
