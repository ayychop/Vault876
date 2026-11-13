import { Link } from 'react-router-dom'
import emblem from '../assets/crest-emblem.png'

// VAULT 876 lockup — the gold tools crest beside a Playfair Display wordmark
// (obsidian/white "VAULT" + gold "876"). Reads as a luxury fashion house at a
// glance. Used in the navbar, mobile sheet and booking header.
const sizes = {
  sm: { mark: 34, text: 'text-lg' },
  md: { mark: 44, text: 'text-2xl' },
  lg: { mark: 56, text: 'text-3xl' },
}

export default function Wordmark({ className = '', size = 'md', onClick }) {
  const s = sizes[size] || sizes.md

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="VAULT 876 — Hair & Beauty, home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <img
        src={emblem}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ height: s.mark }}
        className="w-auto shrink-0 select-none object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.22)] transition-transform duration-500 ease-luxe group-hover:scale-105"
      />
      <span className="inline-flex items-baseline gap-1.5 leading-none">
        <span
          className={`font-display font-semibold tracking-[0.03em] text-ink ${s.text}`}
        >
          VAULT
        </span>
        <span
          className={`font-display font-semibold text-gold transition-colors duration-300 group-hover:text-gold-soft ${s.text}`}
        >
          876
        </span>
      </span>
    </Link>
  )
}
