import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Download, Printer, ArrowLeft } from 'lucide-react'
import Wordmark from '../components/Wordmark.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { bookings } from '../lib/adminData.js'

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
  Completed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

// CSV field escaping — quote anything with a comma, quote or newline.
const csv = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function Admin() {
  const [query, setQuery] = useState('')

  const sorted = useMemo(
    () => [...bookings].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [],
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
      avg,
    }
  }, [])

  const exportCSV = () => {
    const header = ['Booking ID', 'Date', 'Client', 'Service', 'Price (GBP)', 'Status']
    const lines = [header.join(',')]
    let total = 0
    sorted.forEach((b) => {
      total += b.price
      const service = b.style ? `${b.service} — ${b.style}` : b.service
      lines.push(
        [csv(b.id), b.date, csv(b.client), csv(service), b.price.toFixed(2), b.status].join(','),
      )
    })
    lines.push(['', '', '', 'Total', total.toFixed(2), ''].join(','))

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
    const rows = sorted
      .map((b) => {
        const service = b.style ? `${b.service} — ${b.style}` : b.service
        return `<tr><td>${b.date}</td><td>${b.client}</td><td>${service}</td><td class="r">${gbp(
          b.price,
        )}</td><td>${b.status}</td></tr>`
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
      <table><thead><tr><th>Date</th><th>Client</th><th>Service</th><th class="r">Price</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3">Total revenue</td><td class="r">${gbp(total)}</td><td></td></tr></tfoot></table>
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
              onClick={exportCSV}
              className="btn-gold !px-5 !py-3 !text-sm"
            >
              <Download className="h-4 w-4" /> Export for Tax (CSV)
            </button>
            <button
              type="button"
              onClick={exportPDF}
              className="btn-ghost !px-5 !py-3 !text-sm"
            >
              <Printer className="h-4 w-4" /> Save as PDF
            </button>
          </div>
        </motion.div>

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
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[0.68rem] uppercase tracking-[0.12em] text-ink/45">
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Client</th>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 text-right font-semibold">Price</th>
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-ink/45">
                      No bookings match “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-ink/40">
          Showing {filtered.length} of {bookings.length} bookings · demo data —
          live records connect via Supabase next.
        </p>
      </main>
    </div>
  )
}
