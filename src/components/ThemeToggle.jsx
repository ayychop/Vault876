import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../lib/theme.jsx'

// Sleek Sun/Moon toggle. Shows the Sun while dark (tap to bring the light up),
// the Moon while light. The icon swaps with a short rotate/scale cross-fade.
export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors duration-300 ease-luxe hover:border-gold/70 hover:text-gold ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute flex items-center justify-center"
        >
          {dark ? (
            <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
          ) : (
            <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
