import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Desktop-only custom cursor: a glowing gold ring that trails the pointer and
// expands + fills with a soft gold blur over anything clickable. Native cursor
// is hidden on fine-pointer devices via index.css. Touch devices render nothing.
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.35 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, [data-cursor="hover"]'
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      setActive(!!e.target.closest?.(INTERACTIVE))
    }
    const leave = () => setVisible(false)
    const dn = () => setDown(true)
    const up = () => setDown(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', dn)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', dn)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-normal"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.span
        className="block -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
        animate={{
          width: active ? 54 : 24,
          height: active ? 54 : 24,
          scale: down ? 0.82 : 1,
          backgroundColor: active ? 'rgba(212,175,55,0.16)' : 'rgba(212,175,55,0)',
          borderColor: active ? 'rgba(212,175,55,0.95)' : 'rgba(212,175,55,0.6)',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.5 }}
        style={{ boxShadow: '0 0 20px 2px rgba(212,175,55,0.35)' }}
      />
      {/* Precise center dot */}
      <span className="absolute left-0 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
    </motion.div>
  )
}
