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
import CategoryShowcase from '@/components/home/CategoryShowcase'
import LiveActivityTicker from '@/components/home/LiveActivityTicker'
import EmptyState from '@/components/ui/EmptyState'
import {
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  getHomepageBanner,
  getNewArrivals,
  getTrendingProducts,
} from '@/lib/sanity'
import CategoryCard from '@/components/ui/CategoryCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { getAllProducts, getCategories, getHomepageBanner, getNewArrivals, getTrendingProducts } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default async function HomePage() {
  const [banner, arrivals, trending, featured, products, categories] = await Promise.all([
    getHomepageBanner(),
    getNewArrivals(),
    getTrendingProducts(),
    getFeaturedProducts(),
    getAllProducts(),
    getCategories(),
  ])
  const safeProducts = products || []
  const featuredProducts = featured?.length ? featured : safeProducts.filter((p) => p.featured)
  const trendingProducts = trending?.length
    ? trending
    : featuredProducts.length
    ? featuredProducts.slice(0, 6)
    : safeProducts.slice(0, 6)
  const newArrivals = arrivals?.length ? arrivals : safeProducts.slice(0, 8)
  const heroCollection = featuredProducts.length ? featuredProducts.slice(0, 8) : newArrivals
  const personalizedFallback =
    safeProducts.length > 0 ? safeProducts : [...newArrivals, ...trendingProducts].slice(0, 12)
  const heroTitle = banner?.title || 'WEAR THE FUTURE'
  const heroImage = banner?.image
  const heroCtaHref = banner?.link || '/shop'

  if (!safeProducts.length && !newArrivals.length && !trendingProducts.length) {
    return (
      <main className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="max-w-3xl w-full">
          <EmptyState
            title="No products available yet"
            description="We’re syncing the catalog from Sanity. Check back soon or explore our collections."
            actionLabel="Browse collections"
            actionHref="/collections"
          />
        </div>
      </main>
    )
  }
const bannerPromise = getHomepageBanner()
const catalogPromise = getAllProducts()
const newArrivalsPromise = getNewArrivals()
const trendingPromise = getTrendingProducts()
const categoriesPromise = getCategories()

export default function HomePage() {
  return (
    <main className="bg-brand-black">
      <HeroSection
        title={heroTitle}
        subtitle="Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force."
        imageUrl={heroImage}
        primaryCtaHref={heroCtaHref}
        primaryCtaLabel="Shop the banner edit"
        secondaryCtaHref="/collections"
        secondaryCtaLabel="Explore collections"
      />

      <LiveActivityTicker />

      <section className="bg-brand-black border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
          <div className="flex flex-col gap-6">
            <p className="section-overline">Just dropped</p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <h2 className="section-title">New Arrivals</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-gray-400">
                Fresh from Sanity CMS · {(newArrivals || []).length || 8} pieces
              </span>
            </div>
            <ProductGrid
              products={newArrivals}
              priorityCount={3}
              showSkeletons={!newArrivals.length}
              skeletonCount={8}
            />
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
    'Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force.'
  const heroImage = banner?.image || arrivals[0]?.images?.[0]?.url || null

  return (
    <HeroSection
      title={heroTitle}
      subtitle={heroSubtitle}
      imageUrl={heroImage}
      ctaHref={banner?.link || '/shop'}
      ctaLabel="Shop the Capsule"
      eyebrow="Live from the Atelier"
    />
  )
}

async function SpotlightBlock() {
  const catalog = await catalogPromise
  const spotlight = catalog.slice(0, 8)
  if (!spotlight.length) return <SectionSkeleton title="Spotlight" />

  return <DynamicSpotlight products={spotlight} />
}

async function NewArrivalsBlock() {
  const [arrivals, catalog] = await Promise.all([newArrivalsPromise, catalogPromise])
  const collection = arrivals.length ? arrivals : catalog.slice(0, 8)

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

          <div className="flex flex-col gap-6">
            <p className="section-overline">Trending now</p>
            <h2 className="section-title">Most wanted silhouettes</h2>
            <ProductGrid
              products={trendingProducts}
              priorityCount={2}
              showSkeletons={!trendingProducts.length}
              skeletonCount={6}
            />
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
            <h2 className="text-4xl md:text-6xl font-display font-medium text-brand-white tracking-tight">
              Latest Arrivals
            </h2>
          </div>

          <ProductGrid
            products={heroCollection}
            showSkeletons={!heroCollection.length}
            skeletonCount={4}
          />
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
    return (
      <section className="bg-brand-black border-t border-brand-border/30">
        <div className="container-wide py-14">
          <SectionSkeleton title="For You" />
        </div>
      </section>
    )
  }

      <DynamicSpotlight products={safeProducts.length ? safeProducts : heroCollection} />

      <CategoryShowcase categories={categories || []} fallbackProducts={safeProducts} />

      <PersonalizedRail fallback={personalizedFallback} catalog={safeProducts} />

      <Footer />
    </main>
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
