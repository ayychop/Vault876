import BrandMark from './BrandMark.jsx'
import logoUrl from '../assets/vault-logo-final.png'

// Branded "photography coming soon" slot. The definitive placeholder design is a
// solid OBSIDIAN PLAQUE (gold border) holding an oversized gold crest, with the
// label + caption sitting BELOW it — a deliberate, expensive plaque that reads
// identically in light and dark (gold on black looks premium on any canvas).
// `watermark` mode is the one exception: a full-bleed faint crest for the hero
// background.
export default function ImagePlaceholder({
  className = '',
  logoSize = 120,
  watermark = false,
  plaque = false,
  label = null,
  caption = null,
  children,
}) {
  // ---- Hero watermark: full-bleed faint gold crest (not a plaque) ----
  if (watermark) {
    return (
      <div
        className={`relative overflow-hidden bg-canvas ${className}`}
        role="img"
        aria-label="VAULT 876"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1),_transparent_68%)]" />
        <div className="placeholder-sheen pointer-events-none absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrandMark
            size={logoSize}
            className="opacity-[0.22] [filter:saturate(1.1)] dark:opacity-[0.28] dark:[filter:none]"
          />
        </div>
        {children}
      </div>
    )
  }

  // ---- Plaque placeholder: obsidian plaque + oversized crest + text below ----
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-6 overflow-hidden bg-surface p-7 text-center ${className}`}
      role="img"
      aria-label={label ? `${label} — photography coming soon` : 'Photography coming soon'}
    >
      {/* faint warm bloom so the panel is never a flat void */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08),_transparent_72%)]" />
      <div className="placeholder-sheen pointer-events-none absolute inset-0" />

      {/* The obsidian plaque — oversized gold crest inside a gold-bordered coin */}
      <div className="relative flex aspect-square w-[62%] min-w-[128px] max-w-[232px] items-center justify-center rounded-[1.7rem] bg-[#0A0A0A] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)] ring-1 ring-gold/45">
        {/* soft inner gold bloom */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_42%,_rgba(212,175,55,0.16),_transparent_66%)]" />
        <img
          src={logoUrl}
          alt=""
          aria-hidden
          draggable={false}
          loading="lazy"
          decoding="async"
          className="relative w-[82%] select-none object-contain"
          style={{ filter: 'drop-shadow(0 6px 22px rgba(212,175,55,0.35))' }}
        />
        {/* crisp inner hairline */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-gold/15" />
      </div>

      {/* Label + caption, below the plaque */}
      {(label || caption) && (
        <div className="relative max-w-xs">
          {label && (
            <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold">
              {label}
            </span>
          )}
          {caption && (
            <p className="mt-2 font-display text-xl leading-tight text-ink/90">
              {caption}
            </p>
          )}
        </div>
      )}

      {/* hairline frame around the whole card */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-ink/10" />
      {children}
    </div>
  )
}
