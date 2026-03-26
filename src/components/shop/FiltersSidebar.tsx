'use client'

import FiltersCore from '@/components/filters/FiltersCore'
import { FilterState } from '@/types'

interface FiltersSidebarProps {
  filters: FilterState
  hasActiveFilters: boolean
  categories: string[]
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
  categories,
}: FiltersSidebarProps) {
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

        <FiltersCore
          filters={filters}
          categories={categories}
          onToggleCategory={onToggleCategory}
          onToggleSize={onToggleSize}
          onToggleStock={onToggleStock}
          onPriceChange={onPriceChange}
          variant="desktop"
          showPrice
          showStock
          showSelectAll
        />
      </div>
    </aside>
  )
}
