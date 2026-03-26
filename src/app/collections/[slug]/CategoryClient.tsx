'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Product, SortOption } from '@/types'
import ProductGrid from '@/components/shop/ProductGrid'
import { SlidersHorizontal } from 'lucide-react'

interface CategoryClientProps {
  products: Product[]
  categoryName?: string
}

export default function CategoryClient({ products }: CategoryClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(10000)
  const [showFilters, setShowFilters] = useState(false)

  // Calculate price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 }
    const prices = products.map((p) => p.price)
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => p.price >= minPrice && p.price <= maxPrice)

    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price)
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return filtered
    }
  }, [products, sortBy, minPrice, maxPrice])

  return (
    <div>
      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10 p-6 bg-brand-card border border-brand-border rounded-lg"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-brand-gold" />
          <span className="text-brand-gray-400 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-brand-dark text-brand-white text-sm border border-brand-border rounded-sm focus:outline-none focus:border-brand-gold transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Price Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-brand-dark text-brand-white text-sm border border-brand-border rounded-sm hover:border-brand-gold transition-colors"
          >
            Price Filter
          </button>
        </div>
      </motion.div>

      {/* Price Range Filter */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-brand-card border border-brand-border rounded-lg"
        >
          <h3 className="text-brand-white font-medium mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="text-brand-gray-400 text-xs mb-1 block">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(priceRange.min, parseInt(e.target.value) || 0))}
                  min={priceRange.min}
                  max={maxPrice}
                  className="w-full px-3 py-2 bg-brand-dark text-brand-white text-sm border border-brand-border rounded-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
              <div className="flex-1">
                <label className="text-brand-gray-400 text-xs mb-1 block">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.min(priceRange.max, parseInt(e.target.value) || 10000))}
                  min={minPrice}
                  max={priceRange.max}
                  className="w-full px-3 py-2 bg-brand-dark text-brand-white text-sm border border-brand-border rounded-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-brand-gray-500">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  )
}
