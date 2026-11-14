import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ImagePlus, Tag, ScrollText } from 'lucide-react'
import MediaManager from './MediaManager.jsx'
import PricesEditor from './PricesEditor.jsx'
import PoliciesEditor from './PoliciesEditor.jsx'
import Wordmark from '../Wordmark.jsx'

const EASE = [0.16, 1, 0.3, 1]

const TABS = [
  { id: 'media', label: 'Photos & Video', icon: ImagePlus },
  { id: 'prices', label: 'Prices', icon: Tag },
  { id: 'policies', label: 'Policies', icon: ScrollText },
]

// Full-screen editor over the dashboard. One home for everything the owner can
// change about her site, split into three plain tabs.
export default function EditWebsite({ onClose }) {
  const [tab, setTab] = useState('media')

  // Close on Escape, and lock background scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col bg-canvas"
      role="dialog"
      aria-modal="true"
      aria-label="Edit website"
    >
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="hidden rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold sm:inline">
              Edit Website
            </span>
          </div>
          <button type="button" onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-gold/60 hover:text-gold">
            <X className="h-4 w-4" /> <span className="hidden sm:inline">Done</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {TABS.map((t) => {
              const on = tab === t.id
              const Icon = t.icon
              return (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                    on ? 'text-gold' : 'text-ink/55 hover:text-ink'
                  }`}>
                  <Icon className="h-4 w-4" /> {t.label}
                  {on && (
                    <motion.span layoutId="editTabUnderline"
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}>
              {tab === 'media' && <MediaManager />}
              {tab === 'prices' && <PricesEditor />}
              {tab === 'policies' && <PoliciesEditor />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
