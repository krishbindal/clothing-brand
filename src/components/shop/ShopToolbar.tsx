'use client'

import { ChevronDown, Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react'
import { SortOption } from '@/types'
import { SORT_OPTIONS } from '@/lib/shop'

interface ShopToolbarProps {
  sortBy: SortOption
  viewMode: 'grid' | 'list'
  onSortChange: (sort: SortOption) => void
  onViewChange: (view: 'grid' | 'list') => void
  onOpenFilters: () => void
  hasActiveFilters: boolean
}

export default function ShopToolbar({
  sortBy,
  viewMode,
  onSortChange,
  onViewChange,
  onOpenFilters,
  hasActiveFilters,
}: ShopToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4">
      <button
        onClick={onOpenFilters}
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
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="input-dark py-2 text-xs pr-8 appearance-none cursor-pointer min-w-[160px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 pointer-events-none"
          />
        </div>

        <div className="flex border border-brand-border rounded-md overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-brand-gold text-brand-black'
                : 'text-brand-gray-500 hover:text-brand-white'
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 size={15} />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-brand-gold text-brand-black'
                : 'text-brand-gray-500 hover:text-brand-white'
            }`}
            aria-label="List view"
          >
            <LayoutList size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
