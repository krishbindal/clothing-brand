'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Smartphone, User, Mail, Lock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type ProfileForm = {
  name: string
  email: string
  phone: string
  password: string
}

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?callbackUrl=/account/settings')
    }
  }, [loading, router, user])

  if (!loading && !user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  if (!user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  return <SettingsContent key={user.uid} userName={user.name || ''} userEmail={user.email || ''} userId={user.uid} />
}

function SettingsContent({ userName, userEmail, userId }: { userName: string; userEmail: string; userId: string }) {
  const [profile, setProfile] = useState<ProfileForm>(() => {
    if (typeof window === 'undefined') return { name: userName, email: userEmail, phone: '', password: '' }
    const stored = window.localStorage.getItem(`luxe_profile_${userId}`)
    if (stored) return JSON.parse(stored) as ProfileForm
    return { name: userName, email: userEmail, phone: '', password: '' }
  })
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    try {
      window.localStorage.setItem(`luxe_profile_${userId}`, JSON.stringify(profile))
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2600)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="section-overline">Account</p>
          <h1 className="section-title">Settings & Security</h1>
          <p className="text-brand-gray-400 max-w-2xl">
            Update your profile, tighten security, and keep your contact details current. Changes persist locally for this demo experience.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="card-dark border border-brand-border/60 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                <User size={18} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Profile</p>
                <p className="text-brand-white font-semibold">Basics</p>
              </div>
            </div>

            <label className="space-y-1 text-sm text-brand-gray-400">
              Name
              <input
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors"
                placeholder="Your name"
              />
            </label>

            <label className="space-y-1 text-sm text-brand-gray-400">
              Email
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-brand-gray-500" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors"
                  placeholder="name@email.com"
                />
              </div>
            </label>

            <label className="space-y-1 text-sm text-brand-gray-400">
              Phone
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-brand-gray-500" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors"
                  placeholder="+1 555 0100"
                />
              </div>
            </label>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="card-dark border border-brand-border/60 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                <Shield size={18} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Security</p>
                <p className="text-brand-white font-semibold">Credentials</p>
              </div>
            </div>

            <label className="space-y-1 text-sm text-brand-gray-400">
              Password
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-brand-gray-500" />
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gray-600">
                Save a strong passphrase. Demo mode stores locally only.
              </p>
            </label>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-brand-gray-500">
              <CheckCircle size={14} className="text-green-400" />
              Multi-factor prompts available at checkout.
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary px-6 py-3 text-sm uppercase tracking-[0.3em]"
          >
            Save settings
          </button>
          {status === 'saved' && (
            <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
              <CheckCircle size={16} className="text-brand-gold" />
              Saved locally
            </span>
          )}
        </div>
      </div>
    </main>
  )
}
