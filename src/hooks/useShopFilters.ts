import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_FILTER_STATE } from '@/lib/shop'
import { FilterState, Product, SortOption } from '@/types'

interface UseShopFiltersResult {
  filters: FilterState
  searchQuery: string
  viewMode: 'grid' | 'list'
  filteredProducts: Product[]
  hasActiveFilters: boolean
  setSearchQuery: (query: string) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSortBy: (sortBy: SortOption) => void
  updatePriceRange: (range: [number, number]) => void
  toggleCategory: (category: string) => void
  toggleSize: (size: string) => void
  toggleInStock: () => void
  clearFilters: () => void
}

export function useShopFilters(products: Product[] = []): UseShopFiltersResult {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      )
    }

    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    if (filters.sizes.length > 0) {
      result = result.filter((product) =>
        product.sizes?.some((size) => filters.sizes.includes(size.label) && size.available)
      )
    }

    if (filters.inStock) {
      result = result.filter((product) => product.inStock)
    }

    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    const sorted = [...result]
    switch (filters.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
        break
    }

    return sorted
  }, [filters, products, searchQuery])

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }, [])

  const toggleSize = useCallback((size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }, [])

  const toggleInStock = useCallback(() => {
    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))
  }, [])

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }, [])

  const updatePriceRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
    setSearchQuery('')
  }, [])

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.inStock ||
    !!searchQuery

  return {
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
  }
}
