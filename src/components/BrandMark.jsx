import logoUrl from '../assets/vault-logo-final.png'

// The full VAULT 876 crest lockup — gold tools + wordmark on transparency.
// `size` is the rendered HEIGHT in px; the width scales with the artwork.
// `glow`  adds a soft gold aura + drop-shadow behind the mark.
// `badge` gives the transparent crest a solid Obsidian backing + hairline gold
//         border in LIGHT mode (where the gold/white artwork would wash out on
//         the light canvas); in DARK mode it stays transparent on the dark page.
export default function BrandMark({ size = 40, glow = false, badge = false, className = '' }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${
        badge
          ? 'rounded-[1.4rem] px-7 py-5 ring-1 ring-gold/30 bg-[#0A0A0A] dark:bg-transparent dark:ring-0'
          : ''
      } ${className}`}
      style={{ height: badge ? size + 40 : size }}
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
        loading="eager"
        decoding="async"
        fetchpriority="high"
        className="relative w-auto select-none object-contain"
        style={{
          height: size,
          // Reserve width up front (crest is 4:3) so it never shifts layout or pops in.
          aspectRatio: '4 / 3',
          ...(glow
            ? { filter: 'drop-shadow(0 6px 22px rgba(212,175,55,0.3))' }
            : null),
        }}
      />
    </span>
  )
}
