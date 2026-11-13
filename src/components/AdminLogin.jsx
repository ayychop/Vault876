import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import Wordmark from './Wordmark.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Sign-in gate for the owner portal. Admins are provisioned in the Supabase
// dashboard (Authentication → Users) — there is deliberately no self-signup, so
// nobody can grant themselves access to client bookings.
export default function AdminLogin() {
  // Pre-fill the current admin address for convenience; it is freely editable.
  const [email, setEmail] = useState('info@boanetworks.com')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password || submitting) return
    setSubmitting(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setSubmitting(false)
    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'Email or password is incorrect.'
          : signInError.message || 'Could not sign in. Please try again.',
      )
    }
    // On success the auth listener in Admin swaps in the dashboard.
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-canvas text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Wordmark size="sm" />
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

      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-sm"
        >
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Lock className="h-5 w-5" />
            </span>
            <span className="mt-5 inline-block rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold">
              Owner Portal
            </span>
            <h1 className="mt-4 font-display text-3xl font-black tracking-[-0.02em]">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-ink/55">
              Access your bookings and tax exports.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink/70">Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@boanetworks.com"
                className="w-full rounded-xl border border-ink/15 bg-surface px-4 py-3.5 text-ink placeholder:text-ink/50 outline-none transition-colors focus:border-gold/70"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink/70">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink/15 bg-surface px-4 py-3.5 text-ink placeholder:text-ink/50 outline-none transition-colors focus:border-gold/70"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !email.trim() || !password}
              className="btn-gold w-full !py-4"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink/40">
            Accounts are set up by VAULT 876. Contact your administrator for access.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
