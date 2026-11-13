import logoUrl from '../assets/logo-optimized.png'

// The processed VAULT 876 crest in a premium circular container:
// a refined double gold border (inner hairline + outer ring across an obsidian
// gap) and an optional soft gold glow. The image is pre-centred on obsidian so
// object-cover seats it seamlessly.
export default function BrandMark({ size = 40, glow = false, className = '' }) {
  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: '-28%',
            background:
              'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 45%, transparent 70%)',
          }}
        />
      )}
      <img
        src={logoUrl}
        alt="VAULT 876 — Hair & Beauty"
        width={size}
        height={size}
        className="relative h-full w-full rounded-full object-cover"
        style={{
          // the medallion carries its own baked gold rim; add only a faint lift
          boxShadow: '0 0 0 1px rgba(212,175,55,0.25), 0 8px 24px -8px rgba(0,0,0,0.7)',
        }}
      />
    </span>
  )
}
