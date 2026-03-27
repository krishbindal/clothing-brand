import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/shop/ProductGrid'
import PersonalizedRail from '@/components/home/PersonalizedRail'
import DynamicSpotlight from '@/components/home/DynamicSpotlight'
import { getAllProducts, getFeaturedProducts, getBanner, getCategories } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default async function HomePage() {
  const products = await getAllProducts()
  const featured = await getFeaturedProducts()
  const banner = await getBanner()
  const categories = await getCategories()

  const safeProducts = products || []
  const safeFeatured = featured || []
  const spotlight = safeFeatured.length ? safeFeatured.slice(0, 8) : safeProducts.slice(0, 8)
  const heroCollection = spotlight
  const trendingFallback = safeFeatured.length ? safeFeatured.slice(0, 4) : safeProducts.slice(0, 4)
  const arrivalsFallback = safeProducts.slice(0, 4)

  if (safeProducts.length === 0) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-brand-white bg-brand-black">
        <h1 className="text-2xl font-light">No products available yet.</h1>
      </div>
    )
  }

  return (
    <>
      <HeroSection 
        title={banner?.title || "WEAR THE FUTURE"} 
        subtitle={banner?.subtitle || "Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force."} 
      />

      <DynamicSpotlight products={safeProducts} />
      
      <section className="bg-brand-black border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
          <div className="flex flex-col gap-6">
            <p className="section-overline">Trending now</p>
            <h2 className="section-title">Most wanted silhouettes</h2>
            <ProductGrid products={trendingFallback} priorityCount={2} />
          </div>

          <div className="flex flex-col gap-6">
            <p className="section-overline">New arrivals</p>
            <h2 className="section-title">Fresh drops, limited runs</h2>
            <ProductGrid products={arrivalsFallback} priorityCount={2} />
          </div>
        </div>
      </section>

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
          
          <ProductGrid products={heroCollection} />
        </div>
      </section>

      <PersonalizedRail fallback={safeProducts} catalog={safeProducts} />

      <Footer />
    </>
  )
}
