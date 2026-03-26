import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const mainImage = product.images[0]?.url || '/placeholder.jpg'
  
  return (
    <Link href={`/product/${product.slug}`} className="group block w-full overflow-hidden bg-brand-card rounded-lg border border-brand-border/40 transition-all duration-500 hover:border-brand-gold/40 hover:shadow-card-hover">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-dark">
        {mainImage !== '/placeholder.jpg' ? (
          <Image 
            src={mainImage} 
            alt={product.name} 
            fill 
            priority={priority}
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-brand-muted flex items-center justify-center">
            <span className="text-brand-gray-500 text-sm tracking-widest uppercase">No Image</span>
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-brand-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-brand-white font-medium uppercase tracking-widest text-xs">Sold Out</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-display text-lg tracking-tight text-brand-white group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-brand-gray-400 font-light truncate">{product.category || 'Luxury Goods'}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-brand-white font-medium">${product.price}</span>
          {product.comparePrice && (
            <span className="text-brand-gray-500 line-through text-sm">${product.comparePrice}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
