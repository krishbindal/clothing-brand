'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    id: '1',
    name: 'The Shadow Line',
    description: 'Obsidian-dark essentials for the night.',
    slug: 'shadow-line',
    count: 24,
    gradient: 'from-gray-900 to-black',
  },
  {
    id: '2',
    name: 'Golden Hour',
    description: 'Accented pieces that catch the light.',
    slug: 'golden-hour',
    count: 18,
    gradient: 'from-amber-950/50 to-black',
  },
  {
    id: '3',
    name: 'Void Series',
    description: 'Minimal, architectural, and limitless.',
    slug: 'void-series',
    count: 31,
    gradient: 'from-slate-900 to-black',
  },
]

export default function FeaturedCollection() {
  return (
    <section className="section-padding bg-brand-darker">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Collections</p>
          <h2 className="text-display-md font-display font-bold text-brand-white">Curated for the Bold</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link href={`/collections/${col.slug}`} className="group block relative overflow-hidden rounded-xl aspect-[3/4] bg-brand-card">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient}`} />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/5 transition-all duration-500 z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-brand-gold text-xs font-medium uppercase tracking-widest mb-1">{col.count} pieces</p>
                  <h3 className="text-xl font-display font-bold text-brand-white mb-1">{col.name}</h3>
                  <p className="text-brand-gray-400 text-sm mb-3">{col.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-brand-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Explore <ArrowRight size={14} />
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
