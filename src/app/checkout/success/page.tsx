'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function SuccessContent() {
  const params = useSearchParams()
  const orderId = params.get('orderId')
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 rounded-full border border-brand-border/60 bg-brand-card/40 px-4 py-2 text-brand-gray-300 text-sm"
        >
          <Sparkles size={16} className="text-brand-gold" />
          Payment confirmed — your order is locked in
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="card-dark border border-brand-border/60 p-10 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-brand-white">
            <CheckCircle2 size={28} className="text-emerald-400" />
            <h1 className="text-2xl font-display font-semibold">Order received</h1>
          </div>
          <p className="text-brand-gray-400 max-w-2xl mx-auto leading-relaxed">
            We&apos;re queuing your pieces for dispatch. A confirmation email will arrive shortly
            with full details and live tracking once it ships.
          </p>
          {orderId && (
            <p className="text-brand-gray-300 text-sm">
              Reference: <span className="text-brand-white font-semibold">{orderId}</span>
            </p>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop" className="btn-secondary">
            Continue shopping
          </Link>
          <Link
            href={user ? '/account/orders' : '/login?callbackUrl=/account/orders'}
            className="btn-primary"
          >
            View my orders
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="w-full max-w-3xl space-y-4">
            <div className="h-4 w-48 bg-brand-card/60 rounded-full animate-pulse mx-auto" />
            <div className="h-32 bg-brand-card/50 rounded-2xl animate-pulse" />
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
