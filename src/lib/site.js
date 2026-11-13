// Single source of truth for VAULT 876 business details.
// Confirmed, client-supplied facts — safe to render anywhere.
export const site = {
  name: 'VAULT 876',
  website: 'vault876.com',
  phoneDisplay: '+44 7534 950056',
  phoneHref: 'tel:+447534950056',
  address: {
    line1: 'Unit B, Bakers Mews',
    line2: 'Buckingham Street',
    city: 'Aylesbury',
    postcode: 'HP20 2GN',
  },
  directionsHref:
    'https://maps.google.com/?q=Unit+B,+Bakers+Mews,+Buckingham+Street,+Aylesbury+HP20+2GN',
  // Embeddable Google Map for the salon address (no API key required).
  mapEmbedSrc:
    'https://www.google.com/maps?q=Unit+B,+Bakers+Mews,+Buckingham+Street,+Aylesbury+HP20+2GN&output=embed',
  // PLACEHOLDER opening hours — confirm the real schedule with the salon before
  // launch. Sunday closed is consistent with the booking flow (skips Sundays).
  hours: [
    { day: 'Mon – Fri', open: '9:00 — 19:00' },
    { day: 'Saturday', open: '9:00 — 18:00' },
    { day: 'Sunday', open: 'Closed', closed: true },
  ],
  // Social handles not yet confirmed by the salon — placeholders to replace.
  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
  },
}

export const addressOneLine = `${site.address.line1}, ${site.address.line2}, ${site.address.city} ${site.address.postcode}`
