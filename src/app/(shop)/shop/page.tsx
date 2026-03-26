'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import ProductGrid from '@/components/shop/ProductGrid'
import ProductListItem from '@/components/shop/ProductListItem'
import FiltersSidebar from '@/components/shop/FiltersSidebar'
import ShopToolbar from '@/components/shop/ShopToolbar'
import ActiveFilters from '@/components/shop/ActiveFilters'
import ShopHero from '@/components/shop/ShopHero'
import MobileFilters from '@/components/shop/MobileFilters'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useShopFilters } from '@/hooks/useShopFilters'
import { LOADING_TIMEOUT_MS, PRICE_RANGE } from '@/lib/shop'
import { Product } from '@/types'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const {
    filters,
    searchQuery,
    viewMode,
    filteredProducts,
    hasActiveFilters,
    setSearchQuery,
    setViewMode,
    setSortBy,
    updatePriceRange,
    toggleCategory,
    toggleSize,
    toggleInStock,
    clearFilters,
  } = useShopFilters(products)

  useEffect(() => {
    const controller = new AbortController()
    const safetyTimeout = setTimeout(() => setIsLoading(false), LOADING_TIMEOUT_MS)

    async function loadProducts() {
      try {
        const response = await fetch('/api/products', { signal: controller.signal })
        if (!response.ok) throw new Error('Failed to load products')
        const payload = (await response.json()) as { products: Product[] }
        setProducts(payload.products || [])
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setProducts([])
          setLoadError('Unable to fetch products right now. Please try again soon.')
        }
      } finally {
        setIsLoading(false)
        clearTimeout(safetyTimeout)
      }
    }

    void loadProducts()
    return () => {
      controller.abort()
      clearTimeout(safetyTimeout)
    }
  }, [])

  const onClearSearch = () => setSearchQuery('')

  const productCount = isLoading ? products.length || 0 : filteredProducts.length

  const listContent = () => {
    if (isLoading) {
      return <ProductGridSkeleton count={6} />
    }

    if (loadError) {
      return (
        <EmptyState
          icon={Search}
          title="Something went wrong"
          description={loadError}
          actionLabel="Refresh"
          onAction={() => window.location.reload()}
        />
      )
    }

    if (filteredProducts.length === 0) {
      return (
        <EmptyState
          icon={Search}
          title="No pieces found"
          description="Try adjusting your filters or search to discover what you're looking for."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      )
    }

    if (viewMode === 'grid') {
      return <ProductGrid products={filteredProducts} />
    }

    return (
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <ProductListItem key={product.id} product={product} index={index} />
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <ShopHero
        productCount={productCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 lg:gap-10">
          <FiltersSidebar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onToggleCategory={toggleCategory}
            onToggleSize={toggleSize}
            onToggleStock={toggleInStock}
            onPriceChange={(range) => {
              const clampedMax = Math.min(Math.max(range[1], PRICE_RANGE[0]), PRICE_RANGE[1])
              updatePriceRange([filters.priceRange[0], clampedMax])
            }}
            onClear={clearFilters}
          />

          <div className="flex-1 min-w-0">
            <ShopToolbar
              sortBy={filters.sortBy}
              viewMode={viewMode}
              onSortChange={setSortBy}
              onViewChange={setViewMode}
              onOpenFilters={() => setFiltersOpen(true)}
              hasActiveFilters={hasActiveFilters}
            />

            <ActiveFilters
              categories={filters.categories}
              sizes={filters.sizes}
              searchQuery={searchQuery}
              onClear={clearFilters}
              onRemoveCategory={toggleCategory}
              onRemoveSize={toggleSize}
              onClearSearch={onClearSearch}
            />

            {listContent()}
          </div>
        </div>
      </div>

      <MobileFilters
        open={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onToggleCategory={toggleCategory}
        onToggleSize={toggleSize}
        onApply={() => setFiltersOpen(false)}
        onClear={clearFilters}
      />
    </div>
  )
}
