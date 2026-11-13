import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import logoFull from '../assets/vault-logo-final.png'

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
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(6px)' }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          {/* Soft gold glow, breathing in step with the logo.
              Centred via a wrapper because Framer Motion's animated transform
              (scale) would otherwise clobber translate-based centering. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="h-[62vmin] w-[62vmin] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.06) 42%, transparent 70%)',
              }}
              animate={
                reduce
                  ? { opacity: 0.6 }
                  : { opacity: [0.45, 0.8, 0.45], scale: [0.95, 1.08, 0.95] }
              }
              transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>

          {/* Full crest lockup — the entry button. Sized to feel like a
              cinematic statement without crowding the frame. */}
          <motion.button
            type="button"
            onClick={enter}
            onKeyDown={onKey}
            aria-label="Enter the Vault — open the site"
            className="relative mb-[8vh] rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-8 focus-visible:ring-offset-canvas"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.985 }}
          >
            <motion.img
              src={logoFull}
              alt="VAULT 876 — Hair & Beauty"
              draggable={false}
              className="w-[min(78vw,560px)] select-none"
              style={{ filter: 'drop-shadow(0 18px 60px rgba(212,175,55,0.22))' }}
              animate={reduce ? {} : { scale: [1, 1.025, 1] }}
              transition={{ duration: 3.6, ease: 'easeInOut', repeat: Infinity }}
            />
          </motion.button>

          {/* Enter prompt — sleek, wide-tracked couture caps */}
          <motion.button
            type="button"
            onClick={enter}
            onKeyDown={onKey}
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
            className="group absolute bottom-[11vh] flex flex-col items-center gap-3 outline-none"
          >
            <motion.span
              className="pl-[0.5em] font-sans text-[0.8rem] font-light uppercase text-ink/90"
              style={{ letterSpacing: '0.5em' }}
              animate={reduce ? {} : { opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
            >
              Enter the Vault
            </motion.span>
            {/* thin gold underline that breathes with the prompt */}
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
