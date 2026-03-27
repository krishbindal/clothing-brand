import ProductCard from './ProductCard'
import { Product } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProductGridProps {
  products: Product[]
  priorityCount?: number
}

export default function ProductGrid({ products, priorityCount = 4 }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-brand-border/40 bg-brand-card/70 overflow-hidden"
          >
            <Skeleton className="aspect-[4/5] w-full bg-gradient-to-br from-brand-card/40 to-brand-border/30" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
        <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-center text-brand-gray-400 text-xs uppercase tracking-[0.35em] bg-brand-card/60 border border-dashed border-brand-border/50 rounded-lg py-6">
          Curating fresh looks from the studio...
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  )
}
