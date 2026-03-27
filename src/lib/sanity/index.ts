import { sanityClient, urlFor, safeFetch } from './client'
import {
  allProductsQuery,
  bannerQuery,
  categoriesQuery,
  categoryBySlugQuery,
  featuredProductsQuery,
  newArrivalsQuery,
  productBySlugQuery,
  productsByCategoryQuery,
  searchProductsQuery,
  trendingProductsQuery,
} from './queries'
import type { SanityBanner, SanityCategory, SanityImageAsset, SanityProduct } from './types'
import type { Category, Product, ProductImage } from '@/types'

export { sanityClient, urlFor }

export interface HomepageBanner {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  image?: ProductImage
}

function mapImage(img: SanityImageAsset | undefined, fallbackAlt: string): ProductImage | null {
  if (!img) return null

  const width =
    img.asset?.metadata?.dimensions?.width ??
    img.width ??
    1200
  const height =
    img.asset?.metadata?.dimensions?.height ??
    img.height ??
    1500

  const source =
    img.asset?._id
      ? { _type: 'image', asset: { _ref: img.asset._id } }
      : img.asset

  const builder = source ? urlFor(source).auto('format').fit('max') : null
  const builtUrl = builder
    ? builder.width(Math.min(width, 1600)).height(Math.min(height, 2000)).url()
    : undefined

  return {
    url: builtUrl || img.url || img.asset?.url || '',
    alt: img.alt || img.asset?.altText || fallbackAlt,
    width,
    height,
  }
}

function mapProduct(doc: SanityProduct): Product {
  const imageSources =
    doc.images && doc.images.length
      ? doc.images
      : doc.image
        ? [doc.image]
        : []
  const creationDateValue = doc.createdAt || doc.updatedAt
  const createdAt = doc.createdAt || creationDateValue || new Date().toISOString()
  const updatedAt = doc.updatedAt || creationDateValue || createdAt
  const creationDate = creationDateValue ? new Date(creationDateValue) : null
  const isNew =
    creationDate !== null ? Date.now() - creationDate.getTime() < 1000 * 60 * 60 * 24 * 30 : false
  const computedTags = new Set([
    ...(doc.tags || []),
    ...(doc.featured ? ['trending', 'bestseller'] : []),
    ...(isNew ? ['new'] : []),
    ...(doc.stock !== undefined && doc.stock > 0 && doc.stock <= 3 ? ['low-stock'] : []),
  ])

  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
    description: doc.description || '',
    price: doc.price,
    images:
      imageSources
        .map((img) => mapImage(img, doc.name))
        .filter((img): img is NonNullable<typeof img> => Boolean(img)) || [],
    category: doc.category || '',
    sizes: [],
    colors: [],
    materials: [],
    inStock: (doc.stock ?? 0) > 0,
    stockCount: doc.stock,
    tags: Array.from(computedTags),
    featured: Boolean(doc.featured),
    createdAt,
    updatedAt,
  }
}

function mapCategory(doc: SanityCategory): Category {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
    productCount: doc.productCount,
    image: mapImage(doc.cover || undefined, doc.name)?.url,
  }
}

function mapBanner(doc: SanityBanner): HomepageBanner {
  const image = doc.image ? mapImage(doc.image, doc.title) : null

  return {
    title: doc.title,
    subtitle: doc.subtitle,
    ctaText: doc.ctaText,
    ctaLink: doc.ctaLink,
    ...(image ? { image } : {}),
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const docs = await safeFetch<SanityProduct[]>(
    'getAllProducts',
    allProductsQuery,
    {},
    [],
  )
  if (!docs.length) {
    console.warn('Sanity: no products found for getAllProducts')
    return []
  }
  return docs.map(mapProduct)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const docs = await safeFetch<SanityProduct[]>(
    'getProductsByCategory',
    productsByCategoryQuery,
    { category },
    [],
  )
  return docs.map(mapProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const docs = await safeFetch<SanityProduct[]>(
    'getFeaturedProducts',
    featuredProductsQuery,
    {},
    [],
  )
  return docs.map(mapProduct)
}

export async function getTrendingProducts(): Promise<Product[]> {
  const docs = await safeFetch<SanityProduct[]>(
    'getTrendingProducts',
    trendingProductsQuery,
    {},
    [],
  )
  return docs.map(mapProduct)
}

export async function getNewArrivals(): Promise<Product[]> {
  const docs = await safeFetch<SanityProduct[]>(
    'getNewArrivals',
    newArrivalsQuery,
    {},
    [],
  )
  return docs.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const doc = await safeFetch<SanityProduct | null>(
    'getProductBySlug',
    productBySlugQuery,
    { slug },
    null,
  )
  return doc ? mapProduct(doc) : null
}

export async function getCategories(): Promise<Category[]> {
  const docs = await safeFetch<SanityCategory[]>(
    'getCategories',
    categoriesQuery,
    {},
    [],
  )
  return docs.map(mapCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const doc = await safeFetch<SanityCategory | null>(
    'getCategoryBySlug',
    categoryBySlugQuery,
    { slug },
    null,
  )
  return doc ? mapCategory(doc) : null
}

export async function getHomepageBanner(): Promise<HomepageBanner | null> {
  const doc = await safeFetch<SanityBanner | null>('getHomepageBanner', bannerQuery, {}, null)
  return doc ? mapBanner(doc) : null
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (!searchQuery.trim()) return []

  const docs = await safeFetch<SanityProduct[]>(
    'searchProducts',
    searchProductsQuery,
    { q: searchQuery },
    [],
  )

  return docs.map(mapProduct)
}
