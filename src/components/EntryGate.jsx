import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
  // Show on the first visit of the session only — and never over the owner portal.
  const [open, setOpen] = useState(() => !hasEntered())
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const visible = open && !pathname.startsWith('/admin')

  // Lock scroll beneath the gate while it is showing.
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

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
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(6px)' }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          {/* ---- Continuous premium glow stack, all centred behind the crest ---- */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {/* 1. Slow-rotating conic gold halo — a living, shifting glow that
                   never fully resolves into a ring (heavy blur keeps it soft). */}
            <motion.div
              className="absolute h-[86vmin] w-[86vmin] rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(212,175,55,0) 0deg, rgba(212,175,55,0.20) 65deg, rgba(231,204,110,0.34) 135deg, rgba(212,175,55,0.10) 215deg, rgba(212,175,55,0) 320deg)',
                filter: 'blur(64px)',
                opacity: 0.65,
                willChange: 'transform',
              }}
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
            />
            {/* 2. Counter-rotating softer halo for depth — slower, fainter. */}
            <motion.div
              className="absolute h-[66vmin] w-[66vmin] rounded-full"
              style={{
                background:
                  'conic-gradient(from 180deg, rgba(212,175,55,0) 0deg, rgba(231,204,110,0.22) 120deg, rgba(212,175,55,0) 260deg)',
                filter: 'blur(52px)',
                opacity: 0.5,
                willChange: 'transform',
              }}
              animate={reduce ? {} : { rotate: -360 }}
              transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
            />
            {/* 3. Core radial bloom — strong, soft, breathing. */}
            <motion.div
              className="absolute h-[58vmin] w-[58vmin] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.30) 0%, rgba(212,175,55,0.08) 42%, transparent 70%)',
              }}
              animate={
                reduce
                  ? { opacity: 0.7 }
                  : { opacity: [0.55, 0.9, 0.55], scale: [0.96, 1.07, 0.96] }
              }
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            />
            {/* 4. Radiating energy pulses — slim gold rings that bloom outward
                   from the crest and fade, giving a sleek, alive premium charge. */}
            {!reduce &&
              [0, 1, 2].map((n) => (
                <motion.div
                  key={n}
                  className="absolute h-[40vmin] w-[40vmin] rounded-full border border-gold/30"
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ scale: 0.65, opacity: 0 }}
                  animate={{ scale: [0.65, 1.7], opacity: [0, 0.45, 0] }}
                  transition={{
                    duration: 6,
                    ease: 'easeOut',
                    repeat: Infinity,
                    delay: n * 2,
                  }}
                />
              ))}
          </div>

          {/* Full crest lockup — the entry button, with its own continuous,
              breathing gold glow so it reads as lit from within. */}
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
              loading="eager"
              decoding="async"
              fetchpriority="high"
              style={{ willChange: 'transform, filter' }}
              className="w-[min(80vw,580px)] select-none"
              animate={
                reduce
                  ? { filter: 'drop-shadow(0 0 48px rgba(212,175,55,0.4))' }
                  : {
                      scale: [1, 1.025, 1],
                      filter: [
                        'drop-shadow(0 0 36px rgba(212,175,55,0.30))',
                        'drop-shadow(0 0 72px rgba(212,175,55,0.55))',
                        'drop-shadow(0 0 36px rgba(212,175,55,0.30))',
                      ],
                    }
              }
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
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
              className="pl-[0.42em] font-sans text-[0.95rem] font-normal uppercase text-ink/90 sm:text-base"
              style={{ letterSpacing: '0.42em' }}
              animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
            >
              Enter the Vault
            </motion.span>
            {/* thin gold underline that breathes with the prompt */}
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
