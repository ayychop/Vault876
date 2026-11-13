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
          role="button"
          tabIndex={0}
          onClick={enter}
          onKeyDown={onKey}
          aria-label="Enter the Vault — press anywhere to open the site"
          className="group fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden outline-none"
          // Always obsidian, independent of light/dark theme, so the gold crest
          // and glow never wash out and no light flash leaks through on exit.
          style={{ backgroundColor: '#0A0A0A' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(6px)' }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          {/* Soft obsidian vignette for depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(130% 110% at 50% 46%, transparent 42%, rgba(0,0,0,0.55) 100%)',
            }}
          />

          {/* ---- Continuous premium glow stack, centred ON the crest (the logo
                  sits ~4vh above viewport centre, so the whole stack is lifted
                  to match — keeping all the energy behind the mark). ---- */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex -translate-y-[4vh] items-center justify-center"
          >
            {/* 1. Slow-rotating conic gold halo — a living, shifting glow. */}
            <motion.div
              className="absolute h-[92vmin] w-[92vmin] rounded-full"
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
              className="absolute h-[70vmin] w-[70vmin] rounded-full"
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
              className="absolute h-[62vmin] w-[62vmin] rounded-full"
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
            {/* 4. Radiating energy pulses — larger, slim gold rings blooming
                   outward from the crest so the energy stays centred on it. */}
            {!reduce &&
              [0, 1, 2].map((n) => (
                <motion.div
                  key={n}
                  className="absolute h-[56vmin] w-[56vmin] rounded-full border border-gold/30"
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ scale: 0.55, opacity: 0 }}
                  animate={{ scale: [0.55, 1.75], opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 6,
                    ease: 'easeOut',
                    repeat: Infinity,
                    delay: n * 2,
                  }}
                />
              ))}
          </div>

          {/* Full crest lockup, with its own continuous breathing gold glow so it
              reads as lit from within. Visual only — the whole gate is the button. */}
          <motion.div
            className="relative mb-[8vh]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <motion.img
              src={logoFull}
              alt="VAULT 876 — Hair & Beauty"
              draggable={false}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              style={{ willChange: 'transform, filter' }}
              className="w-[min(80vw,580px)] select-none transition-transform duration-500 ease-luxe group-hover:scale-[1.025]"
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
          </motion.div>

          {/* Enter prompt — sleek, wide-tracked couture caps + an instruction line */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
            className="absolute bottom-[10vh] flex flex-col items-center gap-4"
          >
            <motion.span
              className="pl-[0.42em] font-sans text-[1.05rem] font-normal uppercase text-white/90 sm:text-[1.2rem]"
              style={{ letterSpacing: '0.42em' }}
              animate={reduce ? {} : { opacity: [0.72, 1, 0.72] }}
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
            >
              Enter the Vault
            </motion.span>
            {/* thin gold underline */}
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            {/* instruction — the whole screen is the key */}
            <span
              className="pl-[0.34em] font-sans text-[0.62rem] font-medium uppercase text-white/45 sm:text-[0.68rem]"
              style={{ letterSpacing: '0.34em' }}
            >
              Press anywhere to enter
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
