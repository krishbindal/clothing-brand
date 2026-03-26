import { FilterState, SortOption } from '@/types'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export const CATEGORIES = ['all', 'tops', 'bottoms', 'outerwear', 'accessories'] as const
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export const PRICE_RANGE: [number, number] = [0, 1000]
export const LOADING_TIMEOUT_MS = 3000

export const DEFAULT_FILTER_STATE: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  priceRange: PRICE_RANGE,
  inStock: false,
  sortBy: 'featured',
}
