'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface DynamicSpotlightProps {
  products: Product[]
}

export default function DynamicSpotlight({ products }: DynamicSpotlightProps) {
  const { recentlyViewed } = useRecentlyViewed()
  const { items } = useCart()

  const candidate = useMemo(() => {
    const pool = products || []
    const cartPick = items.find((item) => pool.some((p) => p.id === item.product.id))
    if (cartPick) return cartPick.product

    const recentPick = recentlyViewed.find((item) => pool.some((p) => p.slug === item.slug))
    if (recentPick) return pool.find((p) => p.slug === recentPick.slug)

    const trending = pool.find((p) => p.tags?.includes('trending') || p.tags?.includes('bestseller'))
    return trending || pool[0]
  }, [items, products, recentlyViewed])

  if (!candidate) return null

  const primaryImage = candidate.images?.[0]?.url || ''

  return (
    <section className="bg-brand-darker/80 border-t border-brand-border/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.08),transparent_35%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(201,168,76,0.05),transparent_30%)] pointer-events-none" />

      <div className="container-wide py-14 sm:py-18 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-brand-gold bg-brand-gold/10 border border-brand-gold/25 px-4 py-2 rounded-full">
            <Sparkles size={14} className="animate-breathe" />
            Your Live Edit
          </div>
          <h3 className="text-display-sm font-display font-semibold text-brand-white">
            Because you were eyeing {candidate.name}
          </h3>
          <p className="text-brand-gray-400 leading-relaxed max-w-xl">
            Curated in real-time from your cart, recently viewed, and trending heat so you can keep momentum without searching.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold text-brand-white">{formatPrice(candidate.price)}</span>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-red-300">
              <Flame size={14} className="text-red-400" />
              Hot right now
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {candidate.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-[0.3em] text-brand-gray-500 bg-brand-card/60 border border-brand-border/40 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              prefetch
              href={`/products/${candidate.slug}`}
              className="btn-primary"
            >
              Jump back in
            </Link>
            <Link
              prefetch
              href="/shop"
              className="btn-ghost text-brand-gray-300 hover:text-brand-gold"
            >
              Keep browsing
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-brand-border/60 bg-brand-card shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={candidate.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-card to-brand-muted">
                <span className="text-4xl font-display gold-text tracking-[0.3em] opacity-20">LUXE</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-brand-gray-200 uppercase tracking-[0.25em]">
                  Live spotlight
                </span>
              </div>
              <span className="text-sm text-brand-white font-medium">{candidate.category}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
