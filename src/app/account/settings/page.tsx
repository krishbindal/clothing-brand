'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Camera, CheckCircle, Image as ImageIcon, Mail, Shield, Smartphone, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchProfile, saveProfile } from '@/lib/firebase/firestore'
import { getFirebaseApp } from '@/lib/firebase/client'
import { getAuth, updateEmail, updateProfile } from 'firebase/auth'

type ProfileForm = {
  name: string
  email: string
  phone: string
  photoURL?: string
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
  const [profile, setProfile] = useState<ProfileForm>({
    name: userName,
    email: userEmail,
    phone: '',
    photoURL: '',
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(`luxe_profile_${userId}`)
      if (stored) {
        setProfile((prev) => ({ ...prev, ...(JSON.parse(stored) as ProfileForm) }))
      }
    }

    void (async () => {
      try {
        const remote = await fetchProfile(userId)
        if (remote) {
          setProfile((prev) => ({ ...prev, ...remote }))
        }
      } catch (err) {
        console.error('Profile fetch failed', err)
        setMessage('Unable to fetch saved profile right now.')
      } finally {
        setLoadingProfile(false)
      }
    })()
  }, [userEmail, userId, userName])

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setStatus('saving')
    setMessage(null)
    try {
      await saveProfile(userId, profile)
      try {
        window.localStorage.setItem(`luxe_profile_${userId}`, JSON.stringify(profile))
      } catch {
        // ignore storage issues
      }

      try {
        const auth = getAuth(getFirebaseApp())
        if (auth?.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: profile.name,
            photoURL: profile.photoURL || undefined,
          })
          if (profile.email && profile.email !== auth.currentUser.email) {
            try {
              await updateEmail(auth.currentUser, profile.email)
            } catch (err) {
              console.warn('Email update requires reauth', err)
              setMessage('Email saved for preferences. Reauthenticate to update your login email.')
            }
          }
        }
      } catch (authError) {
        console.warn('Auth sync skipped', authError)
      }

      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2600)
    } catch (err) {
      console.error('Profile save failed', err)
      setStatus('error')
      setMessage('Unable to save settings right now.')
    }
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="section-overline">Account</p>
          <h1 className="section-title">Settings & Security</h1>
          <p className="text-brand-gray-400 max-w-2xl">
            Update your profile, tighten security, and keep your contact details current. We sync details to your account when available and fall back to your device when offline.
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
                disabled={status === 'saving' || loadingProfile}
                className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors disabled:opacity-60"
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
                  disabled={status === 'saving' || loadingProfile}
                  className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors disabled:opacity-60"
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
                  disabled={status === 'saving' || loadingProfile}
                  className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors disabled:opacity-60"
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
                <Camera size={18} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Identity</p>
                <p className="text-brand-white font-semibold">Profile portrait</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border border-brand-border/60 bg-brand-card/60 flex items-center justify-center overflow-hidden">
                {profile.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-xl font-semibold text-brand-gold">
                    {(profile.name || 'LUXE').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-sm text-brand-gray-400">
                <p>Refresh your avatar to match your vibe.</p>
                <Link href="/account/security" className="hover-line text-brand-gold text-xs uppercase tracking-[0.25em]">
                  Manage security →
                </Link>
              </div>
            </div>

            <label className="space-y-1 text-sm text-brand-gray-400">
              Profile photo URL
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-brand-gray-500" />
                <input
                  value={profile.photoURL ?? ''}
                  onChange={(e) => handleChange('photoURL', e.target.value)}
                  className="w-full rounded-lg border border-brand-border/60 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gray-600">
                Paste an image URL. Secure updates live on your account.
              </p>
            </label>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-brand-gray-500">
              <Shield size={14} className="text-brand-gold" />
              Password & MFA live under Security.
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className="btn-primary px-6 py-3 text-sm uppercase tracking-[0.3em] disabled:opacity-60"
          >
            {status === 'saving' ? 'Saving…' : 'Save settings'}
          </button>
          {status === 'saved' && (
            <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
              <CheckCircle size={16} className="text-brand-gold" />
              Saved
            </span>
          )}
          {message && (
            <span className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-brand-gray-300'}`}>
              {message}
            </span>
          )}
        </div>
      </div>
    </main>
  )
}
