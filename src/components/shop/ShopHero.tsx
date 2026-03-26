'use client'

import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface ShopHeroProps {
  productCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function ShopHero({ productCount, searchQuery, onSearchChange }: ShopHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-brand-border/30">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-darker via-brand-black to-brand-darker" />
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-brand-gold/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <p className="section-overline">Shop</p>
            <h1 className="text-display-md font-display font-bold text-brand-white">All Products</h1>
            <p className="text-brand-gray-500 text-sm mt-2">
              {productCount} pieces · Curated for you
            </p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" />
            <input
              type="text"
              placeholder="Search the archive..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="input-dark pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 hover:text-brand-white transition-colors duration-200"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
