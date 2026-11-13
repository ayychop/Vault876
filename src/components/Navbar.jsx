import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Wordmark from './Wordmark.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { IconMenu, IconClose } from './icons.jsx'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Our Promise', href: '#promise' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Legibility scrim at the very top (before the glass kicks in).
          Fades to the theme background, so ink-coloured nav items stay
          readable over the hero photo in both light and dark. */}
      {!scrolled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas via-canvas/55 to-transparent"
        />
      )}
      <div
        className={`relative transition-all duration-500 ease-luxe ${
          scrolled
            ? 'border-b border-ink/5 bg-canvas/70 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/55'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark size="md" />

          {/* Desktop links */}
          <div className="hidden items-center gap-9 md:flex">
            <ul className="flex items-center gap-9">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group relative text-sm font-medium text-ink/70 transition-colors duration-300 hover:text-ink"
                  >
                    {l.label}
                    <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 ease-luxe group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/booking" className="btn-gold !px-6 !py-2.5">
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink"
              aria-label="Open menu"
            >
              <IconMenu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-canvas md:hidden"
          >
            <div className="flex h-[4.5rem] items-center justify-between px-5">
              <Wordmark size="md" onClick={() => setOpen(false)} />
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-ink"
                  aria-label="Close menu"
                >
                  <IconClose className="h-6 w-6" />
                </button>
              </div>
            </div>
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
              className="flex flex-col gap-2 px-5 pt-10"
            >
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink/10 py-5 font-display text-3xl text-ink"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="px-5 pt-10">
              <Link
                to="/booking"
                onClick={() => setOpen(false)}
                className="btn-gold w-full"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
