'use client'

import { CATEGORIES, PRICE_RANGE, SIZES } from '@/lib/shop'
import { FilterState } from '@/types'

interface FiltersSidebarProps {
  filters: FilterState
  hasActiveFilters: boolean
  onToggleCategory: (category: string) => void
  onToggleSize: (size: string) => void
  onToggleStock: () => void
  onPriceChange: (range: [number, number]) => void
  onClear: () => void
}

export default function FiltersSidebar({
  filters,
  hasActiveFilters,
  onToggleCategory,
  onToggleSize,
  onToggleStock,
  onPriceChange,
  onClear,
}: FiltersSidebarProps) {
  const [minPrice, maxPrice] = filters.priceRange

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-24 space-y-7">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-brand-white uppercase tracking-[0.2em]">
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-[11px] text-brand-gold hover:text-brand-gold-light transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div>
          <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
            Category
          </h3>
          <div className="space-y-1.5">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => category !== 'all' && onToggleCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  category === 'all' && filters.categories.length === 0
                    ? 'text-brand-white bg-brand-card'
                    : filters.categories.includes(category)
                      ? 'text-brand-gold bg-brand-gold/8 border border-brand-gold/20'
                      : 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-card/60'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
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
      </div>
    </aside>
  )
}
