import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fadeUp, stagger, inView } from '../lib/motion.js'

const EASE = [0.16, 1, 0.3, 1]

// PLACEHOLDER social proof — representative sample reviews standing in until the
// salon supplies real, attributable client testimonials. Replace before launch.
const reviews = [
  {
    quote:
      'I walked out not recognising myself — in the best way. The install sat flawless for six weeks and the finish was pure luxury. Nowhere else comes close.',
    name: 'Amara O.',
    service: 'Wig installations',
  },
  {
    quote:
      'They took real care of my daughter — gentle, patient, and her braids were immaculate. She has never sat so happily in a chair. We will not go anywhere else.',
    name: 'Danielle R.',
    service: 'Kids hair braid',
  },
  {
    quote:
      'My braids were done with a tension that lasted and never pulled. The space feels expensive, the work feels personal. This is how a salon should feel.',
    name: 'Simone K.',
    service: 'Braid extensions',
  },
  {
    quote:
      'My locs have never looked healthier. You can tell they actually care about the hair, not just the look. Booking was effortless too — I was in and out with zero fuss.',
    name: 'Marcus B.',
    service: 'Locs',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const count = reviews.length

  const go = useCallback(
    (next) => {
      setDir(next > index || (index === count - 1 && next === 0) ? 1 : -1)
      setIndex(((next % count) + count) % count)
    },
    [index, count],
  )
  const prev = () => go(index - 1)
  const next = () => go(index + 1)

  // Gentle auto-advance; pauses on hover/focus and when motion is reduced.
  const timer = useRef(null)
  useEffect(() => {
    if (reduce || paused) return
    timer.current = setTimeout(() => {
      setDir(1)
      setIndex((i) => (i + 1) % count)
    }, 6500)
    return () => clearTimeout(timer.current)
  }, [index, paused, reduce, count])

  const active = reviews[index]

  return (
    <section id="reviews" className="scroll-mt-20 bg-canvas py-16 sm:py-36">
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
            Kind <span className="italic font-medium">Words</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-sm text-base leading-relaxed text-ink/55 md:text-right"
          >
            The chair tells the truth. A few words from clients who walked out
            feeling like the best version of themselves.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          {/* Oversized opening quotation mark — a quiet editorial flourish */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[12rem] leading-none text-gold/15 sm:-top-24 sm:text-[16rem]"
          >
            &ldquo;
          </span>

          <div className="relative min-h-[20rem] sm:min-h-[16rem]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.blockquote
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: reduce ? 0 : dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : dir * -40 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="text-center"
                aria-live="polite"
              >
                <div className="flex items-center justify-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-[1.15rem] w-[1.15rem] text-gold"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="mx-auto mt-8 max-w-3xl text-balance font-display text-2xl font-medium leading-snug text-ink sm:text-[2rem] sm:leading-[1.3]">
                  {active.quote}
                </p>
                <footer className="mt-9">
                  <div className="mx-auto h-px w-10 bg-gold/50" />
                  <div className="mt-5 font-display text-lg text-ink">
                    {active.name}
                  </div>
                  <div className="label-caps mt-1.5 text-gold/80">
                    {active.service}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-all duration-300 ease-luxe hover:border-gold/70 hover:text-gold focus-visible:border-gold/70 focus-visible:text-gold"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
            </button>

            <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose testimonial">
              {reviews.map((r, i) => (
                <button
                  key={r.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1} of ${count}`}
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all duration-500 ease-luxe ${
                    i === index
                      ? 'w-8 bg-gold'
                      : 'w-2 bg-ink/20 hover:bg-ink/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-all duration-300 ease-luxe hover:border-gold/70 hover:text-gold focus-visible:border-gold/70 focus-visible:text-gold"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
