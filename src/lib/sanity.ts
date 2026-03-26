import { createClient, groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { Product } from '@/types'

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

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
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
  const products = await sanityClient.fetch(query, category ? { category } : {}, { next: { revalidate: 60, tags: ['products'] } })
  
  return products.map((p: any) => ({
    ...p,
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
  const p = await sanityClient.fetch(query, { slug }, { next: { revalidate: 60, tags: [`product:${slug}`] } })
  if (!p) return null

  return {
    ...p,
    images: p.images?.map((url: string) => ({ url, alt: p.name, width: 800, height: 1000 })) || [],
    sizes: p.sizes?.map((size: string) => ({ label: size, available: p.inStock })) || [],
    colors: p.colors?.map((color: string) => ({ name: color, hex: '#000000', available: p.inStock })) || [],
    materials: [],
    tags: []
  }
}

export async function getCategories() {
  if (!isSanityConfigured) return []
  const query = groq`*[_type == "category"] { "id": _id, name, "slug": slug.current }`
  return await sanityClient.fetch(query, {}, { next: { revalidate: 60, tags: ['categories'] } })
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
