// Live site content read from Supabase, with the static files as a graceful
// fallback so the site (and the offline demo mirror) always renders something.
import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { services as fallbackServices } from './services.js'

// --- Services (the editable menu) ------------------------------------------
const normalizeService = (r) => ({
  slug: r.slug,
  name: r.name,
  copy: r.copy || '',
  price: Number(r.price) || 0,
  duration: r.duration || '',
  styles: Array.isArray(r.styles)
    ? r.styles
    : typeof r.styles === 'string'
      ? JSON.parse(r.styles || '[]')
      : [],
  active: r.active !== false,
  sort_order: r.sort_order ?? 0,
})

// Returns the live menu (or the static fallback until it loads / if there's no
// backend). Only active services are shown on the public site.
export function useServices() {
  const [data, setData] = useState(fallbackServices)
  useEffect(() => {
    if (!supabase) return
    let on = true
    supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data: rows, error }) => {
        if (!on || error || !rows?.length) return
        setData(rows.map(normalizeService).filter((s) => s.active))
      })
    return () => {
      on = false
    }
  }, [])
  return data
}

// --- Site media (one image/video per panel) --------------------------------
// Returns a map: { [panel_id]: { url, type, filters } }.
export function useSiteMedia() {
  const [media, setMedia] = useState({})
  useEffect(() => {
    if (!supabase) return
    let on = true
    supabase
      .from('site_media')
      .select('*')
      .then(({ data, error }) => {
        if (!on || error || !data) return
        const map = {}
        data.forEach((r) => {
          map[r.panel_id] = { url: r.media_url, type: r.media_type, filters: r.filters || {} }
        })
        setMedia(map)
      })
    return () => {
      on = false
    }
  }, [])
  return media
}

// --- Policy / "good to know" blocks ----------------------------------------
// Mirrors the seed in phase6.sql so the section shows real wording even before
// the migration has run or on the static mirror.
export const FALLBACK_CONTENT = [
  {
    key: 'deposit',
    title: 'Deposits & payment',
    body:
      'A £20 deposit secures your appointment and comes off your final total. You can also choose to pay in full when you book. The balance is settled in the salon.',
    sort_order: 1,
  },
  {
    key: 'cancellation',
    title: 'Cancellations & rescheduling',
    body:
      "Please give at least 48 hours' notice to cancel or move your appointment. Deposits for appointments cancelled with less notice cannot be refunded.",
    sort_order: 2,
  },
  {
    key: 'lateness',
    title: 'Running late',
    body:
      "If you're more than 15 minutes late we may need to shorten or rebook your appointment so the next client isn't kept waiting. A quick call always helps.",
    sort_order: 3,
  },
  {
    key: 'preparation',
    title: 'Before you arrive',
    body:
      "Come with your hair washed and blow-dried unless your service includes it. Bring any extensions you'd like us to use, and a reference photo if you have one.",
    sort_order: 4,
  },
]

export function useSiteContent() {
  const [data, setData] = useState(FALLBACK_CONTENT)
  useEffect(() => {
    if (!supabase) return
    let on = true
    supabase
      .from('site_content')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data: rows, error }) => {
        if (!on || error || !rows?.length) return
        setData(rows)
      })
    return () => {
      on = false
    }
  }, [])
  return data
}
