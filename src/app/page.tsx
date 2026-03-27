import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import LiveActivityTicker from '@/components/home/LiveActivityTicker'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/shop/ProductGrid'
import PersonalizedRail from '@/components/home/PersonalizedRail'
import DynamicSpotlight from '@/components/home/DynamicSpotlight'
import CategoryCard from '@/components/ui/CategoryCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { getAllProducts, getCategories, getHomepageBanner, getNewArrivals, getTrendingProducts } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

const bannerPromise = getHomepageBanner()
const catalogPromise = getAllProducts()
const newArrivalsPromise = getNewArrivals()
const trendingPromise = getTrendingProducts()
const categoriesPromise = getCategories()

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroBlock />
      </Suspense>

      <LiveActivityTicker />

      <Suspense fallback={<SectionSkeleton title="Spotlight" />}>
        <SpotlightBlock />
      </Suspense>

      <Suspense fallback={<SectionSkeleton title="Just Dropped" />}>
        <NewArrivalsBlock />
      </Suspense>

      <Suspense fallback={<SectionSkeleton title="Trending Now" />}>
        <TrendingBlock />
      </Suspense>

      <Suspense fallback={<CategorySkeleton />}>
        <CategoriesBlock />
      </Suspense>

      <Suspense fallback={<SectionSkeleton title="For You" />}>
        <PersonalizedBlock />
      </Suspense>

      <Footer />
    </>
  )
}

async function HeroBlock() {
  const [banner, arrivals] = await Promise.all([bannerPromise, newArrivalsPromise])
  const heroTitle = banner?.title || 'WEAR THE FUTURE'
  const heroSubtitle =
    banner?.subtitle ||
    'Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force.'
  const heroImage = banner?.image?.url || arrivals[0]?.images?.[0]?.url || null

  return (
    <HeroSection
      title={heroTitle}
      subtitle={heroSubtitle}
      imageUrl={heroImage}
      ctaHref={banner?.ctaLink || '/shop'}
      ctaLabel={banner?.ctaText || 'Shop the Capsule'}
      eyebrow="Live from the Atelier"
    />
  )
}

async function SpotlightBlock() {
  const catalog = await catalogPromise
  if (!catalog.length) {
    return (
      <EmptyProductsSection
        title="Spotlight"
        message="No products are available yet. Stay tuned for the first drop."
      />
    )
  }
  const spotlight = catalog.slice(0, 8)
  if (!spotlight.length) return <SectionSkeleton title="Spotlight" />

  return <DynamicSpotlight products={spotlight} />
}

async function NewArrivalsBlock() {
  const [arrivals, catalog] = await Promise.all([newArrivalsPromise, catalogPromise])
  const collection = arrivals.length ? arrivals : catalog.slice(0, 8)

  if (!collection.length) {
    return (
      <EmptyProductsSection
        title="Just Dropped"
        message="We haven't published products yet—check back soon for the latest arrivals."
      />
    )
  }

  return (
    <section className="bg-brand-black border-t border-brand-border/30">
      <div className="container-wide py-16 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="section-overline">Just Dropped</p>
            <h2 className="section-title">Fresh from the studio</h2>
          </div>
          <Link
            prefetch
            href="/shop?sort=newest"
            className="text-sm text-brand-gray-300 hover:text-brand-gold inline-flex items-center gap-2 uppercase tracking-[0.25em]"
          >
            View all arrivals <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={collection} priorityCount={3} />
      </div>
    </section>
  )
}

async function TrendingBlock() {
  const [trending, catalog] = await Promise.all([trendingPromise, catalogPromise])
  const fallback = catalog.filter((p) => p.featured).slice(0, 6)
  const collection = trending.length ? trending : fallback.length ? fallback : catalog.slice(0, 6)

  if (!collection.length) {
    return (
      <EmptyProductsSection
        title="Trending now"
        message="Trending products will appear here once items are published."
      />
    )
  }

  return (
    <section className="bg-brand-black border-t border-brand-border/30">
      <div className="container-wide py-16 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="section-overline">Trending now</p>
            <h2 className="section-title">Most wanted silhouettes</h2>
          </div>
          <Link
            prefetch
            href="/shop?sort=featured"
            className="text-sm text-brand-gray-300 hover:text-brand-gold inline-flex items-center gap-2 uppercase tracking-[0.25em]"
          >
            Shop trending <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={collection} priorityCount={2} />
      </div>
    </section>
  )
}

async function CategoriesBlock() {
  const categories = await categoriesPromise

  if (!categories.length) {
    return (
      <section className="bg-brand-black border-t border-brand-border/30">
        <div className="container-wide py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="section-overline">Collections</p>
            <h2 className="section-title">Curating the next drop</h2>
            <p className="text-brand-gray-400 max-w-xl">
              Our editors are refining categories to keep the experience sharp. Check back shortly.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-brand-border/40 bg-brand-card/70 p-6 space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-brand-black border-t border-brand-border/30">
      <div className="container-wide py-20 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="section-overline">Collections</p>
            <h2 className="section-title">Shop by attitude</h2>
          </div>
          <Link
            prefetch
            href="/collections"
            className="text-sm text-brand-gray-300 hover:text-brand-gold inline-flex items-center gap-2 uppercase tracking-[0.25em]"
          >
            Explore collections <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              slug={category.slug}
              image={category.image || '/placeholder.jpg'}
              productCount={category.productCount}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

async function PersonalizedBlock() {
  const catalog = await catalogPromise
  const featuredPool = catalog.filter((p) => p.featured).slice(0, 6)
  const fallback = featuredPool.length ? featuredPool : catalog.slice(0, 6)

  if (!fallback.length) {
    return <EmptyProductsSection title="For You" message="Personalized picks will unlock once products are live." />
  }

  return <PersonalizedRail fallback={fallback} catalog={catalog} />
}

function HeroSkeleton() {
  return (
    <div className="relative min-h-[80vh] bg-brand-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 via-brand-black to-brand-black blur-3xl" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 space-y-6 text-center">
        <Skeleton className="h-3 w-32 mx-auto" />
        <Skeleton className="h-16 w-full max-w-3xl mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        <div className="flex justify-center gap-3">
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-40" />
        </div>
      </div>
    </div>
  )
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="bg-brand-black border-t border-brand-border/30">
      <div className="container-wide py-12 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="section-overline">{title}</p>
            <Skeleton className="h-7 w-48" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategorySkeleton() {
  return <SectionSkeleton title="Collections" />
}

function EmptyProductsSection({ title, message }: { title: string; message: string }) {
  console.warn(`Empty catalog: ${title} section showing fallback UI`)

  return (
    <section className="bg-brand-black border-t border-brand-border/30">
      <div className="container-wide py-16 space-y-6 text-center">
        <p className="section-overline">{title}</p>
        <h2 className="section-title">Catalog is warming up</h2>
        <p className="text-brand-gray-400 max-w-2xl mx-auto">{message}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
