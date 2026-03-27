'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, Lock, Mail, Shield } from 'lucide-react'
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from 'firebase/auth'
import { useAuth } from '@/contexts/AuthContext'
import { getFirebaseApp } from '@/lib/firebase/client'

export default function SecurityPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?callbackUrl=/account/security')
    }
  }, [loading, router, user])

  const handlePasswordChange = async () => {
    if (!user?.email) {
      setMessage('Email sign-in required to update password.')
      setStatus('error')
      return
    }
    if (!newPassword || newPassword !== confirmPassword) {
      setMessage('Passwords must match.')
      setStatus('error')
      return
    }

    setStatus('saving')
    setMessage(null)

    try {
      const auth = getAuth(getFirebaseApp())
      if (!auth.currentUser) throw new Error('Not authenticated.')
      if (currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
      }
      await updatePassword(auth.currentUser, newPassword)
      setStatus('saved')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Password update failed', err)
      setStatus('error')
      setMessage('Unable to update password. Reauthenticate and try again.')
    }
  }

  const handleResetEmail = async () => {
    if (!user?.email) return
    setStatus('saving')
    setMessage(null)
    try {
      const auth = getAuth(getFirebaseApp())
      await sendPasswordResetEmail(auth, user.email)
      setStatus('saved')
      setMessage('Reset email sent.')
    } catch (err) {
      console.error('Reset email failed', err)
      setStatus('error')
      setMessage('Unable to send reset email right now.')
    }
  }

  if (!loading && !user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-2">
          <p className="section-overline">Account</p>
          <h1 className="section-title">Security</h1>
          <p className="text-brand-gray-400 max-w-2xl">
            Manage authentication, password strength, and session hygiene.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="card-dark border border-brand-border/60 p-6 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                <Clock size={18} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Sessions</p>
                <p className="text-brand-white font-semibold">Last sign-in</p>
              </div>
            </div>
            <p className="text-brand-gray-300">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
            </p>
            <p className="text-brand-gray-500 text-sm">
              Keep your sessions fresh. We recommend signing out on shared devices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="card-dark border border-brand-border/60 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                <Lock size={18} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Credentials</p>
                <p className="text-brand-white font-semibold">Change password</p>
              </div>
            </div>

            <label className="space-y-1 text-sm text-brand-gray-400">
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-dark"
                placeholder="••••••••"
              />
            </label>
            <label className="space-y-1 text-sm text-brand-gray-400">
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-dark"
                placeholder="••••••••"
              />
            </label>
            <label className="space-y-1 text-sm text-brand-gray-400">
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-dark"
                placeholder="••••••••"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handlePasswordChange()}
                disabled={status === 'saving'}
                className="btn-primary px-5 py-2 text-[11px] uppercase tracking-[0.3em] disabled:opacity-60"
              >
                {status === 'saving' ? 'Updating…' : 'Update password'}
              </button>
              <button
                type="button"
                onClick={() => void handleResetEmail()}
                disabled={status === 'saving'}
                className="btn-secondary px-5 py-2 text-[11px] uppercase tracking-[0.3em]"
              >
                <Mail size={14} />
                Send reset email
              </button>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  status === 'error' ? 'text-red-300' : 'text-brand-gray-200'
                }`}
              >
                {status === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                {message}
              </div>
            )}
          </motion.div>
        </div>

        <div className="card-dark border border-brand-border/60 p-5 flex items-center gap-3">
          <Shield size={18} className="text-brand-gold" />
          <div className="text-sm text-brand-gray-300">
            Multi-factor prompts trigger during checkout and risky sign-ins. Keep your email accessible.
          </div>
        </div>
      </div>
    </main>
  )
}
