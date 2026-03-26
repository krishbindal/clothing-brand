'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Order, User } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'

const ORDER_STATUSES: Order['status'][] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]

type AnalyticsSummary = {
  pageViews: number
  productClicks: number
  addToCart: number
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    pageViews: 0,
    productClicks: 0,
    addToCart: 0,
  })
  const [updating, setUpdating] = useState<string | null>(null)

  const adminEmails =
    typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
          .split(',')
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean)
      : []

  const isAdmin = user?.email && adminEmails.includes(user.email.toLowerCase())

  useEffect(() => {
    if (!isAdmin || loading) return

    const load = async () => {
      try {
        const [ordersRes, usersRes, analyticsRes] = await Promise.all([
          fetch('/api/orders?scope=admin&limit=50'),
          fetch('/api/admin/users'),
          fetch('/api/analytics'),
        ])

        const ordersData = (await ordersRes.json()) as { orders?: Order[] }
        const usersData = (await usersRes.json()) as { users?: User[] }
        const analyticsData = (await analyticsRes.json()) as {
          stats?: AnalyticsSummary
        }

        setOrders(ordersData.orders || [])
        setUsers(usersData.users || [])
        if (analyticsData?.stats) setAnalytics(analyticsData.stats)
      } catch (err) {
        console.error('Admin load failed', err)
      }
    }

    load()
  }, [isAdmin, loading])

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  )

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = (await res.json()) as { order?: Order }
      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order! : o)))
      }
    } catch (err) {
      console.error('Status update failed', err)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <div className="min-h-screen bg-brand-black" />
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="card-dark p-8 text-center space-y-3 max-w-md">
          <p className="text-2xl font-display font-bold text-brand-white">Admin access only</p>
          <p className="text-sm text-brand-gray-500">
            Sign in with an admin email to view orders and analytics.
          </p>
          <Link href="/login" className="btn-primary px-6">
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Admin</p>
            <h1 className="text-3xl font-display font-bold text-brand-white">Control panel</h1>
            <p className="text-brand-gray-500 text-sm mt-2">
              Monitor orders, revenue, and engagement in one place.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-dark p-4 border border-brand-border/50">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Revenue</p>
            <p className="text-2xl font-semibold text-brand-white">{formatPrice(revenue)}</p>
          </div>
          <div className="card-dark p-4 border border-brand-border/50">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Orders</p>
            <p className="text-2xl font-semibold text-brand-white">{orders.length}</p>
          </div>
          <div className="card-dark p-4 border border-brand-border/50">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Users</p>
            <p className="text-2xl font-semibold text-brand-white">{users.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-dark p-4 border border-brand-border/50">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Page views (7d)</p>
            <p className="text-xl font-semibold text-brand-white">{analytics.pageViews}</p>
          </div>
          <div className="card-dark p-4 border border-brand-border/50">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Product clicks (7d)</p>
            <p className="text-xl font-semibold text-brand-white">{analytics.productClicks}</p>
          </div>
          <div className="card-dark p-4 border border-brand-border/50">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Add to cart (7d)</p>
            <p className="text-xl font-semibold text-brand-white">{analytics.addToCart}</p>
          </div>
        </div>

        <div className="card-dark p-6 border border-brand-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-brand-white">Recent orders</h2>
            <span className="text-xs text-brand-gray-500">Last {orders.length} orders</span>
          </div>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-brand-border/40 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-brand-white font-medium">{order.id}</p>
                  <p className="text-xs text-brand-gray-500">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-brand-gray-400">
                    {order.items.length} items · {formatPrice(order.total)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    disabled={updating === order.id}
                    className="input-dark bg-brand-card/60"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <span className="text-brand-gray-500 text-xs">
                    {order.discountAmount && order.discountAmount > 0
                      ? `Discount: -${formatPrice(order.discountAmount)}`
                      : 'No discount'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-6 border border-brand-border/60 space-y-4">
          <h2 className="text-xl font-semibold text-brand-white">Users</h2>
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border border-brand-border/40 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-brand-white">{u.email}</p>
                  <p className="text-xs text-brand-gray-500">{u.name || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-gray-500 uppercase tracking-[0.15em]">
                    {u.role || 'CUSTOMER'}
                  </p>
                  <p className="text-xs text-brand-gray-500">
                    Joined {formatDate(u.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
