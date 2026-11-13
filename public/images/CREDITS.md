# Image provenance — VAULT 876

Placeholder editorial imagery, free to use commercially, standing in until the
salon supplies its own shoot. Replace before launch.

## Note on the originally-specified Unsplash URLs

The brief supplied exact Unsplash URLs, but on verification 6 of 7 showed the
**wrong subject** (the "hero/braids" URL is a blonde woman at the sea; "braids"
was a pink manicure; "locs" a blow-dry on straight hair; "lashes" an abstract
paint texture; "closeup" a blonde outdoor portrait). Using them would have
broken the brand. We kept the one correct URL and sourced on-brief replacements.

| File | Source | ID / URL | License | Subject |
|------|--------|----------|---------|---------|
| hero-braids.jpg | StockSnap | 3SSVDFKER2 | CC0 | Black woman, long braided extensions + lashes (hero) |
| work-wig.jpg | StockSnap | — | CC0 | Black woman, long wig/weave |
| work-lashes.jpg | StockSnap | — | CC0 | Black woman, lashes, short natural cut |
| work-colour.jpg | StockSnap | — | CC0 | Black woman, coloured bob |
| work-natural.jpg | StockSnap | — | CC0 | Black woman, short natural cut |
| work-afro.jpg | Unsplash | photo-1519699047748-de8e457a634e | Unsplash License | Black woman, afro studio portrait (the one correct supplied URL) |
| work-salon.jpg | StockSnap | — | CC0 | Salon interior |

Sourced via the Openverse API (api.openverse.org) and verified by eye. CC0
requires no attribution; this file is kept for the client's records.

## Moody Vogue rebuild — face-free crops

The redesign mandated **no human faces**. The three Unsplash URLs supplied with
that brief were verified and **rejected**: the "hero" (`photo-1605497788044`) was
a barbershop with two men's faces; one gallery URL (`photo-1522337660859`) was a
**pink manicure** (violates the no-pink ban); the other (`photo-1580618672591`)
was a blow-dry on straight European hair, off-brand. None shipped.

Instead, the following face-free crops were derived from the existing CC0
`hero-braids.jpg` and `work-salon.jpg` (verified by eye):

| File | Derived from | Subject |
|------|--------------|---------|
| hero-texture.jpg | hero-braids.jpg | Long braids over bodysuit, no face (hero) |
| work-braid-1.jpg | hero-braids.jpg | Braid over the shoulder |
| work-braid-2.jpg | hero-braids.jpg | Plait close-up (macro) |
| work-braid-3.jpg | hero-braids.jpg | Wide braids detail |
| work-chairs.jpg | work-salon.jpg | Salon chairs detail |

The face-containing originals (`work-wig/lashes/colour/natural`, the full
`hero-braids`) are **no longer referenced** by the site. Replace all crops with
the salon's own face-free editorial shoot before launch.

## Branded placeholders (current state)

The site no longer displays any stock photography. Every image slot (Hero,
Gallery, Visit the Salon) now renders the `ImagePlaceholder` component — a deep
obsidian panel with the gold medallion and a slow sheen — standing in until the
salon's own face-free editorial shoot lands. The derived crop files above are
kept on disk but unreferenced; drop in real photos to replace the placeholders.

## Logo

`src/assets/logo-optimized.png` is processed from the client's original
`src/assets/Vault Logo.png` with a Pillow script: pink neutralised, gold
contrast/saturation enhanced, **cropped tightly to the crossed-tools emblem**
(wordmark and the stray right-side sparkle removed), circular-masked to 1024×1024
with a completed gold rim — a solid medallion. Used in the navbar, entry gate,
footer and every image placeholder.
