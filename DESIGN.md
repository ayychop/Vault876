---
name: VAULT 876
description: A hair and beauty salon rendered as a luxury fashion house — obsidian, gold, and editorial restraint.
colors:
  obsidian: "#0A0A0A"
  obsidian-raised: "#121212"
  obsidian-line: "#1F1F1F"
  white: "#FFFFFF"
  paper: "#F5F4F1"
  gold: "#D4AF37"
  gold-soft: "#E7CC6E"
  gold-deep: "#A8862A"
  amber-limited: "#FBBF24"
typography:
  logo:
    fontFamily: '"Bodoni Moda", "Playfair Display", Georgia, serif'
    fontWeight: 900
    opticalSize: 96
    letterSpacing: "-0.02em"
    note: "VAULT 876 navbar wordmark only. Extreme-contrast Didone cloning the client's logo lettering; paired with a pixel-traced 'VA' ligature (src/assets/logo-va.png) masked in currentColor, followed by live 'ULT 876' text."
  display:
    fontFamily: '"Playfair Display", Georgia, serif'
    fontSize: "clamp(2.9rem, 9.5vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.055em"
  headline:
    fontFamily: '"Playfair Display", Georgia, serif'
    fontSize: "clamp(1.85rem, 4.2vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  accent:
    fontFamily: "Montserrat, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 3.8vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.22em"
rounded:
  sm: "2px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  gutter: "20px"
  gutter-lg: "32px"
  card: "20px"
  section: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-primary-disabled:
    backgroundColor: "{colors.obsidian-line}"
    textColor: "{colors.gold-deep}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-ghost:
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  chip:
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  chip-selected:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card-service:
    backgroundColor: "{colors.obsidian-raised}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.obsidian-raised}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
---

# Design System: VAULT 876

## Overview

**Creative North Star: "The Obsidian Vault"**

VAULT 876 is a hair and beauty salon rendered as a luxury fashion house. The system treats a near-empty matte-obsidian ground as the primary material and negative space as the real luxury — the way a Vogue cover or a Céline campaign lets one confident gesture carry the page. Onto that quiet dark it lays crisp white type, a single precious metal (gold), and a warm high-contrast serif, then warms the restraint with cultural swagger: poster-weight uppercase service names, a slow gold gleam, a drifting ambient aura. The register is "Apple makes a Black urban hair and beauty salon" — editorial elegance plus Apple-grade smoothness plus unapologetic confidence.

The surface is deliberately atmospheric rather than flat-digital: a fixed filmic grain veil, a faint screen-blended gold aura that drifts behind everything, and branded medallion panels that stand in for photography. Density is low and rhythmic — large type, generous gutters, hairline gold/white dividers doing the structural work instead of boxes and fills. Motion is the connective tissue: one house spring and one exponential ease-out curve carry every reveal, so the whole site shares a single slow, assured cadence that settles without ever bouncing like a cartoon.

The one thing the world refuses is the category default: the cluttered promo flyer, the service laundry-list, same-size icon cards, and above all the incumbent's hot-pink "glam" accent. Pink is banned outright. Gold is rationed. The brand must read premium before it reads "salon."

