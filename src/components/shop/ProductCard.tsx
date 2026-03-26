'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/types'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatPrice } from '@/lib/utils'
import QuickViewModal from './QuickViewModal'

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const mainImage = product.images?.[0]?.url || '/placeholder.jpg'
  const altText = product.images?.[0]?.alt || product.name
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const inWishlist = product?.id ? isInWishlist(product.id) : false
  const price = Number.isFinite(product.price) ? product.price : 0
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const lowStock = product.inStock && product.stockCount !== undefined && product.stockCount <= 3

  return (
    <div className="group relative">
      <Link
        prefetch
        href={`/products/${product.slug}`}
        className="block w-full overflow-hidden bg-brand-card rounded-lg border border-brand-border/40 transition-all duration-500 hover:border-brand-gold/40 hover:shadow-card-hover"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-dark">
          {mainImage !== '/placeholder.jpg' ? (
            <Image
              src={mainImage}
              alt={altText}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110 will-change-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-brand-muted flex items-center justify-center">
              <span className="text-brand-gray-500 text-sm tracking-widest uppercase">No Image</span>
            </div>
          )}

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {lowStock && (
            <span className="absolute top-4 left-4 z-10 bg-amber-500/90 text-brand-black text-[10px] font-semibold px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
              Low stock
            </span>
          )}

          {product.tags?.includes('trending') && (
            <span className="absolute top-4 right-4 z-10 bg-brand-gold text-brand-black text-[10px] font-semibold px-3 py-1 rounded-sm uppercase tracking-[0.25em] shadow-gold-subtle">
              Trending
            </span>
          )}

          {product.tags?.includes('hot') && (
            <span className="absolute bottom-4 left-4 z-10 bg-red-500/90 text-white text-[10px] font-semibold px-3 py-1 rounded-sm uppercase tracking-[0.25em]">
              Hot Drop
            </span>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-brand-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-brand-white font-medium uppercase tracking-widest text-xs">Sold Out</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg tracking-tight text-brand-white group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
            {product.tags?.includes('new') && (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-brand-gray-400">
                <Sparkles size={12} className="text-brand-gold" />
                New
              </span>
            )}
          </div>
          <p className="text-sm text-brand-gray-400 font-light truncate">{product.category || 'Luxury Goods'}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-brand-white font-medium">{formatPrice(price)}</span>
            {product.comparePrice && (
              <span className="text-brand-gray-500 line-through text-sm">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.colors?.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className="w-3.5 h-3.5 rounded-full border border-brand-border/60"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-brand-gray-500 uppercase tracking-[0.2em]">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
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
        {inWishlist && (
          <motion.span
            layoutId={`wishlist-pulse-${product.id}`}
            className="absolute inset-0 rounded-full bg-brand-gold/10 animate-ping"
            aria-hidden
          />
        )}
      </motion.button>

      <motion.button
        onClick={() => setQuickViewOpen(true)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full border border-brand-border/60 bg-brand-black/80 backdrop-blur-md text-[11px] uppercase tracking-[0.25em] text-brand-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Quick View
      </motion.button>

      {quickViewOpen && (
        <QuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
      )}
    </div>
  )
}
