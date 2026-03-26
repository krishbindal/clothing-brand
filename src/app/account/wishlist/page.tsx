'use client'

import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import EmptyState from '@/components/ui/EmptyState'
import { useWishlist } from '@/contexts/WishlistContext'
import { Product } from '@/types'
import { useEffect, useState } from 'react'

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, isLoading } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const allProducts = (await response.json()) as Product[]
          const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id))
          setProducts(wishlistProducts)
        }
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [wishlistIds])

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
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full overflow-hidden bg-brand-card rounded-lg border border-brand-border/40 transition-all duration-500 hover:border-brand-gold/40 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-dark">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-muted flex items-center justify-center">
                        <span className="text-brand-gray-500 text-sm tracking-widest uppercase">
                          No Image
                        </span>
                      </div>
                    )}

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-brand-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-brand-white font-medium uppercase tracking-widest text-xs">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-display text-lg tracking-tight text-brand-white group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-brand-gray-400 font-light truncate">
                      {product.category || 'Luxury Goods'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-brand-white font-medium">${product.price}</span>
                      {product.comparePrice && (
                        <span className="text-brand-gray-500 line-through text-sm">
                          ${product.comparePrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Remove Button */}
                <motion.button
                  onClick={(e) => {
                    e.preventDefault()
                    void toggleWishlist(product)
                  }}
                  disabled={isLoading}
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
