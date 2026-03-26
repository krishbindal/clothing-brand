'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, LayoutList, Search, X, ChevronDown, Sparkles } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { Product, FilterState, SortOption } from '@/types'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

// Sample data - in production this comes from Sanity/DB
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Obsidian Oversized Tee', slug: 'obsidian-oversized-tee',
    description: 'Premium heavyweight cotton.', price: 89, comparePrice: 120,
    images: [{ url: '', alt: 'Obsidian Tee', width: 800, height: 1000 }],
    category: 'tops', sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
    colors: [{ name: 'Black', hex: '#0A0A0A', available: true }], materials: ['Cotton'],
    inStock: true, tags: ['new'], featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', name: 'Shadow Cargo Pants', slug: 'shadow-cargo-pants',
    description: 'Technical cargo with deep pockets.', price: 195,
    images: [{ url: '', alt: 'Cargo Pants', width: 800, height: 1000 }],
    category: 'bottoms', sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
    colors: [{ name: 'Black', hex: '#111', available: true }, { name: 'Slate', hex: '#334155', available: true }],
    materials: ['Polyester', 'Cotton'], inStock: true, tags: ['bestseller'], featured: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', name: 'Void Hoodie', slug: 'void-hoodie',
    description: 'Ultra-soft fleece interior.', price: 245, comparePrice: 295,
    images: [{ url: '', alt: 'Void Hoodie', width: 800, height: 1000 }],
    category: 'tops', sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: true }],
    colors: [{ name: 'Void Black', hex: '#080808', available: true }], materials: ['Cotton', 'Polyester'],
    inStock: true, tags: ['bestseller'], featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '4', name: 'Eclipse Jacket', slug: 'eclipse-jacket',
    description: 'Structured outerwear with gold hardware.', price: 425,
    images: [{ url: '', alt: 'Eclipse Jacket', width: 800, height: 1000 }],
    category: 'outerwear', sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: false }],
    colors: [{ name: 'Black', hex: '#0A0A0A', available: true }], materials: ['Wool', 'Silk'],
    inStock: true, tags: ['limited'], featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '5', name: 'Dark Matter Shorts', slug: 'dark-matter-shorts',
    description: 'Lightweight technical shorts.', price: 125,
    images: [{ url: '', alt: 'Dark Matter Shorts', width: 800, height: 1000 }],
    category: 'bottoms', sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
    colors: [{ name: 'Black', hex: '#111', available: true }], materials: ['Nylon'],
    inStock: true, tags: ['new'], featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '6', name: 'Noir Long Sleeve', slug: 'noir-long-sleeve',
    description: 'Extended-length luxury longsleeve.', price: 115,
    images: [{ url: '', alt: 'Noir Long Sleeve', width: 800, height: 1000 }],
    category: 'tops', sizes: [{ label: 'XS', available: true }, { label: 'S', available: false }, { label: 'M', available: true }],
    colors: [{ name: 'Black', hex: '#0A0A0A', available: true }], materials: ['Cotton'],
    inStock: true, tags: [], featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 1000],
    inStock: false,
    sortBy: 'featured',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...SAMPLE_PRODUCTS]

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category))
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes?.some((s) => filters.sizes.includes(s.label) && s.available)
      )
    }

    if (filters.inStock) {
      result = result.filter((p) => p.inStock)
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return result
  }, [filters, searchQuery])

  const toggleCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 1000],
      inStock: false,
      sortBy: 'featured',
    })
    setSearchQuery('')
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.inStock ||
    !!searchQuery

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Shop Header — cinematic banner */}
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
              <h1 className="text-display-md font-display font-bold text-brand-white">
                All Products
              </h1>
              <p className="text-brand-gray-500 text-sm mt-2">
                {filteredProducts.length} pieces · Curated for you
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" />
              <input
                type="text"
                placeholder="Search the archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 hover:text-brand-white transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 lg:gap-10">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-brand-white uppercase tracking-[0.2em]">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-[11px] text-brand-gold hover:text-brand-gold-light transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">Category</h3>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => cat !== 'All' && toggleCategory(cat.toLowerCase())}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        cat === 'All' && filters.categories.length === 0
                          ? 'text-brand-white bg-brand-card'
                          : filters.categories.includes(cat.toLowerCase())
                          ? 'text-brand-gold bg-brand-gold/8 border border-brand-gold/20'
                          : 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-card/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">Size</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`h-9 text-xs border rounded-md transition-all duration-200 font-medium ${
                        filters.sizes.includes(size)
                          ? 'bg-brand-gold border-brand-gold text-brand-black'
                          : 'border-brand-border text-brand-gray-400 hover:border-brand-gray-400 hover:text-brand-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
                  Price Range
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))
                    }
                    className="w-full accent-brand-gold"
                  />
                  <div className="flex justify-between text-xs text-brand-gray-500">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* In Stock */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    filters.inStock ? 'bg-brand-gold border-brand-gold' : 'border-brand-border group-hover:border-brand-gray-400'
                  }`}
                  onClick={() => setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))}
                >
                  {filters.inStock && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-brand-gray-400 group-hover:text-brand-gray-300 transition-colors">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 btn-secondary py-2 px-3 text-xs"
              >
                <SlidersHorizontal size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="w-4 h-4 bg-brand-gold text-brand-black text-[10px] rounded-full flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
                    }
                    className="input-dark py-2 text-xs pr-8 appearance-none cursor-pointer min-w-[160px]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex border border-brand-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === 'grid' ? 'bg-brand-gold text-brand-black' : 'text-brand-gray-500 hover:text-brand-white'
                    }`}
                  >
                    <Grid3X3 size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === 'list' ? 'bg-brand-gold text-brand-black' : 'text-brand-gray-500 hover:text-brand-white'
                    }`}
                  >
                    <LayoutList size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-5"
              >
                {filters.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-3 py-1 hover:bg-brand-gold/20 transition-colors"
                  >
                    {cat}
                    <X size={12} />
                  </button>
                ))}
                {filters.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className="inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-3 py-1 hover:bg-brand-gold/20 transition-colors"
                  >
                    {size}
                    <X size={12} />
                  </button>
                ))}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-3 py-1 hover:bg-brand-gold/20 transition-colors"
                  >
                    &quot;{searchQuery}&quot;
                    <X size={12} />
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand-gray-500 hover:text-brand-white transition-colors underline underline-offset-2"
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {/* Products */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : (
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-28 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mb-5">
                    <Search size={28} className="text-brand-gray-600" />
                  </div>
                  <p className="text-brand-gray-300 font-medium text-lg">No pieces found</p>
                  <p className="text-brand-gray-600 text-sm mt-1.5 max-w-sm">
                    Try adjusting your filters or search to discover what you&apos;re looking for.
                  </p>
                  <button onClick={clearFilters} className="btn-secondary mt-6">
                    Clear All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${viewMode}-${filters.sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                      : 'flex flex-col gap-3'
                  }
                >
                  {filteredProducts.map((product, i) => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product.id} product={product} priority={i < 4} />
                    ) : (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="group flex gap-5 card-dark p-4 hover:border-brand-gold/20 transition-all duration-400"
                      >
                        <Link href={`/products/${product.slug}`} className="w-28 h-36 bg-gradient-to-br from-brand-card to-brand-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <span className="text-sm font-display gold-text opacity-20 tracking-widest">LUXE</span>
                        </Link>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="font-medium text-brand-white hover:text-brand-gold transition-colors duration-300">{product.name}</h3>
                            </Link>
                            <p className="text-brand-gray-500 text-xs mt-0.5 capitalize">{product.category}</p>
                            <p className="text-sm text-brand-gray-400 mt-2 line-clamp-2">{product.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-brand-white font-semibold">{formatPrice(product.price)}</span>
                              {product.comparePrice && (
                                <span className="text-xs text-brand-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                              )}
                            </div>
                            <Link href={`/products/${product.slug}`} className="btn-primary py-1.5 px-5 text-[10px]">
                              View
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-brand-dark border-r border-brand-border/30 z-50 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-brand-border/30">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-brand-gold" />
                  <h2 className="text-brand-white font-semibold text-sm tracking-wide">Filters</h2>
                </div>
                <button onClick={() => setFiltersOpen(false)} className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-7">
                <div>
                  <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">Category</h3>
                  <div className="space-y-1.5">
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat.toLowerCase())}
                        className={`block w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                          filters.categories.includes(cat.toLowerCase())
                            ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/25'
                            : 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-card'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">Size</h3>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`h-10 text-xs border rounded-md font-medium transition-all duration-200 ${
                          filters.sizes.includes(size)
                            ? 'bg-brand-gold border-brand-gold text-brand-black'
                            : 'border-brand-border text-brand-gray-400 hover:border-brand-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t border-brand-border/30">
                  <button onClick={() => { clearFilters(); setFiltersOpen(false) }} className="btn-secondary w-full text-xs">
                    Clear All Filters
                  </button>
                  <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full text-xs">
                    <Sparkles size={13} />
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
