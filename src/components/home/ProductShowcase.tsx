'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types'

const tabs = ['All', 'New Arrivals', 'Bestsellers', 'Sale']

interface ProductShowcaseProps {
  products: Product[]
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    const stored = localStorage.getItem('featured-tab')
    if (stored && tabs.includes(stored)) {
      Promise.resolve().then(() => setActiveTab(stored))
    }
  }, [])

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'New Arrivals':
        return products.filter((p) => p.tags.includes('new'))
      case 'Bestsellers':
        return products.filter((p) => p.tags.includes('bestseller'))
      case 'Sale':
        return products.filter((p) => Boolean(p.comparePrice))
      default:
        return products
    }
  }, [activeTab, products])

  return (
    <section className="section-padding bg-brand-black relative">
      {/* Background subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-gold/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="section-overline">Featured</p>
            <h2 className="section-title">The Drop</h2>
          </div>

          {/* Tabs — refined pill toggle */}
          <div className="flex gap-1 bg-brand-card/80 rounded-lg p-1 border border-brand-border/40">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  localStorage.setItem('featured-tab', tab)
                }}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-400 ease-luxury relative ${
                  activeTab === tab
                    ? 'bg-brand-gold text-brand-black shadow-[0_2px_8px_rgba(201,168,76,0.3)]'
                    : 'text-brand-gray-400 hover:text-brand-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mt-14"
        >
          <Link
            href="/shop"
            className="btn-secondary group"
          >
            View All Products
            <ArrowRight
              size={15}
              className="transition-transform duration-500 ease-luxury group-hover:translate-x-2"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
