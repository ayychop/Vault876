import logoUrl from '../assets/vault-logo-final.png'

// The full VAULT 876 crest lockup — gold tools + wordmark on transparency.
// `size` is the rendered HEIGHT in px; the width scales with the artwork.
// `glow` adds a soft gold aura + drop-shadow behind the mark.
export default function BrandMark({ size = 40, glow = false, className = '' }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: '-26%',
            background:
              'radial-gradient(circle, rgba(212,175,55,0.36) 0%, rgba(212,175,55,0.09) 48%, transparent 72%)',
          }}
        />
      )}
      <img
        src={logoUrl}
        alt="VAULT 876 — Hair & Beauty"
        draggable={false}
        className="relative h-full w-auto select-none object-contain"
        style={
          glow
            ? { filter: 'drop-shadow(0 6px 22px rgba(212,175,55,0.3))' }
            : undefined
        }
      />
    </span>
  )
}
