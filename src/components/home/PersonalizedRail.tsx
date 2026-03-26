'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'

interface PersonalizedRailProps {
  fallback: Product[]
}

export default function PersonalizedRail({ fallback }: PersonalizedRailProps) {
  const { recentlyViewed, isLoaded } = useRecentlyViewed()
  const hasRecent = isLoaded && recentlyViewed.length > 0

  const displayItems = hasRecent
    ? recentlyViewed.slice(0, 6).map((item) => ({
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
      }))
    : fallback.slice(0, 6).map((item) => ({
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.images?.[0]?.url || '',
      }))

  if (!displayItems.length) return null

  return (
    <section className="section-padding bg-brand-black/90 border-t border-brand-border/30">
      <div className="container-wide flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-card border border-brand-border/40 flex items-center justify-center">
            <Sparkles size={18} className="text-brand-gold" />
          </div>
          <div>
            <p className="section-overline mb-1">For You</p>
            <h3 className="text-display-xs font-display font-semibold text-brand-white">
              {hasRecent ? 'Recently viewed' : 'Handpicked edits'}
            </h3>
          </div>
        </div>
        <Link href="/shop" className="text-sm text-brand-gray-400 hover:text-brand-gold transition-colors hover-line">
          Continue exploring →
        </Link>
      </div>

      <div className="container-wide grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayItems.map((item, idx) => (
          <motion.div
            key={item.slug + idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.03 }}
            className="group rounded-lg border border-brand-border/40 bg-brand-card/70 overflow-hidden hover:border-brand-gold/40 transition-colors duration-300"
          >
            <Link href={`/products/${item.slug}`}>
              <div className="relative aspect-[4/5] bg-brand-dark overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 15vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-card to-brand-muted">
                    <span className="text-xs font-display gold-text opacity-25 tracking-[0.3em]">LUXE</span>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium text-brand-white line-clamp-1 group-hover:text-brand-gold transition-colors">
                  {item.name}
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">
                  {formatPrice(item.price)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
