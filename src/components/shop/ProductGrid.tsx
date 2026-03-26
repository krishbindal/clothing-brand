import ProductCard from './ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  priorityCount?: number
}

export default function ProductGrid({ products, priorityCount = 4 }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="w-full py-24 flex justify-center text-brand-gray-500 font-light tracking-wide uppercase">
        No products available at this time.
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
