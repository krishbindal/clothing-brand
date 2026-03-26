'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Product } from '@/types'

interface WishlistContextType {
  wishlistIds: string[]
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => Promise<void>
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

const readLocalWishlist = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('wishlist')
  if (!stored) return []
  try {
    return JSON.parse(stored) as string[]
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return readLocalWishlist()
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      void fetch('/api/wishlist')
        .then(async (response) => {
          if (!response.ok) return []
          const data = (await response.json()) as { productId: string }[]
          return data.map((item) => item.productId)
        })
        .then((ids) => setWishlistIds(ids))
        .catch(() => {
          // Silently fail
        })
    } else {
      const localIds = readLocalWishlist()
      const timeout = window.setTimeout(() => setWishlistIds(localIds), 0)
      return () => window.clearTimeout(timeout)
    }
  }, [session])

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  const toggleWishlist = async (product: Product) => {
    setIsLoading(true)
    const isAdding = !wishlistIds.includes(product.id)

    if (session?.user?.id) {
      try {
        const response = await fetch('/api/wishlist', {
          method: isAdding ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        })

        if (response.ok) {
          setWishlistIds((prev) =>
            isAdding ? [...prev, product.id] : prev.filter((id) => id !== product.id)
          )
        }
      } catch {
        // Handle error silently
      }
    } else {
      const newIds = isAdding
        ? [...wishlistIds, product.id]
        : wishlistIds.filter((id) => id !== product.id)
      setWishlistIds(newIds)
      localStorage.setItem('wishlist', JSON.stringify(newIds))
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
