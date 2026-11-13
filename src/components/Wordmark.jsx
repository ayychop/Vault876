import { Link } from 'react-router-dom'

// VAULT 876 — Bodoni display caps with the gold house number.
export default function Wordmark({ className = '', size = 'md', onClick }) {
  const scale = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size]

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="VAULT 876 — home"
      className={`group inline-flex items-baseline gap-2 ${className}`}
    >
      <span
        className={`font-display font-semibold tracking-[0.08em] text-ink ${scale}`}
      >
        VAULT
      </span>
      <span
        className={`font-display font-medium italic text-gold transition-colors duration-300 group-hover:text-gold-soft ${scale}`}
      >
        876
      </span>
    </Link>
  )
}
