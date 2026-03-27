'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Receipt, ShieldCheck, ArrowRight } from 'lucide-react'
import { Order } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate, formatPrice } from '@/lib/utils'

export default function BillingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [payments, setPayments] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login?callbackUrl=/account/billing')
      return
    }

    void (async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.uid}&limit=5`)
        const data = (await res.json()) as { orders?: Order[] }
        setPayments(data.orders || [])
      } catch (error) {
        console.error('Failed to load billing', error)
        setPayments([])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [loading, router, user])

  const totals = useMemo(() => {
    if (!payments.length) return { spend: 0, lastPayment: null as Order | null }
    const spend = payments.reduce((acc, order) => acc + order.total, 0)
    const lastPayment = payments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    return { spend, lastPayment }
  }, [payments])

  if (!loading && !user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="section-overline">Account</p>
          <h1 className="section-title">Billing & Payments</h1>
          <p className="text-brand-gray-400">
            Track past charges, confirmation IDs, and payment status. Receipts will appear as soon as you place your first order.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-dark border border-brand-border/60 p-4 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-gray-500">Total spend</p>
            <p className="text-2xl font-semibold text-brand-white">{formatPrice(totals.spend)}</p>
          </div>
          <div className="card-dark border border-brand-border/60 p-4 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-gray-500">Payments</p>
            <p className="text-2xl font-semibold text-brand-white">{payments.length || '—'}</p>
          </div>
          <div className="card-dark border border-brand-border/60 p-4 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-gray-500">Last payment</p>
            <p className="text-lg font-semibold text-brand-white">
              {totals.lastPayment ? formatDate(totals.lastPayment.createdAt) : '—'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-brand-gold" />
              <h2 className="text-lg font-semibold text-brand-white">Payment history</h2>
            </div>
            <button
              type="button"
              onClick={() => router.push('/account/orders')}
              className="text-sm text-brand-gold inline-flex items-center gap-1 hover:text-brand-gold-light"
            >
              View orders <ArrowRight size={14} />
            </button>
          </div>

          {isLoading && (
            <div className="rounded-lg border border-brand-border/60 bg-brand-card/50 p-4 text-brand-gray-400">
              Loading payments...
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3">
              {payments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-lg border border-brand-border/60 bg-brand-card/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                      <Receipt size={18} className="text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-white font-semibold">Payment #{payment.id}</p>
                      <p className="text-xs text-brand-gray-500">{formatDate(payment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-brand-gray-400">Total</p>
                      <p className="text-lg font-semibold text-brand-white">{formatPrice(payment.total)}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.25em] px-2 py-1 rounded-full bg-brand-black/70 border border-brand-border/60 text-brand-gray-200">
                      {payment.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && payments.length === 0 && (
            <div className="rounded-lg border border-dashed border-brand-border/60 bg-brand-card/40 p-6 text-sm text-brand-gray-400 flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-gold" />
              No payments yet. Your receipts will appear here after checkout.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
