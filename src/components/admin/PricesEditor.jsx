import { useEffect, useState } from 'react'
import { Check, RefreshCw, Plus, Trash2, Save } from 'lucide-react'
import { fetchServicesRaw, saveService, deleteService } from '../../lib/adminApi.js'

// Edit the live menu. Because the website, the booking form AND the Stripe
// "pay in full" amount all read from this one `services` table, a saved price
// change is reflected everywhere at once — there's no second place to update.
export default function PricesEditor() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingSlug, setSavingSlug] = useState(null)
  const [savedSlug, setSavedSlug] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    fetchServicesRaw()
      .then((data) =>
        setRows(
          data.map((r) => ({
            ...r,
            stylesText: Array.isArray(r.styles) ? r.styles.join(', ') : '',
          })),
        ),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const patch = (slug, field, value) =>
    setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, [field]: value } : r)))

  const save = async (row) => {
    setSavingSlug(row.slug)
    setError('')
    try {
      // A brand-new service gets a clean slug from its name (it's the id the
      // booking links and Stripe pricing key on). Existing slugs never change.
      let toSave = row
      if (row._new) {
        const base = slugify(row.name)
        let slug = base
        let i = 1
        while (rows.some((r) => r !== row && r.slug === slug)) slug = `${base}-${i++}`
        toSave = { ...row, slug }
      }
      await saveService({ ...toSave, styles: toSave.stylesText })
      setRows((rs) =>
        rs.map((r) => (r.slug === row.slug ? { ...r, slug: toSave.slug, _new: false } : r)),
      )
      setSavedSlug(toSave.slug)
      setTimeout(() => setSavedSlug(null), 2000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSavingSlug(null)
    }
  }

  const addRow = () => {
    const base = 'new-service'
    let slug = base
    let i = 1
    while (rows.some((r) => r.slug === slug)) slug = `${base}-${i++}`
    setRows((rs) => [
      ...rs,
      {
        slug, name: 'New service', copy: '', price: 0, duration: '', stylesText: '',
        active: true, sort_order: (rs.at(-1)?.sort_order || 0) + 1, _new: true,
      },
    ])
  }

  const remove = async (row) => {
    if (row._new) {
      setRows((rs) => rs.filter((r) => r.slug !== row.slug))
      return
    }
    if (!window.confirm(`Remove "${row.name}" from your menu? This can't be undone.`)) return
    try {
      await deleteService(row.slug)
      setRows((rs) => rs.filter((r) => r.slug !== row.slug))
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-ink/45">
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading your menu…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-black tracking-[-0.02em]">Prices & services</h2>
          <p className="mt-2 text-ink/55">
            Change a price and tap Save — your website, booking form and payments all update together.
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-ghost !px-4 !py-3 !text-sm">
          <Plus className="h-4 w-4" /> Add service
        </button>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div key={row.slug} className="rounded-2xl border border-ink/12 bg-surface p-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-3">
                <TextInput label="Service name" value={row.name}
                  onChange={(v) => patch(row.slug, 'name', v)} />
                <TextInput label="Short description" value={row.copy}
                  onChange={(v) => patch(row.slug, 'copy', v)} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Price (£)</Label>
                    <input type="number" min={0} step={1} value={row.price}
                      onChange={(e) => patch(row.slug, 'price', e.target.value)}
                      className={inputCls} />
                  </div>
                  <TextInput label="Duration" value={row.duration}
                    placeholder="e.g. 2 hr" onChange={(v) => patch(row.slug, 'duration', v)} />
                </div>
                <TextInput label="Styles (comma separated)" value={row.stylesText}
                  placeholder="Knotless braids, Box braids, …"
                  onChange={(v) => patch(row.slug, 'stylesText', v)} />
              </div>

              <div className="flex flex-row items-start justify-end gap-2 sm:flex-col">
                <button type="button" onClick={() => save(row)} disabled={savingSlug === row.slug}
                  className="btn-gold !px-4 !py-2.5 !text-sm">
                  {savingSlug === row.slug ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" /> Saving</>
                  ) : savedSlug === row.slug ? (
                    <><Check className="h-4 w-4" /> Saved</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save</>
                  )}
                </button>
                <button type="button" onClick={() => remove(row)}
                  className="inline-flex items-center justify-center rounded-full border border-ink/15 p-2.5 text-ink/50 transition-colors hover:border-red-400/60 hover:text-red-500"
                  aria-label={`Remove ${row.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'service'

const inputCls =
  'w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-gold/70'

const Label = ({ children }) => (
  <span className="mb-1.5 block text-xs uppercase tracking-wider text-ink/45">{children}</span>
)

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input type="text" value={value || ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  )
}
