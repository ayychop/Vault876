import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Landing from './pages/Landing.jsx'
import Booking from './pages/Booking.jsx'
import BookingSuccess from './pages/BookingSuccess.jsx'
import Admin from './pages/Admin.jsx'
import EntryGate from './components/EntryGate.jsx'
import BookNow from './components/BookNow.jsx'
import ScrollThread from './components/ScrollThread.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import BackToTop from './components/BackToTop.jsx'

const EASE = [0.16, 1, 0.3, 1]

export default function App() {
  const location = useLocation()
  const lenisRef = useRef(null)

  // Buttery inertial scrolling via Lenis — disabled when the visitor prefers
  // reduced motion, and wired so in-page anchors glide instead of jumping.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 })
    lenisRef.current = lenis
    window.__vaultLenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length < 2) return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -72, duration: 1.2 })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onAnchorClick)
      lenis.destroy()
      lenisRef.current = null
      if (window.__vaultLenis === lenis) delete window.__vaultLenis
    }
  }, [])

  // Always land at the top when the route changes (works with or without Lenis).
  useEffect(() => {
    const l = lenisRef.current
    if (l) l.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    // Respect the visitor's reduced-motion preference across every animation.
    <MotionConfig reducedMotion="user">
      {/* Ambient drifting gold aura — faint, behind everything, screen-blended */}
      <div className="aura" aria-hidden>
        <span />
        <span />
      </div>
      {/* Filmic grain over the whole surface */}
      <div className="grain" aria-hidden />
      {/* Desktop-only glowing gold cursor */}
      <CursorGlow />
      {/* Gold scroll-progress thread tying the sections together */}
      <ScrollThread />
      {/* First-visit splash — self-gates on sessionStorage */}
      <EntryGate />

      {/* Refined page transitions — an opacity crossfade (no transform, so the
          fixed navbar/book-bar keep their positioning) between routes. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Always-on Book Now (hides itself on the booking flow) */}
      <BookNow />
      {/* Desktop return-to-top */}
      <BackToTop />
    </MotionConfig>
  )
}
