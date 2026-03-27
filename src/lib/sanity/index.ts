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
import type { SanityBanner, SanityCategory, SanityProduct } from './types'
import type { Category, Product } from '@/types'

export { sanityClient, urlFor }

function mapProduct(doc: SanityProduct): Product {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
    description: doc.description || '',
    price: doc.price,
    images:
      doc.images?.map((img) => ({
        url: img.url,
        alt: img.alt || doc.name,
        width: img.width || 800,
        height: img.height || 1000,
      })) || [],
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
