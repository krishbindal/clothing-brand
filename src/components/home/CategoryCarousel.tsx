'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Category } from '@/types'

interface CategoryCarouselProps {
  categories: Category[]
}

const placeholders: Category[] = [
  { id: 'streetwear', name: 'Streetwear', slug: 'streetwear' },
  { id: 'essentials', name: 'Essentials', slug: 'essentials' },
  { id: 'luxury', name: 'Luxury', slug: 'luxury' },
  { id: 'new-drops', name: 'New Drops', slug: 'new-drops' },
]

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const display = categories.length ? categories : placeholders
  const isSkeleton = categories.length === 0

  return (
    <section className="bg-brand-darker/80 border-t border-brand-border/40 py-14 sm:py-16">
      <div className="container-wide flex items-center justify-between mb-6">
        <div className="space-y-2">
          <p className="section-overline">Categories</p>
          <h3 className="text-display-xs font-display font-semibold text-brand-white">
            Curated edits to explore
          </h3>
        </div>
        <Link href="/collections" className="text-sm text-brand-gray-300 hover:text-brand-gold transition-colors hover-line">
          View all collections →
        </Link>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-[320px]">
          {display.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="relative flex-1 min-w-[200px] rounded-xl border border-brand-border/50 bg-gradient-to-br from-brand-card/80 to-brand-dark/60 p-5 hover:border-brand-gold/30 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.08),transparent_45%)] pointer-events-none" />
              <div className="flex flex-col gap-2 relative z-10">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-gray-500">
                  {isSkeleton ? 'Loading' : 'Category'}
                </p>
                <h4 className="text-xl font-display text-brand-white tracking-tight">
                  {category.name}
                </h4>
                <p className="text-sm text-brand-gray-500">
                  {isSkeleton ? 'Curating the perfect edit...' : category.slug}
                </p>
                <Link
                  prefetch
                  href={`/collections/${category.slug || 'curated'}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-brand-gold hover:text-brand-gold-light transition-colors mt-2"
                >
                  Explore
                  <span className="inline-block w-8 h-px bg-brand-gold/50" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
