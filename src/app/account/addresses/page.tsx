'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Trash2, Star, CheckCircle, Home } from 'lucide-react'
import { Address } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { getDemoOrders } from '@/lib/demoContent'

const emptyAddress: Address = {
  firstName: '',
  lastName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
}

export default function AddressesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?callbackUrl=/account/addresses')
    }
  }, [loading, router, user])

  if (!loading && !user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  if (!user) {
    return <div className="min-h-screen bg-brand-black" />
  }

  return <AddressesContent key={user.uid} userId={user.uid} />
}

function AddressesContent({ userId }: { userId: string }) {
  const storageKey = useMemo(() => `luxe_addresses_${userId}`, [userId])
  type AddressField = Exclude<keyof Address, 'isDefault'>
  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = window.localStorage.getItem(storageKey)
    if (stored) return JSON.parse(stored) as Address[]
    const fallback = getDemoOrders(userId)[0]?.shippingAddress
    return fallback ? [{ ...fallback, isDefault: true }] : []
  })
  const [newAddress, setNewAddress] = useState<Address>(emptyAddress)
  const [showForm, setShowForm] = useState(false)
  const addressFields: { label: string; field: AddressField }[] = [
    { label: 'First name', field: 'firstName' },
    { label: 'Last name', field: 'lastName' },
    { label: 'Address line 1', field: 'line1' },
    { label: 'Address line 2', field: 'line2' },
    { label: 'City', field: 'city' },
    { label: 'State', field: 'state' },
    { label: 'Postal code', field: 'postalCode' },
    { label: 'Country', field: 'country' },
    { label: 'Phone', field: 'phone' },
  ]

  const persist = (next: Address[]) => {
    setAddresses(next)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const handleSave = () => {
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.line1) return
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `addr-${Date.now()}`
    const next: Address[] = [...addresses, { ...newAddress, id, isDefault: addresses.length === 0 }]
    persist(next)
    setNewAddress(emptyAddress)
    setShowForm(false)
  }

  const handleDelete = (id?: string) => {
    const next = addresses.filter((addr) => addr.id !== id)
    persist(next)
  }

  const makeDefault = (id?: string) => {
    const next = addresses.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    persist(next)
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="section-overline">Account</p>
          <h1 className="section-title">Addresses</h1>
          <p className="text-brand-gray-400">Manage shipping destinations for faster checkout.</p>
        </header>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2 text-sm uppercase tracking-[0.25em]"
          >
            <Plus size={16} />
            Add address
          </button>
          <span className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">
            {addresses.length} saved
          </span>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="card-dark border border-brand-border/60 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {addressFields.map(({ label, field }) => (
                <label key={field} className="space-y-1 text-sm text-brand-gray-400">
                  {label}
                  <input
                    value={newAddress[field] ?? ''}
                    onChange={(e) =>
                      setNewAddress((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-brand-border/50 bg-brand-card/60 px-3 py-2 text-brand-white focus:border-brand-gold outline-none transition-colors"
                  />
                </label>
              ))}

              <div className="sm:col-span-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-primary px-5 py-2 text-[11px] uppercase tracking-[0.25em]"
                >
                  Save address
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary px-5 py-2 text-[11px] uppercase tracking-[0.25em]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((address) => (
            <motion.div
              key={address.id || `${address.line1}-${address.postalCode}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="card-dark border border-brand-border/60 p-5 space-y-3 relative"
            >
              {address.isDefault && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.25em] text-brand-gold">
                  <Star size={12} />
                  Default
                </span>
              )}
              <div className="flex items-center gap-2 text-brand-gray-400">
                <MapPin size={16} className="text-brand-gold" />
                <p className="text-sm text-brand-white font-semibold">
                  {address.firstName} {address.lastName}
                </p>
              </div>
              <p className="text-sm text-brand-gray-300">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ''}
              </p>
              <p className="text-sm text-brand-gray-400">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm text-brand-gray-500">{address.country}</p>
              {address.phone && <p className="text-sm text-brand-gray-500">Phone: {address.phone}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => makeDefault(address.id)}
                  className="text-xs uppercase tracking-[0.25em] text-brand-gold inline-flex items-center gap-1"
                >
                  <Home size={14} />
                  Make default
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="text-xs uppercase tracking-[0.25em] text-brand-gray-500 inline-flex items-center gap-1 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}

          {addresses.length === 0 && (
            <div className="md:col-span-2 rounded-lg border border-dashed border-brand-border/60 bg-brand-card/40 p-6 text-brand-gray-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-brand-gold" />
              No addresses yet — add one to speed up checkout.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
