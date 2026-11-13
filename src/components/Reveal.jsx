import { motion } from 'framer-motion'
import { spring } from '../lib/motion.js'

const EASE = [0.16, 1, 0.3, 1]

// Cinematic section reveal: the block wipes in from a clipped, lifted, slightly
// dimmed state and settles on the house spring as it scrolls into view. The clip
// and fade stay smooth tweens so only the lift carries the gentle bounce.
// Honors reduced-motion via MotionConfig.
export default function Reveal({ children, className = '', y = 72, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
        clipPath: 'inset(8% 0% 12% 0%)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{
        y: { ...spring, delay },
        opacity: { duration: 0.8, ease: EASE, delay },
        clipPath: { duration: 1.1, ease: EASE, delay },
      }}
    >
      {children}
    </motion.div>
  )
}
