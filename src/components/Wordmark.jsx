import { Link } from 'react-router-dom'
import emblem from '../assets/crest-emblem.png'

// VAULT 876 navbar lockup: a contained crest badge + typography wordmark.
//   badge   — the gold tools emblem inside an obsidian "coin" with a hairline
//             gold ring, so the transparent emblem reads crisply in BOTH themes
//             (gold on obsidian) instead of washing out on a light canvas.
//   line 1  — "VAULT 876" in heavy Playfair Display caps ("876" gold)
//   line 2  — "HAIR & BEAUTY" in tiny ultra-wide sans caps, flanked by gold
//             hairlines. Fully theme-aware: VAULT is obsidian in light, white
//             in dark.
const sizes = {
  sm: { main: 'text-base', sub: 'text-[0.4rem]', gap: 'mt-[3px]', badge: 'h-9 w-9', pad: 'p-[5px]', ring: 'gap-2.5' },
  md: {
    main: 'text-xl sm:text-[1.6rem]',
    sub: 'text-[0.44rem] sm:text-[0.48rem]',
    gap: 'mt-1',
    badge: 'h-11 w-11',
    pad: 'p-1.5',
    ring: 'gap-3',
  },
  lg: { main: 'text-3xl', sub: 'text-[0.55rem]', gap: 'mt-1.5', badge: 'h-14 w-14', pad: 'p-2', ring: 'gap-3.5' },
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
      {/* Crest badge — obsidian coin + gold ring; emblem pops in light & dark */}
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] ring-1 ring-gold/45 transition-[box-shadow,transform] duration-300 ease-luxe group-hover:ring-gold/80 group-hover:shadow-[0_0_18px_rgba(212,175,55,0.3)] ${s.badge} ${s.pad}`}
      >
        <img
          src={emblem}
          alt=""
          aria-hidden
          draggable={false}
          loading="eager"
          decoding="async"
          className="h-full w-full select-none object-contain"
        />
      </span>

      {/* Typographic wordmark */}
      <span className="inline-flex min-w-0 flex-col leading-none">
        <span
          className={`flex items-baseline gap-[0.28em] font-display font-black uppercase leading-none tracking-[0.01em] ${s.main}`}
        >
          <span className="text-ink">VAULT</span>
          <span className="text-gold transition-colors duration-300 group-hover:text-gold-soft">
            876
          </span>
        </span>
        <span className={`flex items-center gap-2 ${s.gap}`}>
          <span
            className={`whitespace-nowrap font-sans font-semibold uppercase tracking-[0.3em] text-ink/70 ${s.sub}`}
          >
            Hair&nbsp;&amp;&nbsp;Beauty
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/55" />
        </span>
      </span>
    </Link>
  )
}
