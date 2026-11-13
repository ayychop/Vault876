import { Link } from 'react-router-dom'
import emblem from '../assets/crest-emblem-square.png'

// VAULT 876 navbar lockup: a fixed-size obsidian "coin" + typography wordmark.
//   coin    — a perfect circle (#0A0A0A) with a 1px gold ring, holding the gold
//             tools emblem (object-contain, square art so it never crops or
//             squishes). It reads crisply in BOTH themes — gold on obsidian —
//             and is shrink-0 so it never gets crushed on a narrow screen.
//   line 1  — "VAULT 876" in heavy Playfair Display caps ("876" gold)
//   line 2  — "HAIR & BEAUTY" in tiny ultra-wide sans caps + a gold hairline.
const sizes = {
  sm: { main: 'text-[1.15rem]', sub: 'text-[0.42rem]', gap: 'mt-[3px]', coin: 'h-10 w-10', ring: 'gap-2.5' },
  md: { main: 'text-[1.4rem] sm:text-[1.6rem]', sub: 'text-[0.46rem] sm:text-[0.48rem]', gap: 'mt-1', coin: 'h-12 w-12', ring: 'gap-3' },
  lg: { main: 'text-3xl', sub: 'text-[0.55rem]', gap: 'mt-1.5', coin: 'h-14 w-14', ring: 'gap-3.5' },
}

export default function Wordmark({ className = '', size = 'md', onClick }) {
  const s = sizes[size] || sizes.md

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="VAULT 876 — Hair & Beauty, home"
      className={`group inline-flex min-w-0 items-center ${s.ring} ${className}`}
    >
      {/* Obsidian coin — fixed size, never crushed. The crest is scaled to fill
          the coin (transparent margins clipped) so it reads like a minted coin,
          not a small sticker floating in a black circle. */}
      <span
        className={`wordmark-coin relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0A0A0A] ${s.coin}`}
      >
        <img
          src={emblem}
          alt=""
          aria-hidden
          draggable={false}
          loading="eager"
          decoding="async"
          className="h-full w-full scale-[1.5] select-none object-contain"
        />
      </span>

      {/* Typographic wordmark — a CSS clone of the crest lettering */}
      <span className="inline-flex min-w-0 flex-col items-stretch leading-none">
        {/* Line 1 — "VAULT 876" in heavy high-contrast Playfair, tight kerning */}
        <span
          className={`wordmark-type flex items-baseline justify-center gap-[0.2em] font-display font-black uppercase leading-none tracking-[-0.005em] ${s.main}`}
        >
          <span className="text-ink">VAULT</span>
          <span className="text-gold transition-colors duration-300 group-hover:text-gold-soft">
            876
          </span>
        </span>
        {/* Line 2 — "HAIR & BEAUTY" flanked by gold hairlines, spanning line 1 */}
        <span className={`flex items-center gap-[0.5em] ${s.gap}`}>
          <span className="h-px flex-1 bg-gradient-to-l from-gold/70 via-gold/55 to-transparent" />
          <span
            className={`whitespace-nowrap font-sans font-semibold uppercase tracking-[0.3em] text-ink/70 ${s.sub}`}
          >
            Hair&nbsp;&amp;&nbsp;Beauty
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-gold/70 via-gold/55 to-transparent" />
        </span>
      </span>
    </Link>
  )
}
