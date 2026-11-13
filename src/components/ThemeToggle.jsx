import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/theme.jsx'

// Unmissable theme switch: a pill-shaped segmented control with "Dark" / "Light"
// text labels and a gold indicator that slides behind the active side. No
// ambiguity that the visitor can change the theme.
export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={!dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center rounded-full border border-ink/20 bg-surface/70 p-1 text-[0.7rem] font-semibold uppercase tracking-wide transition-colors duration-300 hover:border-gold/60 ${className}`}
    >
      {/* Sliding gold indicator behind the active label */}
      <span
        aria-hidden
        className="absolute bottom-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-gold shadow-[0_6px_18px_-8px_rgba(212,175,55,0.8)] transition-[left] duration-300 ease-luxe"
        style={{ left: dark ? '0.25rem' : '50%' }}
      />
      <span
        className={`relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 min-[400px]:px-3 transition-colors duration-300 ${
          dark ? 'text-obsidian' : 'text-ink/55'
        }`}
      >
        <Moon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        <span className="hidden min-[400px]:inline">Dark</span>
      </span>
      <span
        className={`relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 min-[400px]:px-3 transition-colors duration-300 ${
          dark ? 'text-ink/55' : 'text-obsidian'
        }`}
      >
        <Sun className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        <span className="hidden min-[400px]:inline">Light</span>
      </span>
    </button>
  )
}
