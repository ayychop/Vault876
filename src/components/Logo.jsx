import { Scissors, Sparkles } from 'lucide-react'
import { IconComb } from './icons.jsx'

// VAULT 876 emblem — a flat, single-weight gold reinterpretation of the
// original 3D crest: a fine ring, an elegant tool cluster, and a
// high-contrast serif lockup. Fashion-house register (Chanel / YSL / Dior).
//
// Props:
//   size   — diameter in px (default 200)
//   className
export default function Logo({ size = 200, className = '', withText = true }) {
  const stroke = 1.4

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="VAULT 876 — Hair & Beauty"
    >
      {/* Ring + couture tick marks */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full text-gold"
        fill="none"
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          stroke="currentColor"
          strokeWidth={stroke}
          opacity="0.85"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.4"
        />
        {/* Four cardinal ticks, like a hallmark */}
        <g stroke="currentColor" strokeWidth={stroke} strokeLinecap="round">
          <path d="M100 4v7" />
          <path d="M100 189v7" />
          <path d="M4 100h7" />
          <path d="M189 100h7" />
        </g>
      </svg>

      {/* Inner composition */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-gold">
        {/* Tool cluster */}
        <div className="flex items-center justify-center gap-3">
          <IconComb
            className="h-[8%] min-h-5 w-auto -rotate-[18deg] text-gold/90"
            style={{ height: size * 0.11 }}
            strokeWidth={stroke}
          />
          <Scissors
            style={{ height: size * 0.16, width: size * 0.16 }}
            strokeWidth={stroke}
            className="text-gold"
          />
          <Sparkles
            style={{ height: size * 0.1, width: size * 0.1 }}
            strokeWidth={stroke}
            className="text-gold-soft"
          />
        </div>

        {withText && (
          <>
            {/* Hairline divider */}
            <div
              className="my-[6%] h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
              style={{ width: size * 0.42 }}
            />

            {/* Wordmark */}
            <div className="flex items-baseline justify-center gap-[0.12em] leading-none">
              <span
                className="font-display font-semibold tracking-[0.04em] text-ink"
                style={{ fontSize: size * 0.17 }}
              >
                VAULT
              </span>
              <span
                className="font-display font-medium italic text-gold"
                style={{ fontSize: size * 0.17 }}
              >
                876
              </span>
            </div>

            <div
              className="mt-[4%] font-sans font-medium uppercase text-ink/70"
              style={{
                fontSize: size * 0.052,
                letterSpacing: size * 0.012,
              }}
            >
              Hair &amp; Beauty
            </div>
          </>
        )}
      </div>
    </div>
  )
}
