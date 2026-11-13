// VAULT 876 crest — a flat, single-weight gold reinterpretation of the salon's
// original badge: a fine gold ring holding four hand-drawn tools (comb, makeup
// brush, scissors, clipper), with "VAULT 876" in Playfair straddling the base
// of the circle. Fashion-house register (Chanel / YSL). No Lucide, no raster.
//
// Props:
//   size     — px, the crest's width
//   className
//   variant  — 'crest' (full stacked badge, default) or 'mark' (ring + tools
//              only, square, for the navbar lockup)
//   withText — crest only; drop the stacked wordmark if false
export default function Logo({ size = 240, className = '', variant = 'crest', withText = true }) {
  const sw = 1.5 // single stroke weight, in viewBox units
  const mark = variant === 'mark'
  const showText = !mark && withText

  return (
    <svg
      viewBox={mark ? '28 4 184 184' : '0 0 240 236'}
      width={size}
      height={mark ? size : size * (236 / 240)}
      className={`text-ink ${className}`}
      role="img"
      aria-label="VAULT 876 — Hair & Beauty"
      fill="none"
    >
      <g
        stroke="#D4AF37"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ring + inner hairline + hallmark ticks */}
        <circle cx="120" cy="96" r="80" opacity="0.9" />
        <circle cx="120" cy="96" r="73" strokeWidth="0.6" opacity="0.4" />
        <path d="M120 10v8M120 174v8M34 96h8M198 96h8" />

        {/* --- Tool cluster, fanned like the original --- */}

        {/* Comb (left) */}
        <g transform="translate(70,92) rotate(-16)">
          <path d="M0 -30V20" />
          <path d="M0 -26h11M0 -20h11M0 -14h11M0 -8h11M0 -2h11" />
        </g>

        {/* Makeup brush (centre-left) */}
        <g transform="translate(99,94) rotate(-6)">
          <path d="M0 24V-6" />
          <path d="M-4 -6h8" />
          <path d="M-4 -6c-1 -8 1 -24 4 -24s5 16 4 24" />
        </g>

        {/* Scissors (centre-right) */}
        <g transform="translate(130,90) rotate(6)">
          <circle cx="-6" cy="22" r="5" />
          <circle cx="6" cy="22" r="5" />
          <path d="M-6 17 L8 -26" />
          <path d="M6 17 L-8 -26" />
          <circle cx="0" cy="6" r="1.1" fill="#D4AF37" stroke="none" />
        </g>

        {/* Clipper (right) */}
        <g transform="translate(162,92) rotate(16)">
          <path d="M-7 -8h14l-1.5 30h-11z" />
          <path d="M-8 -8l1.5 -6h13l1.5 6" />
          <path d="M-6 -14v-3M-2 -14v-3M2 -14v-3M6 -14v-3" />
          <path d="M-6 2h12" />
        </g>
      </g>

      {showText && (
        <text
          x="120"
          y="214"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="48"
          fontWeight="700"
          letterSpacing="1"
        >
          <tspan fill="currentColor">VAULT</tspan>
          <tspan fill="#D4AF37"> 876</tspan>
        </text>
      )}
    </svg>
  )
}
