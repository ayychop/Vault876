// Mock booking records for the Admin portal preview. Replace with Supabase
// data once wired. Prices in GBP; dates ISO (YYYY-MM-DD). Service names match
// the salon's exact menu (see services.js). paymentType is 'deposit' | 'full'
// | null (unpaid); amountPaid is what was taken online in GBP.
export const bookings = [
  { id: 'VB-1042', date: '2026-11-16', client: 'Amara Johnson', service: 'Braid extensions', style: 'Knotless braids', price: 90, status: 'Confirmed', paymentType: 'full', amountPaid: 90 },
  { id: 'VB-1041', date: '2026-11-15', client: 'Danielle Roberts', service: 'Kids hair braid', style: 'Cornrows', price: 35, status: 'Confirmed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1040', date: '2026-11-14', client: 'Simone Clarke', service: 'Wig installations', style: 'Lace frontal', price: 65, status: 'Pending', paymentType: null, amountPaid: null },
  { id: 'VB-1039', date: '2026-11-12', client: 'Marcus Bennett', service: 'Locs', style: 'Retwist & maintenance', price: 70, status: 'Completed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1038', date: '2026-11-11', client: 'Priya Shah', service: 'Eyelash extensions', style: 'Hybrid set', price: 45, status: 'Completed', paymentType: 'full', amountPaid: 45 },
  { id: 'VB-1037', date: '2026-11-10', client: 'Chloe Adams', service: 'Relaxers', style: null, price: 45, status: 'Completed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1036', date: '2026-11-08', client: 'Nadia Hussain', service: 'Braid extensions', style: 'Box braids', price: 90, status: 'Completed', paymentType: 'full', amountPaid: 90 },
  { id: 'VB-1035', date: '2026-11-07', client: 'Leah Thompson', service: 'Wig installations', style: 'Closure install', price: 65, status: 'Completed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1034', date: '2026-11-05', client: 'Ava Mitchell', service: 'Eyelash extensions', style: 'Classic set', price: 45, status: 'Completed', paymentType: 'full', amountPaid: 45 },
  { id: 'VB-1033', date: '2026-11-04', client: 'Jasmine Reid', service: 'Locs', style: 'Starter locs', price: 70, status: 'Completed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1032', date: '2026-11-02', client: 'Olivia Grant', service: 'Braid extensions', style: 'Feed-in braids', price: 90, status: 'Completed', paymentType: 'full', amountPaid: 90 },
  { id: 'VB-1031', date: '2026-10-31', client: 'Tanya Oyelaran', service: 'Kids hair braid', style: 'Beaded braids', price: 35, status: 'Completed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1030', date: '2026-10-29', client: 'Grace Okafor', service: 'Relaxers', style: null, price: 45, status: 'Completed', paymentType: 'full', amountPaid: 45 },
  { id: 'VB-1029', date: '2026-10-27', client: 'Mariah Lewis', service: 'Wig installations', style: '360 frontal', price: 65, status: 'Completed', paymentType: 'deposit', amountPaid: 20 },
  { id: 'VB-1028', date: '2026-11-20', client: 'Ella Dawson', service: 'Locs', style: 'Interlocking', price: 70, status: 'Pending', paymentType: null, amountPaid: null },
]
