'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye, X } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hoveredImage, setHoveredImage] = useState(0)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)
  const discountPct = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0

  const handleQuickAdd = () => {
    if (!selectedSize) return
    const defaultColor = product.colors?.[0]?.name || 'Default'
    addItem(product, 1, selectedSize, defaultColor)
    setQuickAddOpen(false)
    setSelectedSize('')
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-brand-card">
        {product.images?.length > 0 ? (
          <Image
            src={product.images[hoveredImage]?.url || product.images[0]?.url}
            alt={product.images[hoveredImage]?.alt || product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-card to-brand-muted flex items-center justify-center">
            <ShoppingBag size={32} className="text-brand-gray-600" />
          </div>
        )}

        {/* Hover second image */}
        {product.images?.length > 1 && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onMouseEnter={() => setHoveredImage(1)}
            onMouseLeave={() => setHoveredImage(0)}
          >
            <Image
              src={product.images[1]?.url}
              alt={product.images[1]?.alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.tags?.includes('new') && (
            <span className="bg-brand-gold text-brand-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              New
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">
              -{discountPct}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-brand-muted text-brand-gray-400 text-xs font-medium px-2 py-0.5 rounded uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200',
            inWishlist
              ? 'bg-brand-gold text-brand-black'
              : 'bg-brand-black/50 text-brand-gray-400 opacity-0 group-hover:opacity-100 hover:text-brand-white'
          )}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {product.inStock ? (
            quickAddOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-brand-dark/95 backdrop-blur-sm rounded-lg p-3 border border-brand-border"
              >
                <p className="text-xs text-brand-gray-400 mb-2 font-medium uppercase tracking-wider">Select Size</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.sizes?.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      disabled={!size.available}
                      className={cn(
                        'px-2 py-1 text-xs border rounded transition-all duration-150',
                        selectedSize === size.label
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : size.available
                          ? 'border-brand-border text-brand-gray-300 hover:border-brand-gray-400'
                          : 'border-brand-border/30 text-brand-gray-600 cursor-not-allowed line-through'
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleQuickAdd}
                    disabled={!selectedSize}
                    className="flex-1 btn-primary py-2 text-xs"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setQuickAddOpen(false)}
                    className="p-2 border border-brand-border rounded text-brand-gray-400 hover:text-brand-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); setQuickAddOpen(true) }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-brand-gold text-brand-black text-xs font-semibold py-2.5 rounded uppercase tracking-wide hover:bg-brand-gold-light transition-colors"
                >
                  <ShoppingBag size={14} />
                  Quick Add
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="p-2.5 bg-brand-dark/90 backdrop-blur-sm text-brand-gray-400 hover:text-brand-white border border-brand-border rounded transition-colors"
                >
                  <Eye size={14} />
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center bg-brand-dark/90 backdrop-blur-sm py-2.5 rounded text-sm text-brand-gray-500 border border-brand-border">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-brand-white hover:text-brand-gold transition-colors duration-200 truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-brand-gray-500 mt-0.5 capitalize">{product.category}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-brand-white">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-brand-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
