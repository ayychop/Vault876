import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'

// VAULT 876 lockup — the full gold crest (which already carries the wordmark).
// Used in the navbar, mobile sheet and booking header. `size` maps to a
// rendered logo height that suits each placement.
const heights = { sm: 42, md: 54, lg: 68 }

export default function Wordmark({ className = '', size = 'md', onClick }) {
  const h = heights[size] || heights.md

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="VAULT 876 — Hair & Beauty, home"
      className={`group inline-flex items-center ${className}`}
    >
      <BrandMark
        size={h}
        className="shrink-0 transition-transform duration-500 ease-luxe group-hover:scale-[1.04]"
      />
    </Link>
  )
}
