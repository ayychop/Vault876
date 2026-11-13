import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

// A fixed hairline on the right edge that fills with gold as the page scrolls —
// a high-end thread tying the sections together top to bottom.
export default function ScrollThread() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  const nodeTop = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-0 z-40 hidden h-screen w-px bg-ink/10 sm:block lg:right-6"
    >
      <motion.div
        style={{ scaleY: progress }}
        className="h-full w-full origin-top bg-gradient-to-b from-gold-soft via-gold to-gold/30"
      />
      <motion.span
        style={{ top: nodeTop }}
        className="absolute -left-[3px] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold-soft shadow-[0_0_10px_2px_rgba(212,175,55,0.7)]"
      />
    </div>
  )
}
