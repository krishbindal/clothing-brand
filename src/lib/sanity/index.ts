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
} from './queries'
import type { Category, Product } from '@/types'

export { isSanityConfigured, urlFor, apiVersion, sanityClient }

function mapProduct(doc: any): Product {
  return {
    id: doc._id || '',
    name: doc.title || '',
    slug: doc.slug || '',
    description: '',
    price: doc.price || 0,
    images: (doc.images || []).map((img: any) => {
      try {
        return {
          url: urlFor(img).url(),
          alt: doc.title || 'Product Image',
          width: 800,
          height: 1000,
        }
      } catch (e) {
        return { url: '', alt: '', width: 800, height: 1000 }
      }
    }).filter((img: any) => img.url),
    category: doc.category || '',
    sizes: [],
    colors: [],
    materials: [],
    inStock: true,
    tags: doc.isFeatured ? ['featured'] : [],
    featured: doc.isFeatured || false,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.createdAt || new Date().toISOString(),
  }
}

function mapCategory(doc: any): Category {
  return {
    id: doc._id || '',
    name: doc.name || '',
    slug: doc.slug || '',
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await fetchSanityData<any[]>(
    'getAllProducts',
    getAllProductsQuery,
    { revalidate: 60, tags: ['products'], fallback: [] }
  )
  return products.map(mapProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await fetchSanityData<any[]>(
    'getFeaturedProducts',
    getFeaturedProductsQuery,
    { revalidate: 60, tags: ['products', 'featured'], fallback: [] }
  )
  return products.map(mapProduct)
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchSanityData<any[]>(
    'getCategories',
    getCategoriesQuery,
    { revalidate: 60, tags: ['categories'], fallback: [] }
  )
  return categories.map(mapCategory)
}

export async function getBanner(): Promise<any> {
  const banner = await fetchSanityData<any>(
    'getBanner',
    getBannerQuery,
    { revalidate: 60, tags: ['banner'], fallback: null }
  )
  return banner
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await fetchSanityData<any | null>(
    'getProductBySlug',
    getProductBySlugQuery,
    { params: { slug }, revalidate: 60, tags: [`product:${slug}`], fallback: null }
  )
  return product ? mapProduct(product) : null
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await fetchSanityData<any | null>(
    'getCategoryBySlug',
    getCategoryBySlugQuery,
    { params: { slug }, revalidate: 60, tags: [`category:${slug}`], fallback: null }
  )
  return category ? mapCategory(category) : null
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await fetchSanityData<any[]>(
    'getProductsByCategory',
    getProductsByCategorySlugQuery,
    { params: { categorySlug }, revalidate: 60, tags: ['products', `category:${categorySlug}`], fallback: [] }
  )
  return products.map(mapProduct)
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (!searchQuery.trim()) return []
  const products = await fetchSanityData<any[]>(
    'searchProducts',
    searchProductsQuery,
    { params: { searchQuery }, revalidate: 0, fallback: [] }
  )
  return products.map(mapProduct)
}

export async function getCollections() {
  return []
}
