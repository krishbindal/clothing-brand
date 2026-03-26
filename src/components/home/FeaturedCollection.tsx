'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    id: '1',
    name: 'The Shadow Line',
    description: 'Obsidian-dark essentials. Crafted for the night.',
    slug: 'shadow-line',
    count: 24,
    gradient: 'from-gray-900 via-gray-800/50 to-black',
    accentColor: 'rgba(180, 180, 190, 0.15)',
  },
  {
    id: '2',
    name: 'Golden Hour',
    description: 'Accented pieces that catch and hold the light.',
    slug: 'golden-hour',
    count: 18,
    gradient: 'from-amber-950/60 via-amber-900/20 to-black',
    accentColor: 'rgba(201, 168, 76, 0.15)',
  },
  {
    id: '3',
    name: 'Void Series',
    description: 'Minimal. Architectural. Without limit.',
    slug: 'void-series',
    count: 31,
    gradient: 'from-slate-900 via-slate-800/30 to-black',
    accentColor: 'rgba(100, 116, 139, 0.15)',
  },
]

interface FeaturedCollectionProps {
  title?: string
  items?: Array<{
    _id: string
    title: string
    slug: string
    description: string
    productCount: number
  }>
}

export default function FeaturedCollection({ title, items }: FeaturedCollectionProps) {
  const content = items?.length
    ? items.map((item) => ({
      id: item._id,
      name: item.title,
      description: item.description,
      slug: item.slug,
      count: item.productCount,
      gradient: 'from-gray-900 via-gray-800/50 to-black',
      accentColor: 'rgba(180, 180, 190, 0.15)',
    }))
    : collections

  return (
    <section className="section-padding bg-brand-darker relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="section-overline">Collections</p>
          <h2 className="section-title">{title || 'Curated for the Bold'}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {content.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/collections/${col.slug}`}
                className="group block relative overflow-hidden rounded-xl aspect-[3/4] bg-brand-card"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} transition-transform duration-700 ease-luxury group-hover:scale-105`} />

                {/* Accent radial glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 60%, ${col.accentColor}, transparent 60%)`,
                  }}
                />

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent z-10" />

                {/* Gold shimmer on hover */}
                <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/[0.03] transition-all duration-700 z-10" />

                {/* Decorative corner accent */}
                <div className="absolute top-6 right-6 z-20 w-8 h-8 border-t border-r border-brand-gold/0 group-hover:border-brand-gold/30 transition-all duration-700 ease-luxury" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
                  <p className="text-brand-gold/80 text-[10px] font-semibold uppercase tracking-[0.3em] mb-2">
                    {col.count} pieces
                  </p>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-brand-white mb-1.5 group-hover:translate-x-1 transition-transform duration-500 ease-luxury">
                    {col.name}
                  </h3>
                  <p className="text-brand-gray-400 text-sm leading-relaxed mb-4 max-w-[90%]">
                    {col.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-brand-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                    Explore Collection
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
