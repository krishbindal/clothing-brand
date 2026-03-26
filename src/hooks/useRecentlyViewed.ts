import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Product } from '@/types'

const MAX_RECENTLY_VIEWED = 10
const STORAGE_KEY = 'luxe_recently_viewed'

interface RecentlyViewedProduct {
  id: string
  slug: string
  name: string
  price: number
  image: string
  viewedAt: string
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed, , isLoaded] = useLocalStorage<RecentlyViewedProduct[]>(
    STORAGE_KEY,
    []
  )

  const addProduct = useCallback(
    (product: Product) => {
      if (!product || !product.id) return

      const newProduct: RecentlyViewedProduct = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
        viewedAt: new Date().toISOString(),
      }

      setRecentlyViewed((prev) => {
        // Remove if already exists
        const filtered = prev.filter((p) => p.id !== product.id)
        // Add to beginning
        const updated = [newProduct, ...filtered]
        // Keep only MAX_RECENTLY_VIEWED items
        return updated.slice(0, MAX_RECENTLY_VIEWED)
      })
    },
    [setRecentlyViewed]
  )

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([])
  }, [setRecentlyViewed])

  const removeProduct = useCallback(
    (productId: string) => {
      setRecentlyViewed((prev) => prev.filter((p) => p.id !== productId))
    },
    [setRecentlyViewed]
  )

  return {
    recentlyViewed,
    addProduct,
    clearRecentlyViewed,
    removeProduct,
    isLoaded,
  }
}
