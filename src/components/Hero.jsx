import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { site } from '../lib/site.js'
import { IconPhone } from './icons.jsx'
import watermarkArt from '../assets/crest-emblem.png'
import MagneticButton from './MagneticButton.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Cinematic mask reveal: each word sits in an overflow-hidden line and slides up
// from beneath it, word by word.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
}
const word = {
  hidden: { y: '130%' },
  show: { y: '0%', transition: { duration: 1.05, ease: EASE } },
}
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

// A single word inside its clipping mask.
function Word({ children, className = '' }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.22em] -mb-[0.16em] align-bottom">
      <motion.span variants={word} className={`inline-block ${className}`}>
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Parallax: the watermark sinks slower than the scroll while the copy lifts.
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.16])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-canvas"
    >
      {/* Oversized crest watermark — a huge, faint texture pushed far behind the
          headline (not a competing element). Theme-aware via CSS filter only:
          a subtle DARK GHOST on the light ground, a boosted GOLD mark on the
          obsidian ground. */}
      <motion.div
        initial={{ scale: 1.14, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
        style={reduce ? { willChange: 'transform' } : { y: imgY, scale: imgScale, willChange: 'transform' }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <img
          src={watermarkArt}
          alt=""
          draggable={false}
          loading="eager"
          decoding="async"
          className="w-[150vw] max-w-[1300px] select-none object-contain opacity-[0.06] [filter:brightness(0)] dark:opacity-[0.16] dark:[filter:none] sm:w-[95vw]"
        />
      </motion.div>

      {/* Cinematic grade — theme-aware vignette that keeps the headline readable
          on both the obsidian (dark) and crisp-white (light) grounds. */}
      <div className="hero-grade absolute inset-0" />
      <div className="hero-vignette absolute inset-0" />

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity, willChange: 'transform, opacity' }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center sm:px-8"
      >
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-black leading-[0.88] tracking-[-0.05em] text-ink"
          style={{ fontSize: 'clamp(3.25rem, 10vw, 8.5rem)' }}
        >
          <span className="block">
            <Word>
              Flawless<span className="text-gold">.</span>
            </Word>
          </span>
          <span className="block">
            <Word className="italic font-medium">Every&nbsp;</Word>
            <Word className="italic font-medium">
              time<span className="not-italic font-black text-gold">.</span>
            </Word>
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          transition={{ delay: 1.1 }}
          className="mt-10 max-w-md font-sans text-[0.78rem] font-light uppercase tracking-[0.42em] text-ink/70"
        >
          Luxury hair &amp; beauty — {site.address.city}
        </motion.p>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          transition={{ delay: 1.3 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          {/* Book Now is persistently available in the mobile sticky bar, so the
              hero's primary mobile action is Call Salon — no duplicate CTA. */}
          <MagneticButton className="!hidden sm:!inline-block">
            <Link to="/booking" className="btn-gold !rounded-full !px-12 !py-5 !text-base">
              Book Now
            </Link>
          </MagneticButton>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-4 text-sm font-medium text-ink/90 backdrop-blur-sm transition-all duration-500 ease-luxe hover:scale-[1.03] hover:border-gold/70 hover:text-ink hover:shadow-[0_18px_50px_-18px_rgba(212,175,55,0.55)]"
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
        transition={{ delay: 1.7, duration: 1 }}
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-ink/50">
          Scroll
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </motion.div>
    </section>
  )
}
