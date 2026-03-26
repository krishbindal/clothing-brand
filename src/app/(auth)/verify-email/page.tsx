'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending')

  useEffect(() => {
    if (token) {
      setStatus('loading')
      fetch(`/api/auth/verify-email?token=${token}`)
        .then((r) => r.json())
        .then((data: { success?: boolean }) => {
          if (data.success) {
            setStatus('success')
            setTimeout(() => router.push('/login'), 3000)
          } else {
            setStatus('error')
          }
        })
        .catch(() => setStatus('error'))
    }
  }, [token, router])

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <Link href="/" className="text-3xl font-display font-bold tracking-[0.3em] gold-text">LUXE</Link>
        <div className="card-dark p-10 mt-8 space-y-6">
          {status === 'pending' && (
            <>
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto"><Mail size={28} className="text-brand-gold" /></div>
              <div>
                <h1 className="text-xl font-semibold text-brand-white mb-2">Check your inbox</h1>
                <p className="text-brand-gray-400 text-sm leading-relaxed">We sent a verification link to <strong className="text-brand-white">{email || 'your email'}</strong>. Click the link to activate your account.</p>
              </div>
              <p className="text-brand-gray-600 text-xs">Didn&apos;t receive the email? Check your spam folder or{' '}<button className="text-brand-gold hover:text-brand-gold-light underline underline-offset-2">resend it</button></p>
            </>
          )}
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto"><span className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" /></div>
              <p className="text-brand-gray-400">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={28} className="text-green-400" /></motion.div>
              <div>
                <h1 className="text-xl font-semibold text-brand-white mb-2">Email verified!</h1>
                <p className="text-brand-gray-400 text-sm">Your account is now active. Redirecting to sign in...</p>
              </div>
              <Link href="/login" className="btn-primary inline-flex">Sign In Now <ArrowRight size={16} /></Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto"><XCircle size={28} className="text-red-400" /></div>
              <div>
                <h1 className="text-xl font-semibold text-brand-white mb-2">Verification failed</h1>
                <p className="text-brand-gray-400 text-sm">The verification link may be expired or already used. Please try again.</p>
              </div>
              <Link href="/signup" className="btn-secondary inline-flex">Back to Sign Up</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-black" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
