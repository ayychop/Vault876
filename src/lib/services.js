// VAULT 876 service menu. Guide prices (GBP) are illustrative placeholders for
// the demo — confirm the real price list with the salon before launch.
// Each service carries a list of real styles the salon offers within it, so a
// client can tell us exactly what they want (and clients without locs can still
// pick a natural twist style). Style names are the terms used across UK Black
// hair salons — confirm the final list with the salon before launch.
export const services = [
  {
    slug: 'wig-installations',
    name: 'Wig installations',
    copy: 'Polished wig styling to help you step out feeling confident.',
    price: 65,
    duration: '2 hr',
    styles: ['Lace frontal', 'Lace closure', '360 install', 'Glueless install'],
  },
  {
    slug: 'relaxers',
    name: 'Relaxers',
    copy: 'Smooth, healthy relaxing for a sleek, manageable finish that lasts.',
    price: 45,
    duration: '1 hr 30',
    styles: ['Full relaxer', 'Regrowth retouch'],
  },
  {
    slug: 'braid-extensions',
    name: 'Braid extensions',
    copy: 'Neat, long-lasting braid extensions, styled to protect and flatter.',
    price: 90,
    duration: '3 hr',
    styles: [
      'Knotless braids',
      'Box braids',
      'Cornrows',
      'Feed-in braids',
      'Fulani braids',
      'Ghana braids',
      'Boho braids',
      'Passion twists',
    ],
  },
  {
    slug: 'kids-hair-braiding',
    name: 'Kids hair braid',
    copy: 'Gentle, patient braiding for little ones, with styles they will love.',
    price: 35,
    duration: '1 hr 30',
    styles: ['Cornrows', 'Box braids', 'Twists', 'Beads & cuffs'],
  },
  {
    slug: 'eyelash-extensions',
    name: 'Eyelash extensions',
    copy: 'Full, flattering lashes that open up and lift the whole look.',
    price: 45,
    duration: '1 hr 30',
    styles: ['Classic', 'Hybrid', 'Volume', 'Mega volume'],
  },
  {
    slug: 'locs',
    name: 'Locs',
    copy: 'Expert loc starting, retwisting and styling, cared for with real attention.',
    price: 70,
    duration: '2 hr 30',
    styles: [
      'Starter locs',
      'Retwist & maintenance',
      'Interlocking',
      'Barrel twists',
      'Faux locs',
      'Two-strand twists',
      'Bantu knots',
      'Twist-out',
    ],
  },
]

export const gbp = (n) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(n)
