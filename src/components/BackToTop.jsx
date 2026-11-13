import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Desktop-only "return to top" — a magnetic gold control that glides in once the
// visitor is well past the hero. (Mobile keeps the full-width Book Now bar, so
// this stays lg+ to avoid stacking two floating affordances.)
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.15)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const l = window.__vaultLenis
    if (l) l.scrollTo(0, { duration: 1.1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed bottom-8 right-8 z-40 hidden lg:block"
          style={{ willChange: 'transform, opacity' }}
        >
          <MagneticButton strength={0.4}>
            <button
              type="button"
              onClick={toTop}
              aria-label="Back to top"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-canvas/70 text-gold backdrop-blur-md transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-obsidian hover:shadow-[0_18px_45px_-18px_rgba(212,175,55,0.85)]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
