import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ActiveFiltersProps {
  categories: string[]
  sizes: string[]
  searchQuery: string
  onClear: () => void
  onRemoveCategory: (category: string) => void
  onRemoveSize: (size: string) => void
  onClearSearch: () => void
}

export default function ActiveFilters({
  categories,
  sizes,
  searchQuery,
  onClear,
  onRemoveCategory,
  onRemoveSize,
  onClearSearch,
}: ActiveFiltersProps) {
  if (
    categories.length === 0 &&
    sizes.length === 0 &&
    !searchQuery
  ) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mb-5"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onRemoveCategory(category)}
          className="inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-3 py-1 hover:bg-brand-gold/20 transition-colors"
        >
          {category}
          <X size={12} />
        </button>
      ))}

      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onRemoveSize(size)}
          className="inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-3 py-1 hover:bg-brand-gold/20 transition-colors"
        >
          {size}
          <X size={12} />
        </button>
      ))}

      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-3 py-1 hover:bg-brand-gold/20 transition-colors"
        >
          &quot;{searchQuery}&quot;
          <X size={12} />
        </button>
      )}

      <button
        onClick={onClear}
        className="text-xs text-brand-gray-500 hover:text-brand-white transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </motion.div>
  )
}
