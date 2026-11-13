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
  // Social handles not yet confirmed by the salon — placeholders to replace.
  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
  },
}

export const addressOneLine = `${site.address.line1}, ${site.address.line2}, ${site.address.city} ${site.address.postcode}`
