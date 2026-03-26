import { createClient, groq } from 'next-sanity'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { Product } from '@/types'
import type { Category } from '@/types'

interface SanityProductResponse {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  inStock: boolean
  images?: string[]
  category?: string
  sizes?: string[]
  colors?: string[]
  featured?: boolean
  createdAt: string
  updatedAt: string
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'gbjuq696'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-03-26'

export const isSanityConfigured = Boolean(projectId && dataset)

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

async function fetchSanitySafely<T>(
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error('Sanity fetch failed:', error)
    return fallback
  }
}

export async function getAllProducts(category?: string): Promise<Product[]> {
  if (!isSanityConfigured) return []

  const query = category
    ? groq`
    *[_type == "product" && category->name == $category] | order(_createdAt desc) {
      "id": _id,
      name,
      "slug": slug.current,
      price,
      "comparePrice": discountPrice,
      inStock,
      "images": images[].asset->url,
      "category": category->name,
      "sizes": sizes,
      "colors": colors,
      "description": pt::text(description),
      "featured": featured,
      "createdAt": _createdAt,
      "updatedAt": _updatedAt
    }
  ` : groq`
    *[_type == "product"] | order(_createdAt desc) {
      "id": _id,
      name,
      "slug": slug.current,
      price,
      "comparePrice": discountPrice,
      inStock,
      "images": images[].asset->url,
      "category": category->name,
      "sizes": sizes,
      "colors": colors,
      "description": pt::text(description),
      "featured": featured,
      "createdAt": _createdAt,
      "updatedAt": _updatedAt
    }
  `
  const products = await fetchSanitySafely<SanityProductResponse[]>(
    () =>
      sanityClient.fetch(
        query,
        category ? { category } : {},
        { next: { revalidate: 60, tags: ['products'] } }
      ),
    []
  )
  
  return products.map((p: SanityProductResponse) => ({
    ...p,
    category: p.category || '',
    featured: Boolean(p.featured),
    images: p.images?.map((url: string) => ({ url, alt: p.name, width: 800, height: 1000 })) || [],
    sizes: p.sizes?.map((size: string) => ({ label: size, available: p.inStock })) || [],
    colors: p.colors?.map((color: string) => ({ name: color, hex: '#000000', available: p.inStock })) || [],
    materials: [],
    tags: []
  }))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) return null

  const query = groq`
    *[_type == "product" && slug.current == $slug][0] {
      "id": _id,
      name,
      "slug": slug.current,
      price,
      "comparePrice": discountPrice,
      inStock,
      "images": images[].asset->url,
      "category": category->name,
      "sizes": sizes,
      "colors": colors,
      "description": pt::text(description),
      "featured": featured,
      "createdAt": _createdAt,
      "updatedAt": _updatedAt
    }
  `
  const p = await fetchSanitySafely<SanityProductResponse | null>(
    () =>
      sanityClient.fetch(query, { slug }, { next: { revalidate: 60, tags: [`product:${slug}`] } }),
    null,
  )
  if (!p) return null

  return {
    ...p,
    category: p.category || '',
    featured: Boolean(p.featured),
    images: p.images?.map((url: string) => ({ url, alt: p.name, width: 800, height: 1000 })) || [],
    sizes: p.sizes?.map((size: string) => ({ label: size, available: p.inStock })) || [],
    colors: p.colors?.map((color: string) => ({ name: color, hex: '#000000', available: p.inStock })) || [],
    materials: [],
    tags: []
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return []
  const query = groq`*[_type == "category"] {
    "id": _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
  return await fetchSanitySafely<Category[]>(
    () => sanityClient.fetch(query, {}, { next: { revalidate: 60, tags: ['categories'] } }),
    []
  )
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSanityConfigured) return null
  const query = groq`*[_type == "category" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    description
  }`
  return await fetchSanitySafely<Category | null>(
    () =>
      sanityClient.fetch(query, { slug }, { next: { revalidate: 60, tags: [`category:${slug}`] } }),
    null,
  )
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isSanityConfigured) return []

  const query = groq`
    *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
      "id": _id,
      name,
      "slug": slug.current,
      price,
      "comparePrice": discountPrice,
      inStock,
      "images": images[].asset->url,
      "category": category->name,
      "sizes": sizes,
      "colors": colors,
      "description": pt::text(description),
      "featured": featured,
      "createdAt": _createdAt,
      "updatedAt": _updatedAt
    }
  `

  const products = await fetchSanitySafely<SanityProductResponse[]>(
    () =>
      sanityClient.fetch(query, { categorySlug }, { next: { revalidate: 60, tags: ['products', `category:${categorySlug}`] } }),
    []
  )

  return products.map((p: SanityProductResponse) => ({
    ...p,
    category: p.category || '',
    featured: Boolean(p.featured),
    images: p.images?.map((url: string) => ({ url, alt: p.name, width: 800, height: 1000 })) || [],
    sizes: p.sizes?.map((size: string) => ({ label: size, available: p.inStock })) || [],
    colors: p.colors?.map((color: string) => ({ name: color, hex: '#000000', available: p.inStock })) || [],
    materials: [],
    tags: []
  }))
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (!isSanityConfigured || !searchQuery.trim()) return []

  const query = groq`
    *[_type == "product" && (
      name match $searchQuery + "*" ||
      pt::text(description) match $searchQuery + "*" ||
      category->name match $searchQuery + "*"
    )] | order(_createdAt desc) {
      "id": _id,
      name,
      "slug": slug.current,
      price,
      "comparePrice": discountPrice,
      inStock,
      "images": images[].asset->url,
      "category": category->name,
      "sizes": sizes,
      "colors": colors,
      "description": pt::text(description),
      "featured": featured,
      "createdAt": _createdAt,
      "updatedAt": _updatedAt
    }
  `

  const products = await fetchSanitySafely<SanityProductResponse[]>(
    () => sanityClient.fetch(query, { searchQuery }, { next: { revalidate: 0 } }),
    []
  )

  return products.map((p: SanityProductResponse) => ({
    ...p,
    category: p.category || '',
    featured: Boolean(p.featured),
    images: p.images?.map((url: string) => ({ url, alt: p.name, width: 800, height: 1000 })) || [],
    sizes: p.sizes?.map((size: string) => ({ label: size, available: p.inStock })) || [],
    colors: p.colors?.map((color: string) => ({ name: color, hex: '#000000', available: p.inStock })) || [],
    materials: [],
    tags: []
  }))
}

export async function getHomepageContent() {
  return null // Placeholder for missing existing functionality if needed elsewhere
}

export async function getCollections() { 
  return []
}

export async function getFeaturedProducts() {
  return getAllProducts()
}
