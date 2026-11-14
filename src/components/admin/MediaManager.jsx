import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cropper from 'react-easy-crop'
import { Upload, Check, ChevronLeft, RefreshCw, Sparkles, PartyPopper } from 'lucide-react'
import { PANELS } from '../../lib/panels.js'
import { PRESETS, FILTER_DEFAULTS, buildFilterCss, getCroppedImg } from '../../lib/imageFilters.js'
import { uploadPanelMedia, fetchSiteMediaMap } from '../../lib/adminApi.js'

const EASE = [0.16, 1, 0.3, 1]
const MAX_VIDEO_MB = 50

const STEP_LABELS = ['Choose media', 'Pick a spot', 'Make it beautiful', 'Publish']

// The four-step "Instagram" flow. Deliberately linear and forgiving: one clear
// action per screen, a Back button everywhere, and nothing is saved until the
// final "Save & Publish".
export default function MediaManager() {
  const [step, setStep] = useState(1)
  const [currentMedia, setCurrentMedia] = useState({})
  const [file, setFile] = useState(null)
  const [src, setSrc] = useState('') // object URL for preview
  const [type, setType] = useState('image') // 'image' | 'video'
  const [panelId, setPanelId] = useState(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [filters, setFilters] = useState(FILTER_DEFAULTS)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const panel = useMemo(() => PANELS.find((p) => p.id === panelId) || null, [panelId])
  const filterCss = useMemo(() => buildFilterCss(filters), [filters])

  // Show the owner what's currently live in each panel.
  const loadCurrent = useCallback(() => {
    fetchSiteMediaMap().then(setCurrentMedia).catch(() => {})
  }, [])
  useEffect(() => {
    loadCurrent()
  }, [loadCurrent])

  // Clean up object URLs so we don't leak between edits.
  useEffect(() => () => { if (src) URL.revokeObjectURL(src) }, [src])

  const reset = () => {
    if (src) URL.revokeObjectURL(src)
    setFile(null); setSrc(''); setPanelId(null)
    setCrop({ x: 0, y: 0 }); setZoom(1); setCroppedAreaPixels(null)
    setFilters(FILTER_DEFAULTS); setError('')
    setStep(1)
  }

  const onPick = (e) => {
    const f = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!f) return
    const isVideo = f.type.startsWith('video/')
    if (isVideo && f.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`That video is a bit large (over ${MAX_VIDEO_MB}MB). Please choose a shorter clip.`)
      return
    }
    if (src) URL.revokeObjectURL(src)
    setError('')
    setFile(f)
    setType(isVideo ? 'video' : 'image')
    setSrc(URL.createObjectURL(f))
    setStep(2)
  }

  const publish = async () => {
    if (!panel || !file) return
    setBusy(true)
    setError('')
    try {
      let toUpload = file
      if (type === 'image') {
        if (!croppedAreaPixels) throw new Error('Please adjust the photo first.')
        toUpload = await getCroppedImg(src, croppedAreaPixels, filterCss)
      }
      await uploadPanelMedia({ panelId: panel.id, file: toUpload, type, filters })
      loadCurrent()
      setBusy(false)
      setStep(5) // success
    } catch (err) {
      setBusy(false)
      setError(err?.message || 'Something went wrong while publishing. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step rail (hidden on the success screen) */}
      {step <= 4 && (
        <ol className="mb-8 flex items-center gap-2">
          {STEP_LABELS.map((lbl, i) => {
            const n = i + 1
            const active = n === step
            const done = n < step
            return (
              <li key={lbl} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                    active ? 'border-gold bg-gold text-obsidian'
                      : done ? 'border-gold/60 text-gold' : 'border-ink/25 text-ink/45'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : n}
                </span>
                <span className={`hidden text-xs sm:block ${active ? 'text-ink' : 'text-ink/45'}`}>{lbl}</span>
                {n < 4 && <span className="h-px flex-1 bg-ink/12" />}
              </li>
            )
          })}
        </ol>
      )}

      {error && (
        <p className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {/* STEP 1 — choose media */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="font-display text-3xl font-black tracking-[-0.02em]">Add a photo or video</h2>
              <p className="mx-auto mt-3 max-w-md text-ink/55">
                Pick anything from your phone or computer. You'll choose where it goes and make it
                look beautiful next.
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={onPick}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="group mx-auto mt-10 flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-gold/40 bg-gold/[0.04] px-8 py-16 transition-all duration-300 hover:border-gold hover:bg-gold/[0.08]"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-obsidian transition-transform duration-300 group-hover:scale-105">
                  <Upload className="h-7 w-7" />
                </span>
                <span className="font-display text-xl text-ink">Upload Photo or Video</span>
                <span className="text-sm text-ink/45">Tap to browse your device</span>
              </button>
            </div>
          )}

          {/* STEP 2 — pick a panel */}
          {step === 2 && (
            <div>
              <StepHead onBack={() => setStep(1)} title="Where should this go?"
                sub="Tap the spot on your website you want to update. The current look is shown in each." />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {PANELS.map((p) => {
                  const cur = currentMedia[p.id]
                  const on = panelId === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setPanelId(p.id); setStep(3) }}
                      className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                        on ? 'border-gold ring-2 ring-gold/40' : 'border-ink/12 hover:border-gold/60'
                      }`}
                    >
                      <div className={`relative ${p.aspectClass} w-full overflow-hidden bg-obsidian`}>
                        {cur ? (
                          cur.type === 'video' ? (
                            <video src={cur.url} muted playsInline className="absolute inset-0 h-full w-full object-cover"
                              style={{ filter: buildFilterCss(cur.filters) }} />
                          ) : (
                            <img src={cur.url} alt="" className="absolute inset-0 h-full w-full object-cover"
                              style={{ filter: buildFilterCss(cur.filters) }} />
                          )
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_120%_at_30%_15%,#1c1811,#0a0a0a)]">
                            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold/50">Empty</span>
                          </div>
                        )}
                        <span className="absolute left-0 top-0 rounded-br-lg bg-black/55 px-2 py-1 text-[0.6rem] uppercase tracking-wider text-white/80">
                          {p.group}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <span className="truncate text-sm font-medium text-ink">{p.label}</span>
                        {cur && <Check className="h-3.5 w-3.5 shrink-0 text-gold" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — edit & filter */}
          {step === 3 && panel && (
            <div>
              <StepHead onBack={() => setStep(2)} title="Make it beautiful"
                sub={type === 'image'
                  ? `Drag to reposition, pinch or use the slider to zoom. ${panel.label}.`
                  : `Choose a look for your video. ${panel.label}.`} />

              <div className="mt-6 overflow-hidden rounded-2xl border border-ink/12 bg-obsidian">
                <div className={`relative w-full ${panel.aspect >= 1.4 ? 'h-[300px]' : 'h-[380px]'}`}>
                  {type === 'image' ? (
                    <Cropper
                      image={src}
                      crop={crop}
                      zoom={zoom}
                      aspect={panel.aspect}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(_, px) => setCroppedAreaPixels(px)}
                      objectFit="contain"
                      style={{ mediaStyle: filterCss ? { filter: filterCss } : {} }}
                    />
                  ) : (
                    <video
                      src={src}
                      autoPlay muted loop playsInline
                      className="absolute inset-0 h-full w-full object-contain"
                      style={filterCss ? { filter: filterCss } : undefined}
                    />
                  )}
                </div>
              </div>

              {type === 'image' && (
                <div className="mt-5">
                  <label className="mb-2 block text-xs uppercase tracking-wider text-ink/45">Zoom</label>
                  <input type="range" min={1} max={3} step={0.01} value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-gold" />
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); setFilters(FILTER_DEFAULTS) }}
                  className="text-sm text-ink/50 underline-offset-2 transition-colors hover:text-ink hover:underline"
                >
                  Reset adjustments
                </button>
              </div>

              {/* Presets */}
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-ink/45">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> Looks
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => {
                    const on = filters.preset === p.id
                    return (
                      <button key={p.id} type="button"
                        onClick={() => setFilters((f) => ({ ...f, preset: p.id }))}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          on ? 'border-gold bg-gold text-obsidian' : 'border-ink/20 text-ink/70 hover:border-gold/60'
                        }`}>
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Slider label="Skin smoothness" value={filters.smoothness}
                  onChange={(v) => setFilters((f) => ({ ...f, smoothness: v }))} />
                <Slider label="Hair gloss" value={filters.gloss}
                  onChange={(v) => setFilters((f) => ({ ...f, gloss: v }))} />
              </div>

              <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setStep(4)} className="btn-gold !px-8 !py-3.5">
                  Looks great — continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — review & publish */}
          {step === 4 && panel && (
            <div>
              <StepHead onBack={() => setStep(3)} title="Ready to publish?"
                sub={`This will update "${panel.label}" on your live website.`} />
              <div className="mt-6 overflow-hidden rounded-2xl border border-ink/12 bg-obsidian">
                <div className={`relative w-full ${panel.aspectClass} mx-auto max-w-md`}>
                  {type === 'image' ? (
                    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover"
                      style={filterCss ? { filter: filterCss } : undefined} />
                  ) : (
                    <video src={src} autoPlay muted loop playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                      style={filterCss ? { filter: filterCss } : undefined} />
                  )}
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={reset} className="btn-ghost !px-5 !py-3 !text-sm">
                  Start over
                </button>
                <button type="button" onClick={publish} disabled={busy} className="btn-gold !px-8 !py-3.5">
                  {busy ? (<><RefreshCw className="h-4 w-4 animate-spin" /> Publishing…</>) : 'Save & Publish'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — success */}
          {step === 5 && (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
                <PartyPopper className="h-9 w-9" />
              </div>
              <h2 className="mt-8 font-display text-4xl font-black tracking-[-0.02em]">Done!</h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-ink/60">
                Your update is live. Go to your website and refresh the page to see your new look.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={reset} className="btn-gold !px-8 !py-4">
                  Update another photo
                </button>
                <a href="/" target="_blank" rel="noreferrer" className="btn-ghost !px-8 !py-4">
                  View my website
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StepHead({ onBack, title, sub }) {
  return (
    <div>
      <button type="button" onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="font-display text-3xl font-black tracking-[-0.02em]">{title}</h2>
      {sub && <p className="mt-2 text-ink/55">{sub}</p>}
    </div>
  )
}

function Slider({ label, value, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-ink/45">
        <span>{label}</span>
        <span className="tabular-nums text-gold">{value}</span>
      </div>
      <input type="range" min={0} max={100} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold" />
    </div>
  )
}
