import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { getProductBySlug } from '@/lib/sanity'
import Footer from '@/components/layout/Footer'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white pt-24 pb-12 flex flex-col selection:bg-brand-gold/30">
      
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center text-xs tracking-widest uppercase text-brand-gray-400 hover:text-brand-gold transition-colors duration-300">
          <ArrowLeft size={14} className="mr-2" /> Back to Collection
        </Link>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Gallery - 1 Column flowing down */}
          <div className="space-y-4">
            {product.images?.length > 0 ? (
              product.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/5] bg-brand-card rounded-lg overflow-hidden border border-brand-border/30">
                  <Image 
                    src={img.url} 
                    alt={img.alt || product.name} 
                    fill 
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover" 
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-[4/5] bg-brand-card rounded-lg flex items-center justify-center border border-brand-border/30">
                <span className="text-brand-gray-500 font-light tracking-widest uppercase text-sm">No Images Available</span>
              </div>
            )}
          </div>

          {/* Details - Sticky on Desktop */}
          <div className="relative h-full">
            <div className="lg:sticky lg:top-32 flex flex-col gap-10">
              
              {/* Header Info */}
              <div>
                <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium mb-4">
                  {product.category || 'Luxury Goods'}
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tighter mb-6 leading-[1.1]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-2xl font-light">
                  <span>${product.price}</span>
                  {product.comparePrice && (
                    <span className="text-brand-gray-500 line-through text-lg">${product.comparePrice}</span>
                  )}
                </div>
              </div>

              {/* Attributes Form */}
              <div className="space-y-8 pt-8 border-t border-brand-border/30">
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-widest text-brand-gray-400 font-semibold flex justify-between">
                      <span>Select Size</span>
                      <button className="text-brand-gray-500 underline underline-offset-4 hover:text-brand-white transition-colors">Size Guide</button>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((s) => (
                        <button 
                          key={s.label} 
                          disabled={!s.available} 
                          className={`w-14 h-14 flex items-center justify-center text-sm font-medium rounded border transition-colors duration-300 ${
                            s.available 
                            ? 'border-brand-border/60 hover:border-brand-gold hover:text-brand-gold text-brand-white bg-transparent' 
                            : 'opacity-40 cursor-not-allowed border-brand-border/30 text-brand-gray-600 bg-brand-dark'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-widest text-brand-gray-400 font-semibold">Select Color</p>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((c) => (
                        <button 
                          key={c.name} 
                          title={c.name}
                          disabled={!c.available} 
                          className={`w-10 h-10 rounded-full border border-brand-border/50 transition-transform hover:scale-110 ${
                            !c.available ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          style={{ backgroundColor: c.name.toLowerCase().includes('black') ? '#111' : c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Action */}
                <div className="pt-4">
                  <button 
                    disabled={!product.inStock}
                    className="w-full py-5 bg-brand-white text-brand-black text-sm font-semibold tracking-[0.2em] shadow-card uppercase transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-gold hover:text-white hover:shadow-gold-subtle"
                  >
                    {product.inStock ? 'Add to Cart' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="pt-10 border-t border-brand-border/30 text-brand-gray-300 leading-relaxed font-light text-[15px] sm:text-base space-y-4">
                <p>{product.description || 'Precision-crafted from premium materials. This limited drop represents the bleeding edge of modern luxury.'}</p>
              </div>

              {/* Guarantees */}
              <div className="space-y-4 pt-6 text-sm text-brand-gray-400 font-light border-t border-brand-border/30">
                 <div className="flex items-start gap-4">
                   <div className="mt-0.5"><Check size={16} className="text-brand-gold" /></div>
                   <p>Free priority shipping on all orders over $200.</p>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="mt-0.5"><Check size={16} className="text-brand-gold" /></div>
                   <p>Complimentary returns & exchanges within 30 days.</p>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="mt-0.5"><Check size={16} className="text-brand-gold" /></div>
                   <p>Authenticity guaranteed by LUXE Atelier.</p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  )
}
