// Admin-only writes for the "Edit Website" portal. Every call runs as the
// signed-in owner (the shared Supabase client carries her JWT), so the RLS
// policies in phase6.sql are what actually authorise these — the anon key
// can't reach any of them.
import { supabase } from './supabase.js'

const requireBackend = () => {
  if (!supabase) throw new Error('The website backend isn’t connected yet.')
}

// --- Media -----------------------------------------------------------------
// Upload a baked image blob (or a video File) to Storage and point the panel at
// it. One row per panel (upsert on panel_id), so re-uploading replaces cleanly.
export async function uploadPanelMedia({ panelId, file, type, filters = {} }) {
  requireBackend()
  const ext = type === 'video' ? (file.type?.split('/')[1] || 'mp4') : 'jpg'
  const path = `${panelId}/${Date.now()}.${ext}`

  const { error: upErr } = await supabase.storage.from('site_media').upload(path, file, {
    contentType: file.type || (type === 'video' ? 'video/mp4' : 'image/jpeg'),
    cacheControl: '3600',
    upsert: true,
  })
  if (upErr) throw upErr

  const { data: pub } = supabase.storage.from('site_media').getPublicUrl(path)
  const media_url = pub.publicUrl

  const { error: dbErr } = await supabase.from('site_media').upsert(
    {
      panel_id: panelId,
      media_url,
      media_type: type,
      filters,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'panel_id' },
  )
  if (dbErr) throw dbErr
  return media_url
}

export async function fetchSiteMediaMap() {
  requireBackend()
  const { data, error } = await supabase.from('site_media').select('*')
  if (error) throw error
  const map = {}
  ;(data || []).forEach((r) => {
    map[r.panel_id] = { url: r.media_url, type: r.media_type, filters: r.filters || {} }
  })
  return map
}

export async function clearPanelMedia(panelId) {
  requireBackend()
  const { error } = await supabase.from('site_media').delete().eq('panel_id', panelId)
  if (error) throw error
}

// --- Services (the menu / prices) ------------------------------------------
export async function fetchServicesRaw() {
  requireBackend()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

// Save one service row. `styles` may be an array or a comma-separated string.
export async function saveService(row) {
  requireBackend()
  const styles = Array.isArray(row.styles)
    ? row.styles
    : String(row.styles || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
  const payload = {
    slug: row.slug,
    name: row.name,
    copy: row.copy || '',
    price: Number(row.price) || 0,
    duration: row.duration || '',
    styles,
    active: row.active !== false,
    sort_order: Number(row.sort_order) || 0,
  }
  const { error } = await supabase.from('services').upsert(payload, { onConflict: 'slug' })
  if (error) throw error
}

export async function deleteService(slug) {
  requireBackend()
  const { error } = await supabase.from('services').delete().eq('slug', slug)
  if (error) throw error
}

// --- Site content (policies) -----------------------------------------------
export async function fetchContentRaw() {
  requireBackend()
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function saveContentBlock(block) {
  requireBackend()
  const payload = {
    key: block.key,
    title: block.title || '',
    body: block.body || '',
    sort_order: Number(block.sort_order) || 0,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('site_content').upsert(payload, { onConflict: 'key' })
  if (error) throw error
}

export async function deleteContentBlock(key) {
  requireBackend()
  const { error } = await supabase.from('site_content').delete().eq('key', key)
  if (error) throw error
}
