import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Oversized image that drifts against the scroll inside a clipped frame.
// The image is taller than the frame so the drift never reveals an edge.
// Honors reduced-motion by holding still.
export default function Parallax({
  src,
  alt,
  className = '',
  imgClassName = '',
  strength = 48,
  overlay = null,
  children,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y }}
        className={`absolute left-0 top-[-12%] h-[124%] w-full object-cover ${imgClassName}`}
      />
      {overlay}
      {children}
    </div>
  )
}
