import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'

// VAULT 876 lockup — the processed gold crest medallion beside the Playfair
// wordmark, with the house number in gold. Used in the navbar, mobile sheet and
// booking header.
const sizes = {
  sm: { mark: 32, text: 'text-base' },
  md: { mark: 40, text: 'text-xl' },
  lg: { mark: 52, text: 'text-3xl' },
}

export default function Wordmark({ className = '', size = 'md', onClick }) {
  const s = sizes[size] || sizes.md

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="VAULT 876 — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <BrandMark size={s.mark} className="shrink-0 transition-transform duration-500 ease-luxe group-hover:scale-105" />
      <span className="inline-flex items-baseline gap-1.5 leading-none">
        <span className={`font-display font-semibold tracking-[0.08em] text-ink ${s.text}`}>
          VAULT
        </span>
        <span
          className={`font-display font-medium text-gold transition-colors duration-300 group-hover:text-gold-soft ${s.text}`}
        >
          876
        </span>
      </span>
    </Link>
  )
}
