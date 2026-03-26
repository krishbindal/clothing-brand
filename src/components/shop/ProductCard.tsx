'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [selectedColorName, setSelectedColorName] = useState(product.colors?.[0]?.name || 'Default')
  const [addedFeedback, setAddedFeedback] = useState(false)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)
  const pricingMeta = product.comparePrice
    ? {
      discountPct: getDiscountPercentage(product.price, product.comparePrice),
      savings: product.comparePrice - product.price,
    }
    : { discountPct: 0, savings: 0 }

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    }
  }, [])

  const handleQuickAdd = () => {
    if (!selectedSize) return
    addItem(product, 1, selectedSize, selectedColorName)
    setAddedFeedback(true)
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
    }
    feedbackTimeoutRef.current = setTimeout(() => setAddedFeedback(false), 1500)
    setQuickAddOpen(false)
    setSelectedSize('')
  }

  const selectedSizeData = product.sizes?.find((size) => size.label === selectedSize)
  const lowStock = selectedSizeData?.stockCount && selectedSizeData.stockCount <= 3

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-brand-card">
        {product.images?.length > 0 ? (
          <Image
            src={product.images[hoveredImage]?.url || product.images[0]?.url}
            alt={product.images[hoveredImage]?.alt || product.name}
            fill
            className="object-cover transition-all duration-700 ease-luxury group-hover:scale-[1.06]"
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-card via-brand-muted to-brand-darker flex items-center justify-center">
            <span className="text-2xl font-display gold-text opacity-20 tracking-widest select-none">
              LUXE
            </span>
          </div>
        )}

        {/* Hover second image */}
        {product.images?.length > 1 && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
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

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tags?.includes('new') && (
            <span className="bg-brand-gold text-brand-black text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
              New
            </span>
          )}
          {pricingMeta.discountPct > 0 && (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase">
              -{pricingMeta.discountPct}%
            </span>
          )}
          {pricingMeta.savings > 0 && (
            <span className="bg-brand-gold/90 text-brand-black text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide">
              Save ${pricingMeta.savings}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-brand-muted text-brand-gray-400 text-[10px] font-medium px-2.5 py-1 rounded-sm uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10',
            inWishlist
              ? 'bg-brand-gold text-brand-black'
              : 'bg-brand-black/40 text-brand-gray-400 opacity-0 group-hover:opacity-100 hover:text-brand-white hover:bg-brand-black/60'
          )}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-luxury z-10">
          {product.inStock ? (
            quickAddOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="glass rounded-lg p-3"
              >
                <p className="text-[10px] text-brand-gray-400 mb-2 font-semibold uppercase tracking-[0.2em]">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.sizes?.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      disabled={!size.available}
                      className={cn(
                        'px-2.5 py-1 text-xs border rounded-sm transition-all duration-200',
                        selectedSize === size.label
                          ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                          : size.available
                          ? 'border-brand-border text-brand-gray-300 hover:border-brand-gray-400'
                          : 'border-brand-border/20 text-brand-gray-700 cursor-not-allowed opacity-40 line-through'
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                {lowStock && selectedSizeData && (
                  <p className="text-[10px] text-amber-300 uppercase tracking-wide mb-2">
                    Only {selectedSizeData.stockCount} left in {selectedSize}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleQuickAdd}
                    disabled={!selectedSize}
                    className="flex-1 btn-primary py-2 text-[10px] min-h-9"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setQuickAddOpen(false)}
                    className="p-2 border border-brand-border rounded-sm text-brand-gray-400 hover:text-brand-white transition-colors duration-200"
                  >
                    <X size={13} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); setQuickAddOpen(true) }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-brand-gold text-brand-black text-[11px] font-semibold py-2.5 rounded-sm uppercase tracking-wider hover:bg-brand-gold-light transition-colors duration-300 min-h-10"
                >
                  <ShoppingBag size={13} />
                  Quick Add
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="p-2.5 bg-brand-dark/80 backdrop-blur-md text-brand-gray-400 hover:text-brand-white border border-brand-border/50 rounded-sm transition-colors duration-300"
                >
                  <Eye size={13} />
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center glass py-2.5 rounded-sm text-sm text-brand-gray-500">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3.5 px-0.5">
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center gap-2 mb-2">
            {product.colors.slice(0, 4).map((color) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedColorName(color.name)
                }}
                title={color.name}
                className={cn(
                  'w-3.5 h-3.5 rounded-full border transition-all duration-200',
                  selectedColorName === color.name
                    ? 'border-brand-gold scale-125 shadow-[0_0_6px_rgba(201,168,76,0.4)]'
                    : 'border-brand-border hover:border-brand-gray-400 hover:scale-110'
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-brand-white hover:text-brand-gold transition-colors duration-300 leading-tight truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-brand-gray-500 mt-1 capitalize tracking-wide">{product.category}</p>
        <div className="flex items-center gap-2.5 mt-2">
          <span className="text-sm font-semibold text-brand-white">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-brand-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        {addedFeedback && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-green-400 mt-1.5 uppercase tracking-wide font-medium"
          >
            ✓ Added to cart
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
