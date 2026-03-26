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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist()
    } else {
      const stored = localStorage.getItem('wishlist')
      if (stored) {
        try {
          setWishlistIds(JSON.parse(stored))
        } catch {
          setWishlistIds([])
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function fetchWishlist() {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = (await response.json()) as { productId: string }[]
        setWishlistIds(data.map((item) => item.productId))
      }
    } catch {
      // Silently fail
    }
  }

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
