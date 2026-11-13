import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { site } from '../lib/site.js'
import { IconPhone } from './icons.jsx'
import ImagePlaceholder from './ImagePlaceholder.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Word-by-word blur-in for the headline — the editorial reveal.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}
const word = {
  hidden: { opacity: 0, y: 30, filter: 'blur(18px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE },
  },
}
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Cinematic drift: the image sinks and the content lifts as you scroll away.
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-obsidian"
    >
      {/* Full-bleed branded placeholder — a living obsidian field with the
          medallion as a faint watermark and a slow sheen, standing in until the
          salon's own hero photography lands. */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
        style={reduce ? undefined : { y: imgY, scale: imgScale }}
        className="absolute inset-0"
      >
        <ImagePlaceholder className="h-full w-full" watermark logoSize={360} />
      </motion.div>

      {/* Moody cinematic grade — deep obsidian vignette for drama + legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/35 to-obsidian/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_32%,_rgba(10,10,10,0.62)_100%)]" />

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center sm:px-8"
      >
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-black leading-[0.86] tracking-[-0.055em] text-white"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={word} className="inline-block">
              Flawless<span className="text-gold">.</span>
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={word} className="inline-block italic font-medium">
              Every time<span className="not-italic font-black text-gold">.</span>
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.7 }}
          className="mt-8 max-w-md font-sans text-[0.78rem] font-light uppercase tracking-[0.42em] text-white/70"
        >
          Luxury hair &amp; beauty — {site.address.city}
        </motion.p>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.9 }}
          className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
        >
          {/* Book Now is persistently available in the mobile sticky bar, so the
              hero's primary mobile action is Call Salon — no duplicate CTA. */}
          <Link
            to="/booking"
            className="btn-gold !hidden !rounded-full !px-12 !py-5 !text-base sm:!inline-flex"
          >
            Book Now
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-500 ease-luxe hover:scale-[1.03] hover:border-gold/70 hover:text-white hover:shadow-[0_18px_50px_-18px_rgba(212,175,55,0.55)]"
          >
            <IconPhone className="h-[1.05rem] w-[1.05rem]" />
            Call Salon
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
          Scroll
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </motion.div>
    </section>
  )
}
