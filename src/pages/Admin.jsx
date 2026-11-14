import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Printer, ArrowLeft, RefreshCw, LogOut, Wand2, ArrowRight } from 'lucide-react'
import Wordmark from '../components/Wordmark.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import AdminLogin from '../components/AdminLogin.jsx'
import { bookings as demoBookings } from '../lib/adminData.js'
import { supabase } from '../lib/supabase.js'

// The website editor (and its image-cropping dependency) only ever runs here in
// the owner portal, so load it on demand to keep the public site's bundle light.
const EditWebsite = lazy(() => import('../components/admin/EditWebsite.jsx'))

// Map a live Supabase bookings row into the shape the dashboard renders.
const mapRow = (r) => ({
  id: r.ref || r.id,
  date: r.appointment_date || (r.created_at ? String(r.created_at).slice(0, 10) : ''),
  client: r.client_name || '—',
  service: r.service || '—',
  style: r.style || null,
  price: Number(r.price) || 0,
  status: r.status || 'Pending',
  paymentType: r.payment_type || null, // 'deposit' | 'full' | null (unpaid)
  amountPaid: r.amount_paid != null ? Number(r.amount_paid) : null,
})

const EASE = [0.16, 1, 0.3, 1]
const gbp = (n) => `£${n.toLocaleString('en-GB')}`
const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const STATUS_STYLES = {
  Confirmed: 'border-gold/40 bg-gold/10 text-gold',
  Pending: 'border-ink/20 bg-ink/[0.04] text-ink/60',
  'Awaiting Payment': 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Completed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const PAYMENT_STYLES = {
  full: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  deposit: 'border-gold/40 bg-gold/10 text-gold',
  unpaid: 'border-ink/20 bg-ink/[0.04] text-ink/50',
}

// How a booking's payment reads in the portal + exports.
const paymentLabel = (b) =>
  b.paymentType === 'full' ? 'Paid in full' : b.paymentType === 'deposit' ? 'Deposit' : 'Unpaid'

// CSV field escaping — quote anything with a comma, quote or newline.
const csv = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function Admin() {
  const [query, setQuery] = useState('')
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [editing, setEditing] = useState(false)

  const load = async () => {
    setLoading(true)
    setLoadError('')

    // Dev fallback: no backend configured → show the demo rows so the page works.
    if (!supabase) {
      setBookings(demoBookings)
      setServices([])
      setPayments([])
      setLoading(false)
      return
    }

    // Make sure a valid session is in place BEFORE fetching. supabase-js attaches
    // this session's JWT to every request automatically, so Postgres sees the
    // request as the `authenticated` role.
    const {
      data: { session: live },
    } = await supabase.auth.getSession()

    if (!live) {
      setLoadError('Your session has expired — please sign in again.')
      setBookings([])
      setServices([])
      setPayments([])
      setLoading(false)
      return
    }

    // Confirm the DB role the request will run as (should log "authenticated").
    try {
      const claims = JSON.parse(atob(live.access_token.split('.')[1]))
      // eslint-disable-next-line no-console
      console.log(
        `[VAULT876] Supabase auth role before fetch: "${claims.role}" · user: ${live.user?.email}`,
      )
    } catch {
      /* token decode is best-effort for logging only */
    }

    const [bk, sv, pm] = await Promise.all([
      supabase
        .from('bookings')
        .select('*')
        .order('appointment_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order', { ascending: true }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
    ])

    if (bk.error) {
      setLoadError(bk.error.message)
      setBookings([])
    } else {
      setBookings((bk.data || []).map(mapRow))
    }
    setServices(sv.data || [])
    // The payments table only exists once phase7.sql has run; ignore its error
    // so the dashboard still loads everything else.
    setPayments(pm.error ? [] : pm.data || [])
    setLoading(false)
  }

  // Track the Supabase auth session — the owner portal requires sign-in.
  useEffect(() => {
    if (!supabase) {
      setAuthReady(true)
      return
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Load data for the right viewer: demo rows without a backend, live rows for a
  // signed-in admin, nothing when signed out.
  useEffect(() => {
    if (!supabase) {
      load()
      return
    }
    if (session) load()
    else {
      setBookings([])
      setServices([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const signOut = () => supabase?.auth.signOut()

  const sorted = useMemo(
    () => [...bookings].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [bookings],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter(
      (b) =>
        b.client.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        (b.style || '').toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q),
    )
  }, [query, sorted])

  const kpis = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const totalRevenue = bookings
      .filter((b) => b.status !== 'Pending')
      .reduce((sum, b) => sum + b.price, 0)
    const upcoming = bookings.filter(
      (b) => b.date >= today && b.status !== 'Completed',
    ).length
    const avg = Math.round(
      bookings.reduce((s, b) => s + b.price, 0) / bookings.length,
    )
    return {
      total: bookings.length,
      revenue: totalRevenue,
      upcoming,
      avg: Number.isFinite(avg) ? avg : 0,
    }
  }, [bookings])

  const exportCSV = () => {
    const header = [
      'Booking ID', 'Date', 'Client', 'Service', 'Price (GBP)', 'Payment', 'Amount Paid (GBP)', 'Status',
    ]
    const lines = [header.join(',')]
    let total = 0
    let totalPaid = 0
    sorted.forEach((b) => {
      total += b.price
      totalPaid += b.amountPaid || 0
      const service = b.style ? `${b.service} — ${b.style}` : b.service
      const paid = b.amountPaid != null ? b.amountPaid.toFixed(2) : ''
      lines.push(
        [
          csv(b.id), b.date, csv(b.client), csv(service),
          b.price.toFixed(2), paymentLabel(b), paid, b.status,
        ].join(','),
      )
    })
    lines.push(['', '', '', 'Total', total.toFixed(2), '', totalPaid.toFixed(2), ''].join(','))

    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vault876-bookings-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    const total = sorted.reduce((s, b) => s + b.price, 0)
    const totalPaid = sorted.reduce((s, b) => s + (b.amountPaid || 0), 0)
    const rows = sorted
      .map((b) => {
        const service = b.style ? `${b.service} — ${b.style}` : b.service
        const paid = b.amountPaid != null ? `${paymentLabel(b)} · ${gbp(b.amountPaid)}` : paymentLabel(b)
        return `<tr><td>${b.date}</td><td>${b.client}</td><td>${service}</td><td class="r">${gbp(
          b.price,
        )}</td><td>${paid}</td><td>${b.status}</td></tr>`
      })
      .join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>VAULT 876 — Bookings Export</title>
      <style>
        *{box-sizing:border-box} body{font-family:Georgia,'Times New Roman',serif;color:#0a0a0a;margin:40px}
        .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #d4af37;padding-bottom:16px;margin-bottom:24px}
        .brand{font-size:26px;font-weight:800;letter-spacing:1px} .brand b{color:#bf9c2e}
        .sub{font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#777}
        table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}
        th{text-align:left;text-transform:uppercase;letter-spacing:1px;font-size:10px;color:#888;border-bottom:1px solid #ddd;padding:10px 8px}
        td{padding:10px 8px;border-bottom:1px solid #eee} td.r,th.r{text-align:right}
        tfoot td{font-weight:bold;border-top:2px solid #d4af37;border-bottom:none;font-size:13px}
        .meta{font-family:Arial,sans-serif;font-size:11px;color:#777;margin-top:18px}
      </style></head><body>
      <div class="head"><div class="brand">VAULT <b>876</b></div><div class="sub">Bookings · Tax Export</div></div>
      <table><thead><tr><th>Date</th><th>Client</th><th>Service</th><th class="r">Price</th><th>Payment</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="3">Total booked value</td><td class="r">${gbp(total)}</td><td colspan="2"></td></tr>
        <tr><td colspan="3">Total collected online</td><td class="r">${gbp(totalPaid)}</td><td colspan="2"></td></tr>
      </tfoot></table>
      <div class="meta">Generated ${new Date().toLocaleString('en-GB')} · ${sorted.length} bookings · VAULT 876 Hair &amp; Beauty, Aylesbury</div>
      </body></html>`
    const w = window.open('', '_blank')
    if (!w) {
      alert('Please allow pop-ups to print/save the PDF report.')
      return
    }
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 250)
  }

  const kpiCards = [
    { label: 'Total Bookings', value: kpis.total, sub: 'all time' },
    { label: 'Total Revenue', value: gbp(kpis.revenue), sub: 'confirmed & completed' },
    { label: 'Upcoming', value: kpis.upcoming, sub: 'appointments ahead' },
    { label: 'Avg. Ticket', value: gbp(kpis.avg), sub: 'per booking' },
  ]

  // Brief hold while we resolve the auth session, then gate on sign-in.
  if (!authReady) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-canvas text-ink/40">
        <RefreshCw className="h-5 w-5 animate-spin" />
      </div>
    )
  }
  if (supabase && !session) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="hidden rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold sm:inline">
              Owner Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" /> View site
            </Link>
            {supabase && session && (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-gold/60 hover:text-gold"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="font-display text-4xl font-black tracking-[-0.02em] sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 text-ink/55">
              Welcome back — here is the chair at VAULT 876 today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="btn-ghost !px-4 !py-3 !text-sm"
              aria-label="Refresh bookings"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              type="button"
              onClick={exportCSV}
              disabled={sorted.length === 0}
              className="btn-gold !px-5 !py-3 !text-sm"
            >
              <Download className="h-4 w-4" /> Export for Tax (CSV)
            </button>
            <button
              type="button"
              onClick={exportPDF}
              disabled={sorted.length === 0}
              className="btn-ghost !px-5 !py-3 !text-sm"
            >
              <Printer className="h-4 w-4" /> Save as PDF
            </button>
          </div>
        </motion.div>

        {/* Edit Website — the owner's self-service content manager */}
        {supabase && (
          <motion.button
            type="button"
            onClick={() => setEditing(true)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="group relative mt-8 flex w-full items-center justify-between gap-5 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/[0.12] via-gold/[0.05] to-transparent p-6 text-left transition-all duration-500 ease-luxe hover:border-gold/60 hover:shadow-[0_30px_80px_-40px_rgba(212,175,55,0.7)] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold text-obsidian shadow-lg transition-transform duration-500 group-hover:scale-105 sm:h-16 sm:w-16">
                <Wand2 className="h-7 w-7" />
              </span>
              <div>
                <div className="font-display text-2xl font-black tracking-[-0.02em] text-ink sm:text-3xl">
                  Edit Website
                </div>
                <p className="mt-1 max-w-md text-sm text-ink/55">
                  Update your photos & video, change your prices, and edit your policies — live, in minutes.
                </p>
              </div>
            </div>
            <ArrowRight className="hidden h-6 w-6 shrink-0 text-gold transition-transform duration-500 group-hover:translate-x-1 sm:block" />
          </motion.button>
        )}

        {/* KPI cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
              className="relative overflow-hidden rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6"
            >
              <div className="absolute right-0 top-0 h-16 w-16 -translate-y-6 translate-x-6 rounded-full bg-gold/10 blur-2xl" />
              <div className="label-caps text-ink/45">{k.label}</div>
              <div className="mt-3 font-display text-3xl font-black tracking-[-0.02em] sm:text-4xl">
                {k.value}
              </div>
              <div className="mt-1 text-xs text-ink/45">{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold">Recent bookings</h2>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search client, service or ID…"
              className="w-full rounded-full border border-ink/15 bg-surface py-3 pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-gold/60"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[0.68rem] uppercase tracking-[0.12em] text-ink/45">
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Client</th>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 text-right font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Payment</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-ink/8 transition-colors last:border-0 hover:bg-gold/[0.04]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 tabular-nums text-ink/70">
                      {fmtDate(b.date)}
                    </td>
                    <td className="px-5 py-4 font-medium text-ink">{b.client}</td>
                    <td className="px-5 py-4 text-ink/70">
                      {b.service}
                      {b.style && <span className="text-ink/40"> — {b.style}</span>}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-display text-base text-gold">
                      {gbp(b.price)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold ${
                          PAYMENT_STYLES[b.paymentType] || PAYMENT_STYLES.unpaid
                        }`}
                      >
                        {paymentLabel(b)}
                      </span>
                      {b.amountPaid != null && (
                        <span className="ml-2 text-xs tabular-nums text-ink/45">
                          {gbp(b.amountPaid)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold ${
                          STATUS_STYLES[b.status] || STATUS_STYLES.Pending
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-ink/45">
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Loading bookings…
                      </span>
                    </td>
                  </tr>
                )}
                {!loading && loadError && (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <p className="font-medium text-red-600 dark:text-red-400">
                        Couldn’t load bookings.
                      </p>
                      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
                        {loadError} — if this is the first run, apply{' '}
                        <code className="rounded bg-ink/10 px-1.5 py-0.5 text-xs">
                          supabase/schema.sql
                        </code>{' '}
                        in the Supabase SQL Editor to create the tables and access
                        policies.
                      </p>
                    </td>
                  </tr>
                )}
                {!loading && !loadError && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-ink/45">
                      {bookings.length === 0
                        ? 'No bookings yet — once a client books, they’ll appear here.'
                        : `No bookings match “${query}”.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-ink/40">
          Showing {filtered.length} of {bookings.length} bookings
          {supabase ? ' · live from Supabase' : ' · demo data (backend not configured)'}.
        </p>

        {/* Live service menu — read from the Supabase `services` table */}
        {services.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">Service menu</h2>
            <p className="mt-1 text-sm text-ink/45">Live from your Supabase menu.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.slug}
                  className="rounded-2xl border border-ink/10 bg-surface p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg text-ink">{s.name}</div>
                      <div className="mt-0.5 text-xs text-ink/45">{s.duration}</div>
                    </div>
                    <div className="font-display text-lg text-gold">{gbp(Number(s.price) || 0)}</div>
                  </div>
                  {Array.isArray(s.styles) && s.styles.length > 0 && (
                    <div className="mt-3 text-xs text-ink/50">
                      {s.styles.length} style{s.styles.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* "Pay what you owe" payments — balances clients settled online */}
        {payments.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">Online payments</h2>
                <p className="mt-1 text-sm text-ink/45">
                  Balances & amounts clients paid from the “Pay your balance” page.
                </p>
              </div>
              <div className="text-right">
                <div className="label-caps text-ink/45">Collected</div>
                <div className="font-display text-2xl text-gold">
                  {gbp(
                    payments
                      .filter((p) => p.status === 'Paid')
                      .reduce((s, p) => s + (Number(p.amount_paid ?? p.amount) || 0), 0),
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-[0.68rem] uppercase tracking-[0.12em] text-ink/45">
                      <th className="px-5 py-4 font-semibold">Date</th>
                      <th className="px-5 py-4 font-semibold">Client</th>
                      <th className="px-5 py-4 font-semibold">For</th>
                      <th className="px-5 py-4 text-right font-semibold">Amount</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-ink/8 last:border-0">
                        <td className="whitespace-nowrap px-5 py-4 tabular-nums text-ink/70">
                          {p.created_at ? fmtDate(String(p.created_at).slice(0, 10)) : '—'}
                        </td>
                        <td className="px-5 py-4 font-medium text-ink">{p.name || '—'}</td>
                        <td className="px-5 py-4 text-ink/60">{p.note || '—'}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-display text-base text-gold">
                          {gbp(Number(p.amount_paid ?? p.amount) || 0)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold ${
                              p.status === 'Paid'
                                ? PAYMENT_STYLES.full
                                : STATUS_STYLES['Awaiting Payment']
                            }`}
                          >
                            {p.status === 'Paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <AnimatePresence>
        {editing && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas text-ink/40">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            }
          >
            <EditWebsite
              onClose={() => {
                setEditing(false)
                load() // reflect any menu edits in the dashboard's service list
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}
