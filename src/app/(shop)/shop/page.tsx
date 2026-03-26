'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, List, Search, X } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { Product, FilterState, SortOption } from '@/types'

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
      {/* Header */}
      <div className="border-b border-brand-border bg-brand-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-1">Shop</p>
              <h1 className="text-3xl font-display font-bold text-brand-white">All Products</h1>
              <p className="text-brand-gray-500 text-sm mt-1">{filteredProducts.length} pieces</p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 hover:text-brand-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-brand-white uppercase tracking-wider">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-brand-gold hover:text-brand-gold-light">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-xs text-brand-gray-500 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center ${
                          cat === 'All'
                            ? 'border-brand-border'
                            : filters.categories.includes(cat.toLowerCase())
                            ? 'bg-brand-gold border-brand-gold'
                            : 'border-brand-border group-hover:border-brand-gray-400'
                        }`}
                        onClick={() => cat !== 'All' && toggleCategory(cat.toLowerCase())}
                      >
                        {filters.categories.includes(cat.toLowerCase()) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors cursor-pointer ${
                          cat === 'All' || filters.categories.includes(cat.toLowerCase())
                            ? 'text-brand-white'
                            : 'text-brand-gray-400 group-hover:text-brand-gray-300'
                        }`}
                        onClick={() => cat !== 'All' && toggleCategory(cat.toLowerCase())}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="text-xs text-brand-gray-500 uppercase tracking-wider mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 text-xs border rounded transition-all duration-150 ${
                        filters.sizes.includes(size)
                          ? 'bg-brand-gold border-brand-gold text-brand-black font-bold'
                          : 'border-brand-border text-brand-gray-400 hover:border-brand-gray-400 hover:text-brand-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-xs text-brand-gray-500 uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-brand-gray-400">${filters.priceRange[0]}</span>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))
                    }
                    className="flex-1 accent-brand-gold"
                  />
                  <span className="text-sm text-brand-gray-400">${filters.priceRange[1]}</span>
                </div>
              </div>

              {/* In Stock */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded border transition-all duration-150 ${
                    filters.inStock ? 'bg-brand-gold border-brand-gold' : 'border-brand-border'
                  }`}
                  onClick={() => setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))}
                />
                <span className="text-sm text-brand-gray-400">In Stock Only</span>
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
                  <span className="w-4 h-4 bg-brand-gold text-brand-black text-xs rounded-full flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
                  }
                  className="input-dark py-2 text-xs pr-8"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex border border-brand-border rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-brand-gold text-brand-black' : 'text-brand-gray-400 hover:text-brand-white'
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-brand-gold text-brand-black' : 'text-brand-gray-400 hover:text-brand-white'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center mb-4">
                    <Search size={24} className="text-brand-gray-600" />
                  </div>
                  <p className="text-brand-gray-400 font-medium">No products found</p>
                  <p className="text-brand-gray-600 text-sm mt-1">Try adjusting your filters</p>
                  <button onClick={clearFilters} className="btn-secondary mt-4 text-sm">
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredProducts.map((product, i) => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product.id} product={product} priority={i < 4} />
                    ) : (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 card-dark p-4 hover:border-brand-gold/30 transition-colors"
                      >
                        <div className="w-24 h-32 bg-brand-muted rounded flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-medium text-brand-white">{product.name}</h3>
                          <p className="text-brand-gray-500 text-xs mt-0.5 capitalize">{product.category}</p>
                          <p className="text-sm text-brand-gray-400 mt-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-brand-gold font-semibold">${product.price}</span>
                            <button className="btn-primary py-1.5 px-4 text-xs">Add to Cart</button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-brand-dark border-r border-brand-border z-50 overflow-y-auto lg:hidden p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-brand-white font-semibold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X size={20} className="text-brand-gray-400" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs text-brand-gray-500 uppercase tracking-wider mb-3">Category</h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat.toLowerCase())}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          filters.categories.includes(cat.toLowerCase())
                            ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30'
                            : 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-muted'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-brand-gray-500 uppercase tracking-wider mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 text-xs border rounded ${
                          filters.sizes.includes(size)
                            ? 'bg-brand-gold border-brand-gold text-brand-black font-bold'
                            : 'border-brand-border text-brand-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { clearFilters(); setFiltersOpen(false) }} className="btn-secondary w-full">
                  Clear All Filters
                </button>
                <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
