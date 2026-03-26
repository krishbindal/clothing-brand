'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  startTransition,
} from 'react'
import { Product } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface WishlistContextType {
  wishlistIds: string[]
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => Promise<void>
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const storageKey = useMemo(
    () => (user ? `wishlist:${user.uid}` : 'wishlist:guest'),
    [user],
  )
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(storageKey)
    const guestStored = user ? localStorage.getItem('wishlist:guest') : null
    const legacyStored = !stored ? localStorage.getItem('wishlist') : null

    try {
      if (stored) {
        startTransition(() => setWishlistIds(JSON.parse(stored) as string[]))
        return
      }

      if (guestStored && user) {
        const migrated = JSON.parse(guestStored) as string[]
        startTransition(() => setWishlistIds(migrated))
        localStorage.setItem(storageKey, JSON.stringify(migrated))
        localStorage.removeItem('wishlist:guest')
        return
      }

      if (legacyStored) {
        const migrated = JSON.parse(legacyStored) as string[]
        startTransition(() => setWishlistIds(migrated))
        localStorage.setItem(storageKey, JSON.stringify(migrated))
        localStorage.removeItem('wishlist')
        return
      }
    } catch {
      localStorage.removeItem(storageKey)
    }

    startTransition(() => setWishlistIds([]))
  }, [storageKey, user])

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  const toggleWishlist = async (product: Product) => {
    setIsLoading(true)
    const isAdding = !wishlistIds.includes(product.id)
    const next = isAdding
      ? [...wishlistIds, product.id]
      : wishlistIds.filter((id) => id !== product.id)

    setWishlistIds(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(next))
    }

    setIsLoading(false)
  }

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
