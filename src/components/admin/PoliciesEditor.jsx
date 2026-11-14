import { useEffect, useState } from 'react'
import { Check, RefreshCw, Plus, Trash2, Save } from 'lucide-react'
import { fetchContentRaw, saveContentBlock, deleteContentBlock } from '../../lib/adminApi.js'

// Edit the free-text "Good to know" blocks (deposits, cancellations, lateness,
// what to bring). These show on the homepage and inside the booking flow.
export default function PoliciesEditor() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    fetchContentRaw()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const patch = (key, field, value) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: value } : r)))

  const save = async (row) => {
    setSavingKey(row.key)
    setError('')
    try {
      await saveContentBlock(row)
      setSavedKey(row.key)
      setTimeout(() => setSavedKey(null), 2000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSavingKey(null)
    }
  }

  const addRow = () => {
    let key = `note-${Date.now()}`
    setRows((rs) => [
      ...rs,
      { key, title: 'New note', body: '', sort_order: (rs.at(-1)?.sort_order || 0) + 1, _new: true },
    ])
  }

  const remove = async (row) => {
    if (row._new) {
      setRows((rs) => rs.filter((r) => r.key !== row.key))
      return
    }
    if (!window.confirm(`Delete "${row.title}"? This can't be undone.`)) return
    try {
      await deleteContentBlock(row.key)
      setRows((rs) => rs.filter((r) => r.key !== row.key))
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-ink/45">
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading your policies…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-black tracking-[-0.02em]">Rules & policies</h2>
          <p className="mt-2 text-ink/55">
            Deposits, cancellations, lateness — your clients see these on the site and when they book.
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-ghost !px-4 !py-3 !text-sm">
          <Plus className="h-4 w-4" /> Add note
        </button>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div key={row.key} className="rounded-2xl border border-ink/12 bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <input type="text" value={row.title}
                onChange={(e) => patch(row.key, 'title', e.target.value)}
                className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 font-display text-lg text-ink outline-none transition-colors focus:border-gold/70" />
              <button type="button" onClick={() => remove(row)}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/15 p-2.5 text-ink/50 transition-colors hover:border-red-400/60 hover:text-red-500"
                aria-label={`Delete ${row.title}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea value={row.body} rows={3}
              onChange={(e) => patch(row.key, 'body', e.target.value)}
              className="mt-3 w-full resize-y rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-gold/70" />
            <div className="mt-3 flex justify-end">
              <button type="button" onClick={() => save(row)} disabled={savingKey === row.key}
                className="btn-gold !px-5 !py-2.5 !text-sm">
                {savingKey === row.key ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Saving</>
                ) : savedKey === row.key ? (
                  <><Check className="h-4 w-4" /> Saved</>
                ) : (
                  <><Save className="h-4 w-4" /> Save</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