**Key Characteristics:**
- Matte-obsidian ground (#0A0A0A) held nearly empty; negative space is the primary material.
- A single precious metal — gold (#D4AF37) — on actions, hairlines, and active states only.
- Editorial type contrast: Playfair Display serif + Montserrat ExtraBold poster caps + Inter UI.
- One house motion identity (a spring + an ease-out curve) across every surface.
- Branded medallion placeholders instead of stock photography; no human faces.
- Dark by default, with an optional light theme; gold holds unchanged in both.

## Colors

A monochrome obsidian-and-white ground carrying one warm metallic accent; everything else is an alpha tint of the foreground ink.

### Primary
- **Metallic Gold** (`#D4AF37`): The only accent. Reserved for primary actions, hairline dividers, active/selected states, the scroll-progress thread, link underlines, focus rings, caret and selection — and the sanctioned ambient aura. It is the precious metal of the brand, not a decorative wash.
- **Lit Gold** (`#E7CC6E`): The lit top edge of the metal — the first stop of the gold button gradient, the hover state of the "876" numeral, and the glowing node on the scroll thread.
- **Shadow Gold** (`#A8862A`): The shadow side of the metal, for the deep base of gradients and disabled-gold text.

### Neutral
- **Matte Obsidian** (`#0A0A0A`): The dark-theme ground and the ink of light-theme type. A calm, expensive dark room — never pure #000.
- **Raised Obsidian** (`#121212`): Slightly lifted panels on the black ground (cards, inputs, the light-theme is mirrored by `paper`).
- **Obsidian Line** (`#1F1F1F`): Hairline dividers on the dark ground.
- **Crisp White** (`#FFFFFF`): Dark-theme type and the light-theme ground.
- **Warm Paper** (`#F5F4F1`): The faint warm panel surface in the light theme.

### Tertiary (functional only)
- **Limited Amber** (`#FBBF24`, shipped at ~80% alpha): A single functional status signal — the "Limited" availability dot in the booking time-picker. It is a traffic-light state indicator (open=gold, limited=amber, full=ink/25), never a brand accent, and never appears outside availability affordances.

### Named Rules
**The One Metal Rule.** Gold stays precise on UI — primary actions, hairline accents, active states — and is never poured as a glow or gradient wash across chrome or content. The single sanctioned exception is one faint, slow-drifting, screen-blended ambient aura in the obsidian ground (depth, not decoration). The primary action button is the second deliberate exception: it is rendered as actual metal (a light-to-shadow gold gradient with a warm lift), because gold *is* the brand's material.

**The No-Pink Rule.** No pink, ever, in any tint or state. The incumbent's hot-pink "glam" accent is the specific thing this identity removes; a pink value anywhere is a brand defect, not a variation.

**The Semantic-Invert Rule.** `canvas`, `ink`, and `surface` are theme-aware tokens (CSS vars `--canvas` / `--ink` / `--surface`) that invert between the default dark theme and the optional light theme. Gold and its two edges do not invert — they hold identically in both.

## Typography

**Wordmark Font:** Bodoni Moda (with Playfair Display, Georgia, serif) — weight 900 at optical size 96. **Used only for the VAULT 876 navbar lockup**, where its extreme Didone contrast clones the client's logo lettering.
**Display Font:** Playfair Display (with Georgia, serif) — weights 400–900, italic available.
**Accent Font:** Montserrat (with Inter, system-ui) — ExtraBold/Black, uppercase.
**Body / UI Font:** Inter (with system-ui, -apple-system) — weights 300–600.

**Character:** An editorial contrast of registers — a warm, high-contrast Didone serif for the expensive voice, a heavy ATL-poster sans shouting the service names, and a quiet geometric sans for everything functional. The serif carries warmth and couture; the poster caps carry swagger; Inter stays out of the way. The wordmark stands apart in a sharper Didone (Bodoni Moda) because it is a literal clone of the salon's logo, not body voice.

### Hierarchy
- **Wordmark** (Bodoni Moda 900, optical size 96, uppercase, tracking −0.02em): The VAULT 876 navbar lockup only. "VAULT" is theme-aware (`currentColor`), "876" is gold. The leading **"VA" is a pixel-traced ligature** of the client's own logo — her V-swash overlapping the A exactly as drawn (`src/assets/logo-va.png`) — applied as a `currentColor` mask so it flips with the theme and glows with the breathing gold bloom; "ULT 876" follows as live Bodoni text, baseline- and cap-aligned to the ligature. Below it, "HAIR & BEAUTY" runs as a tiny wide-tracked Inter caps line flanked by gold hairlines.
- **Display** (Playfair Display 900, `clamp(2.9rem, 9.5vw, 7.5rem)`, line-height 0.9, tracking −0.055em): Hero and page-opening headlines. Set very tight and very large, often with a single word italicized at medium weight and the terminal period in gold.
- **Headline** (Playfair Display 600, `clamp(1.85rem, 4.2vw, 3rem)`, line-height 1.04, tracking −0.045em): Section and booking-step titles ("The Menu", "Choose your services").
- **Accent / Service Name** (Montserrat 800, `clamp(1.4rem, 3.8vw, 2.4rem)`, uppercase, line-height 0.95): The six service names in the editorial row-list. Poster-weight, warms to gold on hover. Uses the client's exact names — never rewritten.
- **Body** (Inter 400, ~1rem / 0.95rem, line-height ~1.6): Copy, captions, field text. Secondary copy runs at `ink/50`–`ink/60`; max measure ~68ch.
- **Label** (Inter 500, 0.72rem, tracking 0.22em, uppercase): The couture label voice — section overlines, field group labels, image overlines, and small uppercase tracked captions (hero subhead rides wider, up to 0.42em).

### Named Rules
**The Client's-Words Rule.** Service names render in the salon's exact flyer terminology (Wig installations, Relaxers, Braid extensions, Kids hair braid, Eyelash extensions, Locs). Never creatively rewrite a service name, even for consistency.

**The Overline-Not-Kicker Rule.** Wide-tracked uppercase caps are a label/caption voice — field labels, image overlines, status overlines — not a decorative eyebrow stacked above a headline. Headlines open sections directly; they are not preceded by invented kickers.

## Layout

A centered single-column editorial model over a full-bleed hero. Containers are role-sized: the hero spans `100svh` full-bleed; sections center on `max-w-5xl` (services) / `max-w-4xl` (booking); the navbar spans `max-w-7xl`. Horizontal gutters are a consistent `px-5` (20px) stepping up to `sm:px-8` (32px). Vertical rhythm is generous — sections breathe on `pt`/`pb` in the 7rem–9rem range (`pb-28`/`pb-36`).

Structure is carried by hairline dividers, not containers: the service menu is a bordered row-list (`border-ink/12` top and between rows), not a grid of cards. The booking flow is mobile-first — a single column that becomes two on `sm:` for service cards and detail fields, with a horizontally scrolling day-strip. Fixed furniture (navbar, sticky price bar, mobile Book Now bar, scroll thread) sits on `z-30`–`z-50`, with the entry gate above all on `z-[100]`. Smooth inertial scrolling is provided by Lenis, disabled under reduced-motion.

## Elevation & Depth

Primarily a flat, tonal-layering system: depth comes from obsidian tonal steps (ground → `#121212` raised panel), hairline rings, and atmosphere (grain, aura, vignette) rather than from a shadow stack. Shadows appear almost exclusively as warm gold-tinted *glows* tied to state and to the gold metal — never as neutral drop shadows for structure, and never as hard offset shadows.

### Shadow Vocabulary
- **Gold metal lift** (`box-shadow: 0 1px 0 rgba(255,255,255,0.35) inset, 0 10px 30px -12px rgba(212,175,55,0.5)`): The resting shadow of the primary gold button — an inset top highlight plus a soft gold cast, so the button reads as lit metal. Deepens on hover.
- **Gold hover bloom** (`0 26px 70px -30px rgba(212,175,55,0.6)` on rows; `0 18px 50px -18px rgba(212,175,55,0.55)` on ghost/call): A large, very soft gold glow that blooms under an element on hover.
- **Section lift** (`0 24px 60px -24px rgba(0,0,0,0.85)`, token `shadow-lift`): The one neutral structural shadow, for deeply lifted panels.
- **Thread node glow** (`0 0 10px 2px rgba(212,175,55,0.7)`): The small gold halo on the scroll-progress node.

### Named Rules
**The Glow-Not-Drop Rule.** Elevation on interactive elements is expressed as a soft gold bloom that responds to hover/active, not as a neutral grey drop shadow and never as a hard offset shadow. Surfaces are calm at rest; the metal lights up on interaction.

## Shapes

A soft, rounded, couture-jewellery form language. Pills dominate: every button, chip, status dot, and the step-indicator nodes are fully round (`rounded-full`). Panels and cards use a generous 16px radius (`rounded-2xl`), inputs and time slots a 12px radius (`rounded-xl`), and focus rings a tight 2px. The signature silhouette is the circle — the gold medallion crest recurs at every scale (navbar 40px, footer, every image placeholder, the 232px entry-gate button) in a circular container with a baked gold rim. Borders are hairline (1px) and low-contrast — `ink/12` dividers, `ink/15`–`ink/22` outlines, inset `ring-white/10` frames on placeholders — warming to gold on hover/active. No hard geometric corners, no heavy outlines.

## Components

### Buttons
- **Shape:** Fully round pills (`rounded-full`), base padding 14px/28px (`px-7 py-3.5`); scales up in the hero (48px/20px) and down in the navbar (24px/10px).
- **Primary (`.btn-gold`):** Rendered as real metal — a vertical gradient `#E7CC6E → #D4AF37 → #BF9C2E` with an inset top highlight and a soft gold lift, obsidian text, semibold. Gold text stays obsidian and the metal holds in both themes.
- **Hover / Active:** Hover lifts (`translateY(-2px) scale(1.035)`) and deepens the gold bloom on the house ease-out curve; active settles to `scale(0.99)`.
- **Disabled:** Flat — gold gradient and glow drop entirely to a muted `ink/10` fill with `ink/40` text, reading as plainly inert rather than muddy gold. (The booking sticky bar's Continue/Confirm is disabled until the step is valid.)
- **Ghost (`.btn-ghost`):** Hairline outline in current ink (`ink/22`) that warms to gold (`gold/70` border, faint `gold/6` fill) on hover; used for secondary actions like "Call Salon" / "Back to site".

### Chips
- **Style:** Round pills (`rounded-full`, 6px/12px), hairline `ink/20` border, `ink/65` text, medium weight. Optional per-service style selectors in booking.
- **State:** Selected fills solid gold with obsidian text; unselected warms its border and text toward gold on hover. Re-tapping an active chip clears it.

### Cards / Containers
- **Corner Style:** 16px radius (`rounded-2xl`).
- **Background:** `surface` (raised obsidian `#121212` dark / warm paper light).
- **Shadow Strategy:** Flat at rest; a gold hover bloom appears on interactive cards (see Elevation).
- **Border:** Hairline `ink/12`, warming to `gold/50` on hover and to solid `gold` with a `gold/6` fill when selected.
- **Internal Padding:** 20px (`p-5`).

### Inputs / Fields
- **Style:** `surface` fill, hairline `ink/15` border, 12px radius (`rounded-xl`), 14px/16px padding, `ink` text with `ink/50` placeholders.
- **Focus:** Border shifts to `gold/70`, native outline removed; the global focus-visible ring is a 2px gold outline with 3px offset. Caret and text selection are gold.
- **Special:** A dashed-border file drop ("Inspiration photo") with a gold camera glyph, warming its border to gold on hover.

### Navigation
- **Style:** Fixed top bar, transparent over the hero with a top legibility scrim, transitioning to glass (`bg-canvas/70 backdrop-blur-xl`, hairline bottom border) once scrolled past 24px.
- **Typography / States:** Inter medium links at `ink/70`, warming to full ink with a gold underline that wipes in left-to-right on hover. A persistent gold "Book Now" button and theme toggle sit at the right.
- **Mobile:** Links collapse to a hamburger opening a full-screen `canvas` sheet with large Playfair links staggering in; a persistent full-width gold "Book Now" bar is pinned to the bottom of the viewport site-wide (hidden only inside the booking flow, which carries its own sticky price bar).

### Branded Image Placeholder (signature)
A deep obsidian panel standing in for photography until the salon's own face-free editorial shoot lands: a faint gold center bloom, a hairline diagonal weave so it is never a flat void, a slow diagonal gold/white sheen sweep, the centered gold medallion crest (as a glowing mark or a 16%-opacity watermark), and an inset `ring-white/10` hairline frame. Optional gold uppercase overline + Playfair caption anchor the bottom-left.

### Service Row (signature)
The menu is an editorial hairline-divided row-list, not a card grid. Each row: poster-weight Montserrat uppercase name (warms to gold on hover) + Playfair "from £" price in gold + body copy with duration, an arrow that drifts up-right on hover, and a gold "gleam" that sweeps diagonally across the row on hover (screen-blended, one 0.85s pass). The whole row lifts slightly with a gold hover bloom. Links straight into the booking flow.

### Scroll Thread (signature)
A fixed 1px hairline on the right edge (desktop only) over `ink/10`, filling top-to-bottom with a `gold-soft → gold → gold/30` gradient as the page scrolls, led by a small glowing gold node. Spring-smoothed.

## Do's and Don'ts

### Do:
- **Do** keep gold rationed — primary actions, hairline accents, active/selected states, and the one sanctioned ambient aura. Render the primary button as actual metal (the gold gradient + lift).
- **Do** hold the obsidian ground nearly empty; let negative space and hairline dividers carry structure instead of boxes and fills.
- **Do** carry the house motion identity everywhere: the spring (`stiffness 52, damping 15, mass 1.05`) for lifts and the ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for fades/clip/color — slow, smooth, a touch of swagger, never a cartoon bounce. Honor `prefers-reduced-motion`.
- **Do** set service names in Montserrat ExtraBold uppercase using the client's exact words, with the metallic serif ("Playfair") for display and Inter for UI.
- **Do** use the branded medallion placeholder for any empty image slot; keep imagery face-free until the salon's own shoot lands.
- **Do** express interactive depth as a soft gold bloom responding to hover/active.

### Don't:
- **Don't** use pink in any tint, state, or gradient — anywhere. (The one specific thing this identity removes.)
- **Don't** pour gold as a glow or gradient wash across chrome or content; only the ambient aura and the metal button are sanctioned gold fields.
- **Don't** use neutral grey drop shadows or hard offset shadows for structure; surfaces are flat at rest and lit gold on interaction.
- **Don't** render the menu as a grid of same-size icon cards or a plain laundry-list — it is an editorial hairline row-list.
- **Don't** stack an invented uppercase kicker/eyebrow above a headline; the tracked caps are a label/caption voice only.
- **Don't** ship a dead primary button; disabled state must read plainly inert, and every CTA must be live (book or call).
