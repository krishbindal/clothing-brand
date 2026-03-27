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
} from './queries'
import type { Category, Product, ProductImage } from '@/types'
import type { SanityBanner, SanityCategory, SanityImageAsset, SanityProduct } from './types'
import { demoBanner, demoCategories, demoProducts } from '../demoContent'

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
  const products = await fetchSanityData<SanityProduct[]>(
    'getAllProducts',
    getAllProductsQuery,
    { revalidate: 60, tags: ['products'], fallback: [] }
  )
  const mapped = products.map(mapProduct)
  return mapped.length ? mapped : demoProducts
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[]>(
    'getNewArrivals',
    getNewArrivalsQuery,
    { revalidate: 60, tags: ['products', 'new'], fallback: [] }
  )
  const mapped = products.map(mapProduct)
  if (mapped.length) return mapped
  return demoProducts
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[]>(
    'getFeaturedProducts',
    getFeaturedProductsQuery,
    { revalidate: 60, tags: ['products', 'featured'], fallback: [] }
  )
  const mapped = products.map(mapProduct)
  if (mapped.length) return mapped
  const fallbackFeatured = demoProducts.filter(
    (product) => product.featured || product.tags.includes('trending')
  )
  return fallbackFeatured.length ? fallbackFeatured : demoProducts
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchSanityData<SanityCategory[]>(
    'getCategories',
    getCategoriesQuery,
    { revalidate: 60, tags: ['categories'], fallback: [] }
  )
  const mapped = categories.map(mapCategory)
  return mapped.length ? mapped : demoCategories
}

export async function getBanner(): Promise<SanityBanner | null> {
  const banner = await fetchSanityData<SanityBanner | null>(
    'getBanner',
    getBannerQuery,
    { revalidate: 60, tags: ['banner'], fallback: null }
  )
  return banner || demoBanner
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await fetchSanityData<SanityProduct | null>(
    'getProductBySlug',
    getProductBySlugQuery,
    { params: { slug }, revalidate: 60, tags: [`product:${slug}`], fallback: null }
  )
  if (product) return mapProduct(product)
  return demoProducts.find((item) => item.slug === slug) || null
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await fetchSanityData<SanityCategory | null>(
    'getCategoryBySlug',
    getCategoryBySlugQuery,
    { params: { slug }, revalidate: 60, tags: [`category:${slug}`], fallback: null }
  )
  if (category) return mapCategory(category)
  return demoCategories.find((item) => item.slug === slug) || null
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await fetchSanityData<SanityProduct[]>(
    'getProductsByCategory',
    getProductsByCategorySlugQuery,
    { params: { categorySlug }, revalidate: 60, tags: ['products', `category:${categorySlug}`], fallback: [] }
  )
  const mapped = products.map(mapProduct)
  if (mapped.length) return mapped

  const fallbackCategory = demoCategories.find(
    (category) =>
      category.slug === categorySlug || category.name.toLowerCase() === categorySlug.toLowerCase()
  )
  const normalized = fallbackCategory?.name.toLowerCase()
  return demoProducts.filter(
    (product) =>
      product.category.toLowerCase() === normalized ||
      product.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
  )
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (!searchQuery.trim()) return []
  const products = await fetchSanityData<SanityProduct[]>(
    'searchProducts',
    searchProductsQuery,
    { params: { searchQuery }, revalidate: 0, fallback: [] }
  )
  const mapped = products.map(mapProduct)
  if (mapped.length) return mapped
  const query = searchQuery.toLowerCase()
  return demoProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  )
}

export async function getCollections() {
  return []
}
