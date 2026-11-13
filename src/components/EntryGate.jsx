import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import BrandMark from './BrandMark.jsx'

const KEY = 'vault876_entered'
const EASE = [0.16, 1, 0.3, 1]

function hasEntered() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function EntryGate() {
  // Show on the first visit of the session only.
  const [open, setOpen] = useState(() => !hasEntered())
  const reduce = useReducedMotion()

  // Lock scroll beneath the gate while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const enter = () => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode — gate simply won't persist */
    }
    setOpen(false)
  }

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      enter()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Soft gold glow, breathing in step with the logo.
              Centred via a wrapper because Framer Motion's animated transform
              (scale) would otherwise clobber translate-based centering. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="h-[46vmin] w-[46vmin] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)',
              }}
              animate={
                reduce
                  ? { opacity: 0.6 }
                  : { opacity: [0.45, 0.8, 0.45], scale: [0.95, 1.08, 0.95] }
              }
              transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>

          {/* Pulsing logo — the entry button */}
          <motion.button
            type="button"
            onClick={enter}
            onKeyDown={onKey}
            aria-label="Enter the Vault — open the site"
            className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={reduce ? {} : { scale: [1, 1.035, 1] }}
              transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
            >
              <BrandMark size={232} />
            </motion.div>
          </motion.button>

          {/* Enter prompt */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
            className="absolute bottom-[13vh] font-sans text-[0.78rem] font-light uppercase text-ink/85"
            style={{ letterSpacing: '0.46em' }}
          >
            <motion.span
              className="inline-block pl-[0.46em]"
              animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
            >
              Enter the Vault
            </motion.span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
