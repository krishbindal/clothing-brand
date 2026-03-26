'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import ProductCard from '@/components/shop/ProductCard'
import { useWishlist } from '@/contexts/WishlistContext'
import { useProducts } from '@/hooks'

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, isLoading: wishlistLoading } = useWishlist()
  const { products, isLoading: productsLoading, error, refetch } = useProducts({
    enabled: wishlistIds.length > 0,
  })

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistIds.includes(product.id)),
    [products, wishlistIds],
  )

  const loading = wishlistLoading || (wishlistIds.length > 0 && productsLoading)

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-black pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-brand-gray-400">Loading wishlist...</div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-brand-black pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={Heart}
            title="Unable to load wishlist"
            description={error}
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart size={32} className="text-brand-gold" fill="currentColor" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-white tracking-tight">
              Wishlist
            </h1>
          </div>
          <p className="text-brand-gray-300 text-lg font-light">
            {products.length > 0
              ? `${products.length} ${products.length === 1 ? 'item' : 'items'} saved for later`
              : 'Your wishlist is empty'}
          </p>
        </motion.div>

        {/* Products Grid */}
        {wishlistProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <ProductCard product={product} />

                {/* Remove Button */}
                <motion.button
                  onClick={(e) => {
                    e.preventDefault()
                    void toggleWishlist(product)
                  }}
                  disabled={wishlistLoading}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-brand-black/80 backdrop-blur-sm rounded-full border border-brand-border hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={16} className="text-brand-white" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Your Wishlist is Empty"
            description="Save your favorite items to your wishlist so you can easily find them later."
            actionLabel="Explore Collections"
            actionHref="/collections"
          />
        )}
      </div>
    </main>
  )
}
