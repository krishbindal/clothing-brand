'use client'

import Modal from '@/components/ui/Modal'
import { CATEGORIES, SIZES } from '@/lib/shop'
import { FilterState } from '@/types'
import { Sparkles, SlidersHorizontal } from 'lucide-react'

interface MobileFiltersProps {
  open: boolean
  filters: FilterState
  onClose: () => void
  categories: string[]
  onToggleCategory: (category: string) => void
  onToggleSize: (size: string) => void
  onApply: () => void
  onClear: () => void
}

export default function MobileFilters({
  open,
  filters,
  onClose,
  categories,
  onToggleCategory,
  onToggleSize,
  onApply,
  onClear,
}: MobileFiltersProps) {
  const categoryOptions = categories.length ? categories : CATEGORIES.filter((category) => category !== 'all')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Filters"
      description="Refine your search"
      widthClassName="w-full max-w-md md:max-w-lg"
      footer={
        <div className="flex flex-col gap-2">
          <button onClick={onClear} className="btn-secondary w-full text-xs">
            Clear All Filters
          </button>
          <button
            onClick={() => {
              onApply()
              onClose()
            }}
            className="btn-primary w-full text-xs"
          >
            <Sparkles size={13} />
            Apply Filters
          </button>
        </div>
      }
    >
      <div className="space-y-7">
        <div className="flex items-center gap-2 text-sm text-brand-gray-400">
          <SlidersHorizontal size={14} className="text-brand-gold" />
          <span>Choose categories and sizes to narrow results</span>
        </div>

        <div>
          <h3 className="text-[11px] text-brand-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
            Category
          </h3>
          <div className="space-y-1.5">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => onToggleCategory(category)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  filters.categories.includes(category)
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/25'
                    : 'text-brand-gray-400 hover:text-brand-white hover:bg-brand-card'
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
      </div>
    </Modal>
  )
}
