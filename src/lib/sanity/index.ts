import { fetchSanityData, isSanityConfigured, urlFor, apiVersion, sanityClient } from './client'
import {
  getAllProductsQuery,
  getFeaturedProductsQuery,
  getCategoriesQuery,
  getBannerQuery,
  getProductBySlugQuery,
  getCategoryBySlugQuery,
  getProductsByCategorySlugQuery,
  searchProductsQuery,
  getNewArrivalsQuery,
  getLatestDropProductsQuery,
} from './queries'
import type { Category, Product, ProductImage } from '@/types'
import type { SanityBanner, SanityCategory, SanityImageAsset, SanityProduct } from './types'

export { isSanityConfigured, urlFor, apiVersion, sanityClient }

const DEFAULT_IMAGE: ProductImage = {
  url: '',
  alt: 'Product image coming soon',
  width: 800,
  height: 1000,
}

function mapImage(img?: SanityImageAsset | null, fallbackAlt?: string): ProductImage | null {
  if (!img) return null
  try {
    const builder = urlFor(img)
    const url = builder?.width(1200).height(1500).url()
    if (!url) return null
    const width = img.asset?.metadata?.dimensions?.width ?? img.width ?? 1200
    const height = img.asset?.metadata?.dimensions?.height ?? img.height ?? 1500
    const alt = img.alt || img.asset?.altText || fallbackAlt || 'Product image'
    return { url, alt, width, height }
  } catch (error) {
    console.error('Failed to build image url', error)
    return null
  }
}

function mapProduct(doc: SanityProduct): Product {
  const createdAt = doc.createdAt || new Date().toISOString()
  const stockCount = typeof doc.stock === 'number' ? doc.stock : undefined
  const inStock = stockCount === undefined ? true : stockCount > 0
  const soldCount = typeof doc.soldCount === 'number' ? doc.soldCount : undefined
  const salesVelocity = typeof doc.salesVelocity === 'number' ? doc.salesVelocity : undefined
  const liveViewers = typeof doc.liveViewers === 'number' ? doc.liveViewers : undefined
  const comparePrice = (doc as unknown as { comparePrice?: number })?.comparePrice
  const rating = (doc as unknown as { rating?: number })?.rating
  const reviewCount = (doc as unknown as { reviewCount?: number })?.reviewCount
  const collection = (doc as unknown as { collection?: string })?.collection
  const images =
    (doc.images
      ?.map((img) => mapImage(img, doc.title))
      ?.filter(Boolean) as ProductImage[] | undefined) || []
  const legacyImage = doc.image ? mapImage(doc.image, doc.title) : null
  const primaryImage = images.length ? images : legacyImage ? [legacyImage] : [DEFAULT_IMAGE]
  const categoryName =
    typeof doc.category === 'string' ? doc.category : doc.category?.name || ''

  const slug =
    typeof doc.slug === 'string' ? doc.slug : doc.slug?.current || ''

  const tags = new Set<string>(doc.tags || [])
  if (doc.isFeatured) tags.add('trending')
  if (stockCount !== undefined && stockCount > 0 && stockCount <= 3) tags.add('low-stock')
  const ageMs = Date.now() - new Date(createdAt).getTime()
  if (Number.isFinite(ageMs) && ageMs <= 1000 * 60 * 60 * 24 * 30) {
    tags.add('new')
    tags.add('new-drop')
  }
  if (doc.tags?.includes('bestseller') || (reviewCount && reviewCount >= 80)) {
    tags.add('bestseller')
  }
  if (doc.isFeatured && stockCount && stockCount > 3) {
    tags.add('bestseller')
  }
  if (collection?.toLowerCase().includes('drop')) {
    tags.add('new-drop')
  }
  if (soldCount && soldCount > 120) {
    tags.add('bestseller')
  }
  const inferredVelocity =
    salesVelocity ??
    (soldCount ? Math.max(1, Math.round(soldCount / 40)) : undefined) ??
    (doc.isFeatured ? 6 : undefined)
  if (inferredVelocity && inferredVelocity >= 6) {
    tags.add('trending')
  }

  const fallbackSizes = [
    { label: 'S', available: inStock },
    { label: 'M', available: inStock },
    { label: 'L', available: inStock },
    { label: 'XL', available: inStock },
  ]

  const fallbackColors = [
    { name: 'Onyx', hex: '#111111', available: inStock },
    { name: 'Stone', hex: '#9ca3af', available: inStock },
  ]

  const incomingSizes = (doc as unknown as { sizes?: Product['sizes'] })?.sizes
  const incomingColors = (doc as unknown as { colors?: Product['colors'] })?.colors

  return {
    id: doc._id || '',
    name: doc.title || '',
    slug,
    description: doc.description || '',
    price: Number(doc.price) || 0,
    comparePrice: comparePrice ? Number(comparePrice) : undefined,
    images: primaryImage,
    category: categoryName,
    collection,
    sizes: incomingSizes && incomingSizes.length ? incomingSizes : fallbackSizes,
    colors: incomingColors && incomingColors.length ? incomingColors : fallbackColors,
    materials: [],
    inStock,
    stockCount,
    soldCount,
    salesVelocity: inferredVelocity,
    liveViewers: liveViewers ?? Math.max(10, 18 - (stockCount ?? 0)),
    tags: Array.from(tags),
    featured: Boolean(doc.isFeatured),
    rating: rating ? Number(rating) : undefined,
    reviewCount: reviewCount ? Number(reviewCount) : undefined,
    createdAt,
    updatedAt: doc.updatedAt || createdAt,
  }
}

