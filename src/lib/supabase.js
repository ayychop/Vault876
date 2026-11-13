import { createClient } from '@supabase/supabase-js'

// Live Supabase client. The URL + anon key come from Vite env vars, set in
// `.env` locally and in the Vercel project settings for production. The anon
// key is safe to expose in the browser — row access is governed by the RLS
// policies on the database (see supabase/schema.sql).
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// A single shared client for the whole app.
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null

// True when the env vars are present — lets the UI fail gracefully (and keep
// the demo working) if the backend isn't configured in a given environment.
export const isSupabaseConfigured = Boolean(supabase)
