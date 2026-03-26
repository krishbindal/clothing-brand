import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}

export async function getHomepageContent() {
  return sanityClient.fetch(`
    *[_type == "homepage"][0] {
      heroTitle,
      heroSubtitle,
      heroCTA,
      heroImage,
      featuredCollections[] {
        title,
        subtitle,
        image,
        "slug": collection->slug.current,
      },
      announcementBar,
      storySection {
        title,
        content,
        image,
      },
      seo {
        title,
        description,
        image,
      }
    }
  `)
}

export async function getSanityProducts(filters?: {
  category?: string
  collection?: string
  featured?: boolean
  limit?: number
}) {
  let query = `*[_type == "product"`
  const params: Record<string, unknown> = {}

  if (filters?.category) {
    query += ` && category == $category`
    params.category = filters.category
  }
  if (filters?.collection) {
    query += ` && collection == $collection`
    params.collection = filters.collection
  }
  if (filters?.featured !== undefined) {
    query += ` && featured == $featured`
    params.featured = filters.featured
  }

  query += `] | order(_createdAt desc)`

  if (filters?.limit) {
    query += `[0...$limit]`
    params.limit = filters.limit - 1
  }

  query += ` {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    comparePrice,
    images,
    category,
    collection,
    sizes,
    colors,
    materials,
    inStock,
    stockCount,
    tags,
    featured,
  }`

  return sanityClient.fetch(query, params)
}
