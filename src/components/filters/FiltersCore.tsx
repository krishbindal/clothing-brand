'use client'

import { CATEGORIES, PRICE_RANGE, SIZES } from '@/lib/shop'
import { FilterState } from '@/types'

type FiltersVariant = 'desktop' | 'mobile'

interface FiltersCoreProps {
  filters: FilterState
  categories: string[]
  onToggleCategory: (category: string) => void
  onToggleSize: (size: string) => void
  onToggleStock?: () => void
  onPriceChange?: (range: [number, number]) => void
  variant?: FiltersVariant
  showPrice?: boolean
  showStock?: boolean
  showSelectAll?: boolean
}

const variantStyles: Record<
  FiltersVariant,
  {
    categoryButton: string
    categoryActive: string
    categoryInactive: string
    sizeButton: string
    sizeActive: string
    sizeInactive: string
  }
> = {
  desktop: {
    categoryButton: 'block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200',
    categoryActive: 'text-brand-gold bg-brand-gold/8 border border-brand-gold/20',
    categoryInactive: 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-card/60',
    sizeButton: 'h-9 text-xs border rounded-md transition-all duration-200 font-medium',
    sizeActive: 'bg-brand-gold border-brand-gold text-brand-black',
    sizeInactive:
      'border-brand-border text-brand-gray-400 hover:border-brand-gray-400 hover:text-brand-white',
  },
  mobile: {
    categoryButton:
      'block w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200',
    categoryActive: 'bg-brand-gold/10 text-brand-gold border border-brand-gold/25',
    categoryInactive: 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-card',
    sizeButton: 'h-10 text-xs border rounded-md font-medium transition-all duration-200',
    sizeActive: 'bg-brand-gold border-brand-gold text-brand-black',
    sizeInactive: 'border-brand-border text-brand-gray-400 hover:border-brand-gray-400',
  },
}

export default function FiltersCore({
  filters,
  categories,
  onToggleCategory,
  onToggleSize,
  onToggleStock,
  onPriceChange,
  variant = 'desktop',
  showPrice,
  showStock,
  showSelectAll,
}: FiltersCoreProps) {
  const [minPrice, maxPrice] = filters.priceRange
  const categoryOptions = categories.length
    ? categories
    : CATEGORIES.filter((category) => category !== 'all')

  const styles = variantStyles[variant]
  const includePrice = showPrice ?? Boolean(onPriceChange)
  const includeStock = showStock ?? Boolean(onToggleStock)
  const includeSelectAll = showSelectAll ?? false

  const handleSelectAll = () => {
    if (!includeSelectAll || filters.categories.length === 0) return
    filters.categories.forEach((category) => onToggleCategory(category))
  }

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
          Category
        </h3>
        <div className="space-y-1.5">
          {includeSelectAll && (
            <button
              onClick={handleSelectAll}
              className={`${styles.categoryButton} ${
                filters.categories.length === 0
                  ? 'text-brand-white bg-brand-card'
                  : styles.categoryInactive
              }`}
            >
              All
            </button>
          )}
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={`${styles.categoryButton} ${
                filters.categories.includes(category) ? styles.categoryActive : styles.categoryInactive
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
          Size
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onToggleSize(size)}
              className={`${styles.sizeButton} ${
                filters.sizes.includes(size) ? styles.sizeActive : styles.sizeInactive
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {includePrice && onPriceChange && (
        <div>
          <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
            Price Range
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min={PRICE_RANGE[0]}
              max={PRICE_RANGE[1]}
              value={maxPrice}
              onChange={(event) =>
                onPriceChange([minPrice, Number.parseInt(event.target.value, 10)])
              }
              className="w-full accent-brand-gold"
              aria-label="Maximum price"
            />
            <div className="flex justify-between text-xs text-brand-gray-500">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </div>
      )}

      {includeStock && onToggleStock && (
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
              filters.inStock
                ? 'bg-brand-gold border-brand-gold'
                : 'border-brand-border group-hover:border-brand-gray-400'
            }`}
            onClick={onToggleStock}
          >
            {filters.inStock && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5l2 2 4-4"
                  stroke="#0A0A0A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-brand-gray-400 group-hover:text-brand-gray-300 transition-colors">
            In Stock Only
          </span>
        </label>
      )}
    </div>
  )
}
