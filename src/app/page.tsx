import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/shop/ProductGrid'
import { getAllProducts } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default async function HomePage() {
  const products = await getAllProducts()

  return (
    <>
      <HeroSection title="WEAR THE FUTURE" subtitle="Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force." />
      
      <section className="bg-brand-black relative py-24 sm:py-32 overflow-hidden border-t border-brand-border/30">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col mb-16 items-center text-center">
             <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
               <span className="w-8 h-px bg-brand-gold/30 block"></span>
               The Collection
               <span className="w-8 h-px bg-brand-gold/30 block"></span>
             </p>
             <h2 className="text-4xl md:text-6xl font-display font-medium text-brand-white tracking-tight">Latest Arrivals</h2>
          </div>
          
          <ProductGrid products={products} />
        </div>
      </section>

      <Footer />
    </>
  )
}
