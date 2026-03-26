import { fetchSanityData, isSanityConfigured, urlFor, apiVersion, sanityClient } from './client'
import {
  ALL_PRODUCTS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  CATEGORIES_WITH_COUNT_QUERY,
  FEATURED_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCTS_BY_CATEGORY_SLUG_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from './queries'
import { mapCategories, mapCategory, mapProduct, mapProducts } from '@/lib/utils/mappers'
import type { SanityCategoryDocument, SanityProductDocument } from './types'
import type { Category, Product } from '@/types'

export { isSanityConfigured, urlFor, apiVersion, sanityClient }

export async function getAllProducts(category?: string): Promise<Product[]> {
  const query = category ? PRODUCTS_BY_CATEGORY_QUERY : ALL_PRODUCTS_QUERY
  const params = category ? { category } : {}

  const products = await fetchSanityData<SanityProductDocument[]>(
    'getAllProducts',
    query,
    {
      params,
      revalidate: 60,
      tags: ['products'],
      fallback: [],
    },
  )

  return mapProducts(products)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await fetchSanityData<SanityProductDocument | null>(
    'getProductBySlug',
    PRODUCT_BY_SLUG_QUERY,
    {
      params: { slug },
      revalidate: 60,
      tags: [`product:${slug}`],
      fallback: null,
    },
  )

  return product ? mapProduct(product) : null
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchSanityData<SanityCategoryDocument[]>(
    'getCategories',
    CATEGORIES_WITH_COUNT_QUERY,
    {
      revalidate: 60,
      tags: ['categories'],
      fallback: [],
    },
  )

  return mapCategories(categories)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await fetchSanityData<SanityCategoryDocument | null>(
    'getCategoryBySlug',
    CATEGORY_BY_SLUG_QUERY,
    {
      params: { slug },
      revalidate: 60,
      tags: [`category:${slug}`],
      fallback: null,
    },
  )

  return category ? mapCategory(category) : null
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await fetchSanityData<SanityProductDocument[]>(
    'getProductsByCategory',
    PRODUCTS_BY_CATEGORY_SLUG_QUERY,
    {
      params: { categorySlug },
      revalidate: 60,
      tags: ['products', `category:${categorySlug}`],
      fallback: [],
    },
  )

  return mapProducts(products)
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (!searchQuery.trim()) return []

  const products = await fetchSanityData<SanityProductDocument[]>(
    'searchProducts',
    SEARCH_PRODUCTS_QUERY,
    {
      params: { searchQuery },
      revalidate: 0,
      fallback: [],
    },
  )

  return mapProducts(products)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await fetchSanityData<SanityProductDocument[]>(
    'getFeaturedProducts',
    FEATURED_PRODUCTS_QUERY,
    {
      revalidate: 60,
      tags: ['products', 'featured-products'],
      fallback: [],
    },
  )

  return mapProducts(products)
}

export async function getHomepageContent() {
  return null
}

export async function getCollections() {
  return []
}
