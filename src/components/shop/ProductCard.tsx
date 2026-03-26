'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Product } from '@/types'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const mainImage = product.images?.[0]?.url || '/placeholder.jpg'
  const altText = product.images?.[0]?.alt || product.name
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const inWishlist = product?.id ? isInWishlist(product.id) : false
  const price = Number.isFinite(product.price) ? product.price : 0

  return (
    <div className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="block w-full overflow-hidden bg-brand-card rounded-lg border border-brand-border/40 transition-all duration-500 hover:border-brand-gold/40 hover:shadow-card-hover"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-dark">
          {mainImage !== '/placeholder.jpg' ? (
            <Image
              src={mainImage}
              alt={altText}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-brand-muted flex items-center justify-center">
              <span className="text-brand-gray-500 text-sm tracking-widest uppercase">No Image</span>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-brand-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-brand-white font-medium uppercase tracking-widest text-xs">Sold Out</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h3 className="font-display text-lg tracking-tight text-brand-white group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-brand-gray-400 font-light truncate">{product.category || 'Luxury Goods'}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-brand-white font-medium">{formatPrice(price)}</span>
            {product.comparePrice && (
              <span className="text-brand-gray-500 line-through text-sm">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <motion.button
        onClick={(e) => {
          e.preventDefault()
          if (product?.id) {
            void toggleWishlist(product)
          }
        }}
        disabled={isLoading}
        className="absolute top-4 right-4 z-10 p-2.5 bg-brand-black/80 backdrop-blur-sm rounded-full border border-brand-border hover:border-brand-gold transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart
          size={16}
          className={`transition-colors duration-300 ${
            inWishlist ? 'text-brand-gold fill-brand-gold' : 'text-brand-white'
          }`}
        />
      </motion.button>
    </div>
  )
}
