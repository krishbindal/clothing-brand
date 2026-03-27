'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bell, Sparkles } from 'lucide-react'
import { joinWaitlist } from '@/lib/firebase/firestore'

type Props = {
  headline?: string
  subheadline?: string
}

export default function ComingSoonPanel({
  headline = 'New Collection Coming Soon',
  subheadline = 'Crafting the next drop. Stay ready.',
}: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!email.trim()) {
      setMessage('Add your email to lock early access updates.')
      return
    }
    setStatus('saving')
    setMessage(null)
    try {
      const persisted = await joinWaitlist(email.trim(), name.trim() || null)
      try {
        window.localStorage.setItem('luxe_waitlist_email', email.trim())
      } catch {
        // ignore storage issues
      }
      setStatus('saved')
      setMessage(
        persisted
          ? 'You are on the list. We will notify you before the drop opens.'
          : 'Saved locally. Connect Firebase to sync notifications.',
      )
      setEmail('')
    } catch (err) {
      console.error('Waitlist signup failed', err)
      setStatus('error')
      setMessage('Unable to save right now. Please try again in a moment.')
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-border/50 bg-gradient-to-b from-brand-dark/70 via-brand-black/80 to-brand-dark/60 p-8 sm:p-12 shadow-[0_20px_120px_rgba(201,168,76,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,168,76,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_38%)] opacity-80" />
      <div className="absolute inset-0 bg-noise opacity-20" />
      <motion.div
        aria-hidden
        className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-brand-gold/20 blur-[120px]"
        animate={{ opacity: [0.25, 0.4, 0.25], scale: [0.9, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-brand-gold">
            <Sparkles size={14} />
            Atelier signal
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-brand-white leading-tight">
            {headline}
          </h2>
          <p className="text-brand-gray-300 text-sm sm:text-base">{subheadline}</p>
          <p className="text-brand-gray-500 text-xs uppercase tracking-[0.3em]">No products yet — experience stays premium.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="input-dark w-full"
              autoComplete="name"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="input-dark w-full"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={status === 'saving'}
              className="btn-primary min-w-[180px] justify-center"
            >
              {status === 'saving' ? 'Joining...' : 'Join Early Access'}
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              className="btn-secondary min-w-[180px] justify-center"
            >
              <Bell size={16} />
              Notify Me
            </button>
          </div>
          {message && (
            <p className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-brand-gray-200'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
