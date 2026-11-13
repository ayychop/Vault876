// House icon set — drawn SVG, one consistent 1.5 stroke, gold via currentColor.
// No emoji or unicode stand-ins; these are the only marks on the page.

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// --- Promise marks ---

export function IconQuality(props) {
  // A hallmark seal — assay-stamp diamond
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5l2.6 2.1 3.3-.3.9 3.2 2.7 1.9-1.3 3 1.3 3-2.7 1.9-.9 3.2-3.3-.3L12 21.5l-2.6-2.1-3.3.3-.9-3.2L2.5 14.5l1.3-3-1.3-3 2.7-1.9.9-3.2 3.3.3z" />
      <path d="M9.2 12.2l2 2 3.6-4" />
    </svg>
  )
}

export function IconHealthyHair(props) {
  // A single strand / leaf — vitality
  return (
    <svg {...base} {...props}>
      <path d="M6 21c0-7 3.5-12.5 12-15-1.5 8.5-6 13-12 13z" />
      <path d="M6 21c1.8-4.2 4.6-7 8.5-8.6" />
    </svg>
  )
}

export function IconConfidence(props) {
  // A rising spark
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5l1.9 5.1 5.1 1.9-5.1 1.9L12 16.5l-1.9-5.1L5 9.5l5.1-1.9z" />
      <path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </svg>
  )
}

export function IconPremium(props) {
  // An apothecary bottle — premium product
  return (
    <svg {...base} {...props}>
      <path d="M10 2.5h4" />
      <path d="M10.5 2.5v3.2c0 .5-.2 1-.6 1.4L8 9.2A3 3 0 007 11.3V19a2.5 2.5 0 002.5 2.5h5A2.5 2.5 0 0017 19v-7.7a3 3 0 00-1-2.1l-1.9-2.1a2 2 0 01-.6-1.4V2.5" />
      <path d="M7 13.5h10" />
    </svg>
  )
}

// --- Social marks ---

export function IconInstagram(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconFacebook(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 8.5h2V5.4A14 14 0 0014 5.3c-2.2 0-3.6 1.3-3.6 3.8V11H7.8v3h2.6v7h3.1v-7h2.5l.4-3h-2.9V9.3c0-.6.3-.8 1-.8z" />
    </svg>
  )
}

export function IconTiktok(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 3.5c.3 2.3 1.7 3.9 4 4.2v2.8c-1.5.1-2.9-.4-4-1.2v5.9a5.3 5.3 0 11-5.3-5.3c.3 0 .6 0 .9.1v2.9a2.5 2.5 0 101.8 2.4V3.5z" />
    </svg>
  )
}

// --- UI marks ---

export function IconArrowUpRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

export function IconPhone(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A15.5 15.5 0 014.5 5.7 2 2 0 016.5 3.5z" />
    </svg>
  )
}

export function IconPin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s6-5.3 6-10a6 6 0 10-12 0c0 4.7 6 10 6 10z" />
      <circle cx="12" cy="11" r="2.3" />
    </svg>
  )
}

export function IconComb(props) {
  // Styling comb — drawn to sit beside Lucide Scissors/Sparkles at matching weight
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7.5h17" />
      <path d="M5.5 7.5V16M8.5 7.5V16M11.5 7.5V16M14.5 7.5V16M17.5 7.5V16" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
