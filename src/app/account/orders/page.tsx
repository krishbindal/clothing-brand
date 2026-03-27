'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Order } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login?callbackUrl=/account/orders')
      return
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.uid}`)
        const data = (await res.json()) as { orders?: Order[] }
        setOrders(data.orders || [])
      } catch (err) {
        console.error('Failed to load orders', err)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [loading, router, user])

  if (loading || isLoading) {
    return <div className="min-h-screen bg-brand-black" />
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500 mb-1">Account</p>
            <h1 className="text-3xl font-display font-bold text-brand-white">Your orders</h1>
            <p className="text-brand-gray-500 text-sm mt-2">
              Track your purchases, status, and delivery updates.
            </p>
          </div>
          <Link href="/shop" className="btn-secondary">
            Continue shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card-dark p-6 border border-brand-border/60 space-y-3">
            <p className="text-brand-gray-300 text-sm">No orders yet.</p>
            <p className="text-brand-gray-500 text-sm">
              Once you checkout, receipts and tracking will live here.
            </p>
            <Link href="/shop" className="btn-primary w-fit">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="card-dark p-6 border border-brand-border/50 hover:border-brand-gold/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Order</p>
                    <p className="text-brand-white font-semibold">{order.id}</p>
                    <p className="text-brand-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-brand-gray-400">Total paid</p>
                    <p className="text-xl font-semibold text-brand-white">{formatPrice(order.total)}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-brand-card/50 border border-brand-border/60 text-brand-gray-200">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-brand-border/40 pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm text-brand-gray-300"
                    >
                      <div>
                        <p className="text-brand-white">{item.productName}</p>
                        <p className="text-xs text-brand-gray-500">
                          {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                      </div>
                      <p>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
