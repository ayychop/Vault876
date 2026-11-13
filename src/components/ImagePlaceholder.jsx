import BrandMark from './BrandMark.jsx'

// A branded "coming soon" image slot: a deep obsidian panel with the medallion
// centred inside and a slow diagonal sheen sweeping across it, so an empty slot
// still feels alive and luxurious. Stands in until the salon supplies real
// photography.
export default function ImagePlaceholder({
  className = '',
  logoSize = 120,
  watermark = false,
  label = null,
  caption = null,
  children,
}) {
  return (
    <div
      className={`relative overflow-hidden bg-canvas ${className}`}
      role="img"
      aria-label={label ? `${label} — photography coming soon` : 'Photography coming soon'}
    >
      {/* faint gold center bloom */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.07),_transparent_68%)]" />
      {/* hairline weave so the panel is never a flat void */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgb(var(--ink) / 0.02) 0px, rgb(var(--ink) / 0.02) 1px, transparent 1px, transparent 9px)',
        }}
      />
      {/* diagonal sheen sweep */}
      <div className="placeholder-sheen pointer-events-none absolute inset-0" />

      {/* centred medallion */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BrandMark
          size={logoSize}
          glow={!watermark}
          className={watermark ? 'opacity-[0.16]' : ''}
        />
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
            <p className="mt-2 max-w-xs font-display text-xl leading-tight text-ink/90">
              {caption}
            </p>
          )}
        </div>
      )}

      {/* hairline frame */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-ink/10" />
      {children}
    </div>
  )
}
