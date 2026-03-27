import { sanityClient, urlFor, safeFetch } from './client'
import {
  allProductsQuery,
  bannerQuery,
  categoriesQuery,
  categoryBySlugQuery,
  featuredProductsQuery,
  productBySlugQuery,
  productsByCategoryQuery,
  searchProductsQuery,
} from './queries'
import type { SanityBanner, SanityCategory, SanityImageAsset, SanityProduct } from './types'
import type { Category, Product } from '@/types'

export { sanityClient, urlFor }

function mapImage(img: SanityImageAsset | undefined, fallbackAlt: string) {
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
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
    description: doc.description || '',
    price: doc.price,
    images:
      doc.images
        ?.map((img) => mapImage(img, doc.name))
        .filter((img): img is NonNullable<typeof img> => Boolean(img)) || [],
    category: doc.category || '',
    sizes: [],
    colors: [],
    materials: [],
    inStock: (doc.stock ?? 0) > 0,
    stockCount: doc.stock,
    tags: [],
    featured: Boolean(doc.featured),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function mapCategory(doc: SanityCategory): Category {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
    productCount: doc.productCount,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const docs = await safeFetch<SanityProduct[]>(
    'getAllProducts',
    allProductsQuery,
    {},
    [],
  )
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

export async function getHomepageBanner(): Promise<SanityBanner | null> {
  return safeFetch<SanityBanner | null>('getHomepageBanner', bannerQuery, {}, null)
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