function mapCategory(doc: SanityCategory): Category {
  const slug =
    typeof doc.slug === 'string' ? doc.slug : doc.slug?.current || ''
  return {
    id: doc._id || '',
    name: doc.name || '',
    slug,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[] | null>(
    'getAllProducts',
    getAllProductsQuery,
    { revalidate: 60, tags: ['products'], fallback: [] }
  )
  const mapped = (products ?? []).map(mapProduct)
  return mapped
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[] | null>(
    'getNewArrivals',
    getNewArrivalsQuery,
    { revalidate: 60, tags: ['products', 'new'], fallback: [] }
  )
  const mapped = (products ?? []).map(mapProduct)
  return mapped.slice(0, 8)
}

export async function getLatestDropProducts(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[] | null>(
    'getLatestDropProducts',
    getLatestDropProductsQuery,
    { revalidate: 60, tags: ['products', 'new-drop'], fallback: [] }
  )
  const mapped = (products ?? []).map(mapProduct)
  return mapped.slice(0, 6)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[] | null>(
    'getFeaturedProducts',
    getFeaturedProductsQuery,
    { revalidate: 60, tags: ['products', 'featured'], fallback: [] }
  )
  const mapped = (products ?? []).map(mapProduct)
  return mapped
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchSanityData<SanityCategory[] | null>(
    'getCategories',
    getCategoriesQuery,
    { revalidate: 60, tags: ['categories'], fallback: [] }
  )
  const mapped = (categories ?? []).map(mapCategory)
  return mapped
}

export async function getBanner(): Promise<SanityBanner | null> {
  const banner = await fetchSanityData<SanityBanner | null>(
    'getBanner',
    getBannerQuery,
    { revalidate: 60, tags: ['banner'], fallback: null }
  )
  return banner || null
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await fetchSanityData<SanityProduct | null>(
    'getProductBySlug',
    getProductBySlugQuery,
    { params: { slug }, revalidate: 60, tags: [`product:${slug}`], fallback: null }
  )
  if (product) return mapProduct(product)
  return null
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await fetchSanityData<SanityCategory | null>(
    'getCategoryBySlug',
    getCategoryBySlugQuery,
    { params: { slug }, revalidate: 60, tags: [`category:${slug}`], fallback: null }
  )
  if (category) return mapCategory(category)
  return null
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[] | null>(
    'getProductsByCategory',
    getProductsByCategorySlugQuery,
    { params: { categorySlug }, revalidate: 60, tags: ['products', `category:${categorySlug}`], fallback: [] }
  )
  const mapped = (products ?? []).map(mapProduct)
  return mapped
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (!searchQuery.trim()) return []
  const products = await fetchSanityData<SanityProduct[] | null>(
    'searchProducts',
    searchProductsQuery,
    { params: { searchQuery }, revalidate: 0, fallback: [] }
  )
  const mapped = (products ?? []).map(mapProduct)
  return mapped
}

export async function getCollections() {
  return []
}
