'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import { logEvent } from '@/lib/analytics'

interface ProductListItemProps {
  product: Product
  index: number
}

export default function ProductListItem({ product, index }: ProductListItemProps) {
  const handleClick = () =>
    logEvent('PRODUCT_CLICK', {
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      productId: product.id,
      metadata: { price: product.price, category: product.category },
    }).catch(() => null)

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex gap-5 card-dark p-4 hover:border-brand-gold/20 transition-all duration-400"
    >
      <Link
        prefetch
        href={`/products/${product.slug}`}
        onClick={handleClick}
        className="w-28 h-36 bg-gradient-to-br from-brand-card to-brand-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
      >
        <span className="text-sm font-display gold-text opacity-20 tracking-widest">LUXE</span>
      </Link>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <Link prefetch href={`/products/${product.slug}`} onClick={handleClick}>
            <h3 className="font-medium text-brand-white hover:text-brand-gold transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          <p className="text-brand-gray-500 text-xs mt-0.5 capitalize">{product.category}</p>
          <p className="text-sm text-brand-gray-400 mt-2 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-brand-white font-semibold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-brand-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <Link
            prefetch
            href={`/products/${product.slug}`}
            onClick={handleClick}
            className="btn-primary py-1.5 px-5 text-[10px]"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
