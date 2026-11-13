// Resend email delivery + branded VAULT 876 templates.
// Requires the RESEND_API_KEY secret and a verified FROM_EMAIL domain.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'VAULT 876 <bookings@boanetworks.com>'
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? 'info@boanetworks.com'
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://vault876.boanetworks.com').replace(/\/$/, '')
const SALON_PHONE = Deno.env.get('SALON_PHONE') ?? '+44 7534 950056'

export interface BookingLine {
  service: string
  style: string | null
  price: number
}

export interface BookingSummary {
  clientName: string
  clientEmail: string | null
  clientPhone: string
  date: string | null // YYYY-MM-DD
  time: string | null
  lines: BookingLine[]
  total: number
  depositPaid: number // in GBP
}

const gbp = (n: number) => `£${Number(n).toLocaleString('en-GB')}`

function prettyDate(iso: string | null): string {
  if (!iso) return 'To be confirmed'
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

async function send(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping send to', to)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) {
    console.error('[email] Resend error', res.status, await res.text())
  }
}

function linesTable(lines: BookingLine[], total: number): string {
  const rows = lines
    .map(
      (l) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #26231c;color:#e8e3d8;font-size:15px">
          ${l.service}${l.style ? ` <span style="color:#9a9488">— ${l.style}</span>` : ''}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #26231c;color:#d4af37;text-align:right;font-size:15px;white-space:nowrap">
          ${gbp(l.price)}
        </td>
      </tr>`,
    )
    .join('')
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0">
      ${rows}
      <tr>
        <td style="padding:14px 0 0;color:#9a9488;font-size:13px;text-transform:uppercase;letter-spacing:2px">Estimated total</td>
        <td style="padding:14px 0 0;color:#ffffff;text-align:right;font-size:18px;font-weight:700">${gbp(total)}</td>
      </tr>
    </table>`
}

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0a0a0a;font-family:Georgia,'Times New Roman',serif">
    <div style="max-width:560px;margin:0 auto;padding:40px 28px">
      <div style="text-align:center;padding-bottom:8px">
        <span style="font-size:26px;font-weight:800;letter-spacing:1px;color:#ffffff">VAULT <span style="color:#d4af37">876</span></span>
        <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8a857a;margin-top:4px">Hair &amp; Beauty · Aylesbury</div>
      </div>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:22px 0"></div>
      ${inner}
      <div style="height:1px;background:#26231c;margin:28px 0 16px"></div>
      <div style="font-family:Arial,sans-serif;font-size:12px;color:#6f6a60;text-align:center;line-height:1.7">
        VAULT 876 Hair &amp; Beauty · Unit B, Bakers Mews, Buckingham Street, Aylesbury HP20 2GN<br>
        Call the salon: ${SALON_PHONE}
      </div>
    </div>
  </body></html>`
}

export async function sendClientConfirmation(b: BookingSummary) {
  if (!b.clientEmail) return
  const inner = `
    <p style="color:#ffffff;font-size:22px;margin:0 0 6px">You're booked in, ${b.clientName.split(' ')[0]}.</p>
    <p style="color:#b8b2a6;font-size:15px;line-height:1.6;margin:0">
      Your appointment at VAULT 876 is confirmed. Here are the details — we can't wait to see you.
    </p>
    <div style="background:#141210;border:1px solid #26231c;border-radius:14px;padding:20px 22px;margin:22px 0">
      <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a857a">When</div>
      <div style="color:#ffffff;font-size:18px;margin-top:4px">${prettyDate(b.date)}${b.time ? ` · ${b.time}` : ''}</div>
      ${linesTable(b.lines, b.total)}
      <div style="font-family:Arial,sans-serif;font-size:12px;color:#8a857a">
        Deposit paid: <span style="color:#d4af37">${gbp(b.depositPaid)}</span> · balance due in the salon.
      </div>
    </div>
    <div style="text-align:center;margin:26px 0 8px">
      <a href="tel:${SALON_PHONE.replace(/\s+/g, '')}" style="display:inline-block;background:#d4af37;color:#0a0a0a;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;font-size:14px;padding:13px 26px;border-radius:999px">
        Call the salon: ${SALON_PHONE}
      </a>
    </div>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#6f6a60;text-align:center;margin:6px 0 0">
      Need to reschedule or cancel? Just give us a call and we'll sort it.
    </p>`
  await send(b.clientEmail, 'Your VAULT 876 appointment is confirmed', shell(inner))
}

export async function sendOwnerNotification(b: BookingSummary) {
  const inner = `
    <p style="color:#ffffff;font-size:22px;margin:0 0 6px">New booking — deposit paid ✅</p>
    <div style="background:#141210;border:1px solid #26231c;border-radius:14px;padding:20px 22px;margin:18px 0">
      <div style="color:#ffffff;font-size:18px">${b.clientName}</div>
      <div style="font-family:Arial,sans-serif;font-size:13px;color:#b8b2a6;margin-top:4px">
        ${b.clientPhone}${b.clientEmail ? ` · ${b.clientEmail}` : ''}
      </div>
      <div style="height:1px;background:#26231c;margin:14px 0"></div>
      <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a857a">When</div>
      <div style="color:#ffffff;font-size:17px;margin-top:4px">${prettyDate(b.date)}${b.time ? ` · ${b.time}` : ''}</div>
      ${linesTable(b.lines, b.total)}
    </div>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#8a857a;margin:0">
      View everything in your <a href="${SITE_URL}/admin" style="color:#d4af37">owner portal</a>.
    </p>`
  await send(OWNER_EMAIL, `New booking · ${b.clientName} · ${prettyDate(b.date)}`, shell(inner))
}
