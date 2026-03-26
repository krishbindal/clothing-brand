'use client'

import Modal from '@/components/ui/Modal'
import FiltersCore from '@/components/filters/FiltersCore'
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

        <FiltersCore
          filters={filters}
          categories={categories}
          onToggleCategory={onToggleCategory}
          onToggleSize={onToggleSize}
          variant="mobile"
        />
      </div>
    </Modal>
  )
}
