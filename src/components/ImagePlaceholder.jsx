import { motion, useReducedMotion } from 'framer-motion'
import logoUrl from '../assets/vault-logo-final.png'

// Cinematic "photography coming soon" slot — a seamless poster, not a boxed
// plaque. A rich gradient ground, a massive crest watermark embossed into it
// (mix-blend + low opacity) that slowly BREATHES, and editorial text in the
// bottom-left corner.
//   • dark  — warm obsidian gradient, gold crest screened in, white title
//   • light — soft cream gradient with a gold tint, charcoal crest, black title
//
// The breathing opacity lives on the wrapper (a relative multiplier) while the
// image keeps its theme-aware base opacity + blend mode — so the effect reads
// correctly in both themes.
export default function ImagePlaceholder({
  className = '',
  label = null,
  tag = 'Coming soon',
  children,
}) {
  const reduce = useReducedMotion()

  return (
    <div
      role="img"
      aria-label={label ? `${label} — photography coming soon` : 'Photography coming soon'}
      className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(125%_120%_at_28%_15%,#faf6ee,#ece5d6_74%)] dark:bg-[radial-gradient(125%_120%_at_28%_15%,#1c1811,#0a0a0a_66%)] ${className}`}
    >
      {/* warm gold wash pooling toward a corner — cinematic depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_70%_at_78%_92%,rgba(212,175,55,0.14),transparent_62%)]" />
      {/* slow diagonal sheen */}
      <div className="placeholder-sheen pointer-events-none absolute inset-0" />

      {/* Massive crest watermark, embossed into the ground and slowly breathing */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ willChange: 'transform, opacity' }}
        animate={
          reduce
            ? {}
            : { opacity: [0.72, 1, 0.72], scale: [1, 1.04, 1], x: [0, 5, 0] }
        }
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
      >
        <img
          src={logoUrl}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          className="w-[84%] max-w-[480px] -translate-y-[7%] select-none object-contain opacity-[0.1] mix-blend-multiply [filter:brightness(0)] dark:opacity-[0.22] dark:mix-blend-screen dark:[filter:none]"
        />
      </motion.div>

      {/* Editorial text — bottom-left corner */}
      {label && (
        <div className="absolute bottom-0 left-0 p-7 text-left sm:p-8">
          <h3 className="font-display text-3xl font-bold leading-[0.95] text-ink sm:text-[2.6rem]">
            {label}
          </h3>
          {tag && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.36em] text-gold"
            >
              {tag}
            </motion.p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
