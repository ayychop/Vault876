import { motion } from 'framer-motion'
import { fadeUp, imageReveal, stagger } from '../lib/motion.js'
import { site } from '../lib/site.js'
import { IconPhone, IconPin } from './icons.jsx'

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-canvas">
      {/* Editorial portrait — bleeds off the right edge, anchored to the model */}
      <motion.div
        variants={imageReveal}
        initial="hidden"
        animate="show"
        className="absolute inset-y-0 right-0 w-full lg:w-[58%]"
      >
        <img
          src="/images/hero-braids-lashes.jpg"
          alt="VAULT 876 client wearing long braided extensions and bold lashes"
          className="h-full w-full object-cover object-[90%_18%]"
        />
        {/* Scrims: darken for mood + hold text legible over the ground */}
        <div className="absolute inset-0 bg-obsidian/48" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent lg:hidden" />
        {/* Sink the lower-background clutter (both themes) */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/15 lg:from-canvas lg:via-canvas/78 lg:to-transparent lg:to-[72%]" />
        {/* Soft vignette settles the edges into the page */}
        <div className="absolute inset-0 hidden lg:block [box-shadow:inset_0_0_140px_40px_rgba(10,10,10,0.6)]" />
      </motion.div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 sm:px-8">
        <motion.div
          variants={stagger(0.14, 0.15)}
          initial="hidden"
          animate="show"
          className="max-w-xl pt-24 pb-28"
        >
          <motion.h1
            variants={fadeUp}
            className="display-xl font-display font-semibold text-white lg:text-ink"
          >
            Look good<span className="text-gold">.</span>
            <br />
            Feel good<span className="text-gold">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-md text-lg font-light leading-relaxed text-white/70 lg:text-ink/70"
          >
            Hair &amp; beauty for all hair types — braids, locs, wigs, relaxers and
            lashes, made with precision in {site.address.city}.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <a href={site.phoneHref} className="btn-gold">
              <IconPhone className="h-[1.1rem] w-[1.1rem]" />
              Call Salon
            </a>
            <a href="#services" className="btn-ghost">
              Explore Services
            </a>
          </motion.div>

          <motion.a
            variants={fadeUp}
            href={site.directionsHref}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 text-sm text-white/45 transition-colors duration-300 hover:text-gold lg:text-ink/45"
          >
            <IconPin className="h-4 w-4 text-gold/80" />
            Bakers Mews, Buckingham Street, {site.address.city} {site.address.postcode}
          </motion.a>
        </motion.div>
      </div>

      {/* Quiet scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="label-caps text-[0.6rem] text-white/40">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  )
}
