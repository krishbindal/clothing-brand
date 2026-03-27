'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, LogOut, ShoppingBag, Sparkles, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useProducts } from '@/hooks'
import { Order } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { products: featuredProducts } = useProducts({ featured: true, limit: 4, enabled: Boolean(user) })

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login?callbackUrl=/account')
      return
    }

    const loadOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.uid}&limit=3`)
        const data = (await res.json()) as { orders?: Order[] }
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Failed to load orders', error)
      } finally {
        setIsLoading(false)
      }
    }

    void loadOrders()
  }, [loading, router, user])

  if (!loading && !user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 card-dark border border-brand-border/60 p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                <User size={22} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Account</p>
                <h1 className="text-2xl font-display font-semibold text-brand-white">
                  {user?.name || 'Welcome back'}
                </h1>
                <p className="text-brand-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/account/orders" className="rounded-lg border border-brand-border/50 bg-brand-card/60 p-4 hover:border-brand-gold/30 transition-colors">
                <div className="flex items-center gap-2 text-brand-gray-400 text-xs uppercase tracking-[0.2em]">
                  <ShoppingBag size={16} />
                  Orders
                </div>
                <p className="text-brand-white font-semibold mt-2">{orders.length || '—'}</p>
                <p className="text-brand-gray-500 text-xs">Recent history</p>
              </Link>
              <Link href="/account/wishlist" className="rounded-lg border border-brand-border/50 bg-brand-card/60 p-4 hover:border-brand-gold/30 transition-colors">
                <div className="flex items-center gap-2 text-brand-gray-400 text-xs uppercase tracking-[0.2em]">
                  <Sparkles size={16} />
                  Wishlist
                </div>
                <p className="text-brand-white font-semibold mt-2">Curate</p>
                <p className="text-brand-gray-500 text-xs">Saved picks</p>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                Shop the drop
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => void logout()}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-dark border border-brand-border/60 p-6 space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Live updates</p>
            <div className="text-brand-white text-lg font-semibold">🔥 12 people viewing your saved pieces</div>
            <p className="text-brand-gray-400 text-sm">Stay ahead of the queue. Stock moves fast.</p>
            <Link href="/account/wishlist" className="text-brand-gold text-sm inline-flex items-center gap-1 hover:text-brand-gold-light">
              View wishlist
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-overline">Orders</p>
              <h2 className="section-title">Recent activity</h2>
            </div>
            <Link href="/account/orders" className="text-sm text-brand-gray-400 hover:text-brand-gold transition-colors hover-line">
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading && (
              <div className="rounded-lg border border-brand-border/60 bg-brand-card/50 p-5 text-brand-gray-400">
                Fetching your orders...
              </div>
            )}

            {!isLoading && orders.length === 0 && (
              <div className="rounded-lg border border-brand-border/60 bg-brand-card/50 p-5 text-brand-gray-400">
                No orders yet. Your next drop awaits.
              </div>
            )}

            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-brand-border/60 bg-brand-card/60 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">Order</p>
                  <p className="text-brand-white font-semibold">{order.id}</p>
                  <p className="text-brand-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-gray-400">Total</p>
                  <p className="text-xl font-semibold text-brand-white">{formatPrice(order.total)}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-card/50 border border-brand-border/60 text-brand-gray-200 uppercase tracking-[0.15em]">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-overline">For You</p>
              <h2 className="section-title">Handpicked edits</h2>
            </div>
            <Link href="/shop" className="text-sm text-brand-gray-400 hover:text-brand-gold transition-colors hover-line">
              Continue shopping →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-brand-border/40 bg-brand-card/70 overflow-hidden"
                >
                  <div className="aspect-[4/5] bg-brand-dark/60 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-1/2 bg-brand-border/40 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-brand-border/30 rounded animate-pulse" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
