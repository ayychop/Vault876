import BrandMark from './BrandMark.jsx'
import logoUrl from '../assets/vault-logo-final.png'

// A branded "coming soon" image slot. In `plaque` mode it is a solid obsidian
// panel with a large gold crest + gold hairline border — a deliberate, premium
// plaque that reads identically in light and dark (gold on black looks
// expensive on any background). Stands in until the salon supplies real
// photography.
export default function ImagePlaceholder({
  className = '',
  logoSize = 120,
  watermark = false,
  plaque = false,
  label = null,
  caption = null,
  children,
}) {
  return (
    <div
      className={`relative overflow-hidden ${plaque ? 'bg-[#0A0A0A]' : 'bg-canvas'} ${className}`}
      role="img"
      aria-label={label ? `${label} — photography coming soon` : 'Photography coming soon'}
    >
      {/* faint gold center bloom */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1),_transparent_68%)]" />
      {/* hairline weave so the panel is never a flat void */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: plaque
            ? 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 9px)'
            : 'repeating-linear-gradient(135deg, rgb(var(--ink) / 0.02) 0px, rgb(var(--ink) / 0.02) 1px, transparent 1px, transparent 9px)',
        }}
      />
      {/* diagonal sheen sweep */}
      <div className="placeholder-sheen pointer-events-none absolute inset-0" />

      {/* centred crest */}
      <div className="absolute inset-0 flex items-center justify-center p-[10%]">
        {plaque ? (
          // Large gold crest filling ~62% of the plaque — a premium watermark.
          <img
            src={logoUrl}
            alt=""
            aria-hidden
            draggable={false}
            loading="lazy"
            decoding="async"
            className="w-[62%] max-w-[240px] select-none object-contain"
            style={{ filter: 'drop-shadow(0 10px 32px rgba(212,175,55,0.28))' }}
          />
        ) : (
          <BrandMark
            size={logoSize}
            glow={!watermark}
            // Watermark shows the real gold crest in both themes — faint enough
            // to sit behind copy, strong enough to read clearly.
            className={
              watermark
                ? 'opacity-[0.22] [filter:saturate(1.1)] dark:opacity-[0.28] dark:[filter:none]'
                : ''
            }
          />
        )}
      </div>

      {/* optional overline + caption */}
      {(label || caption) && (
        <div className="absolute bottom-0 left-0 z-10 p-6 sm:p-7">
          {label && (
            <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold">
              {label}
            </span>
          )}
          {caption && (
            <p
              className={`mt-2 max-w-xs font-display text-xl leading-tight ${
                plaque ? 'text-white/90' : 'text-ink/90'
              }`}
            >
              {caption}
            </p>
          )}
        </div>
      )}

      {/* hairline frame */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ${
          plaque ? 'ring-gold/25' : 'ring-ink/10'
        }`}
      />
      {children}
    </div>
  )
}
