'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import { Product } from '@/types'
import ProductGrid from '@/components/shop/ProductGrid'
import EmptyState from '@/components/ui/EmptyState'
import { searchProducts } from '@/lib/sanity'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setProducts([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const results = await searchProducts(searchQuery)
      setProducts(results)
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  return (
    <main className="min-h-screen bg-brand-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-white mb-6 tracking-tight">
            Search
          </h1>
          <p className="text-brand-gray-300 text-lg max-w-2xl mx-auto font-light">
            Discover your next favorite piece
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-gray-500"
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full pl-14 pr-14 py-5 bg-brand-card border border-brand-border text-brand-white placeholder-brand-gray-500 rounded-lg focus:outline-none focus:border-brand-gold transition-all duration-400 text-lg"
              autoFocus
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-dark rounded-full transition-colors"
                >
                  <X size={20} className="text-brand-gray-500" />
                </motion.button>
              )}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-14 top-1/2 -translate-y-1/2"
              >
                <Loader2 size={20} className="text-brand-gold animate-spin" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={40} className="text-brand-gold animate-spin" />
                <p className="text-brand-gray-400 text-sm">Searching...</p>
              </div>
            </motion.div>
          ) : hasSearched && products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <EmptyState
                icon={SearchIcon}
                title="No Results Found"
                description={`We couldn&apos;t find any products matching &quot;${query}&quot;. Try a different search term or browse our collections.`}
                actionLabel="Browse Collections"
                actionHref="/collections"
              />
            </motion.div>
          ) : hasSearched && products.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8">
                <p className="text-brand-gray-400 text-sm">
                  Found <span className="text-brand-white font-medium">{products.length}</span>{' '}
                  {products.length === 1 ? 'result' : 'results'} for{' '}
                  <span className="text-brand-white font-medium">&quot;{query}&quot;</span>
                </p>
              </div>
              <ProductGrid products={products} />
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-brand-gray-500 text-lg">
                Start typing to search our collection
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
