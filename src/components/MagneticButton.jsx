import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// Wraps any element and gives it a "magnetic" pull toward the cursor while the
// pointer is over it, springing smoothly back to center on leave. No-op under
// reduced-motion and on touch (mousemove simply never fires).
export default function MagneticButton({ children, strength = 0.4, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.6 })

  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  )
}
