'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'

interface PersonalizedRailProps {
  fallback: Product[]
  catalog?: Product[]
}

export default function PersonalizedRail({ fallback, catalog }: PersonalizedRailProps) {
  const { recentlyViewed, isLoaded } = useRecentlyViewed()
  const { items } = useCart()
  const hasRecent = isLoaded && recentlyViewed.length > 0
  const pool = catalog && catalog.length > 0 ? catalog : fallback

  const interestSlugs = new Set<string>([
    ...recentlyViewed.map((item) => item.slug),
    ...items.map((item) => item.product.slug),
  ])

  const signals = [
    ...items.flatMap((item) => [item.product.category, ...(item.product.tags || [])]),
    ...pool
      .filter((p) => recentlyViewed.some((rv) => rv.slug === p.slug))
      .flatMap((p) => [p.category, ...(p.tags || [])]),
  ].filter(Boolean)

  const recommendations = pool
    .filter((product) => !interestSlugs.has(product.slug))
    .map((product) => {
      const matches = product.tags?.filter((tag) => signals.includes(tag)) || []
      const categoryHit = signals.includes(product.category)
      const score = matches.length * 3 + (categoryHit ? 2 : 0) + (product.featured ? 1 : 0)
      return { product, score }
    })
    .sort((a, b) => b.score - a.score || Number(b.product.featured) - Number(a.product.featured))
    .slice(0, 6)

  const displayItems = hasRecent
    ? recentlyViewed.slice(0, 6).map((item) => ({
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
      }))
    : (recommendations.length > 0 ? recommendations.map(({ product }) => product) : pool.slice(0, 6)).map(
        (item) => ({
          slug: item.slug,
          name: item.name,
          price: item.price,
          image: item.images?.[0]?.url || '',
        })
      )

  if (!displayItems.length) return null

  const headline = hasRecent
    ? 'Recently viewed'
    : recommendations.length > 0
    ? 'Smarter picks for you'
    : 'Handpicked edits'

  return (
    <section className="section-padding bg-brand-black/90 border-t border-brand-border/30">
      <div className="container-wide flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-card border border-brand-border/40 flex items-center justify-center">
            <Sparkles size={18} className="text-brand-gold" />
          </div>
          <div>
            <p className="section-overline mb-1">{hasRecent ? 'Resume your browse' : 'For You'}</p>
            <h3 className="text-display-xs font-display font-semibold text-brand-white">
              {headline}
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
            <Link prefetch href={`/products/${item.slug}`}>
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
