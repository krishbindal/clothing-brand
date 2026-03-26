import { createClient, groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { Product } from '@/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const isSanityConfigured = Boolean(projectId && dataset)

export const sanityClient = isSanityConfigured
  ? createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_TOKEN,
  })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function urlFor(source: unknown) {
  if (!builder) return null
  return builder.image(source)
}

interface SanityImage {
  _type?: 'image'
  asset?: {
    _ref?: string
    _type?: 'reference'
  }
  alt?: string
}

interface SanityProduct {
  _id: string
  _createdAt: string
  _updatedAt: string
  name: string
  slug: string
  price: number
  discountPrice?: number
  images?: SanityImage[]
  description: string
  category: string
  sizes?: string[]
  inStock: boolean
}

export interface HomepageContent {
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: unknown
}

export interface SanityCollection {
  _id: string
  title: string
  slug: string
  description: string
  productCount: number
}

const productProjection = `
  _id,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  price,
  discountPrice,
  images,
  description,
  category,
  sizes,
  inStock
`

function toProduct(product: SanityProduct, featured = false): Product {
  const images = (product.images || [])
    .map((image) => {
      if (!image?.asset?._ref) return null
      const url = urlFor(image)?.width(1200).height(1500).fit('crop').url()
      if (!url) return null

      return {
        url,
        alt: image.alt || product.name,
        width: 1200,
        height: 1500,
      }
    })
    .filter((image): image is NonNullable<typeof image> => Boolean(image))

  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.discountPrice || product.price,
    comparePrice: product.discountPrice ? product.price : undefined,
    images,
    category: product.category,
    sizes: (product.sizes || []).map((size) => ({
      label: size,
      available: product.inStock,
    })),
    colors: [],
    materials: [],
    inStock: product.inStock,
    tags: [],
    featured,
    createdAt: product._createdAt,
    updatedAt: product._updatedAt,
  }
}

export async function getHomepageContent(): Promise<HomepageContent | null> {
  if (!isSanityConfigured) return null

  return sanityClient!.fetch(
    groq`*[_type == "homepage"][0] {
      heroTitle,
      heroSubtitle,
      heroImage
    }`,
    {},
    { next: { revalidate: 60, tags: ['sanity:homepage'] } }
  )
}

export async function getAllProducts(category?: string): Promise<Product[]> {
  if (!isSanityConfigured) {
    const fallbackProducts = getFallbackProducts()
    if (!category) return fallbackProducts
    return fallbackProducts.filter((product) => product.category === category)
  }

  const query = category
    ? groq`*[_type == "product" && category == $category] | order(_createdAt desc) { ${productProjection} }`
    : groq`*[_type == "product"] | order(_createdAt desc) { ${productProjection} }`

  const products = await sanityClient!.fetch<SanityProduct[]>(
    query,
    category ? { category } : {},
    { next: { revalidate: 60, tags: ['sanity:products'] } }
  )

  return products.map((product) => toProduct(product))
}

export function getFallbackProducts(): Product[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'fallback-1',
      name: 'Obsidian Oversized Tee',
      slug: 'obsidian-oversized-tee',
      description: 'Premium heavyweight cotton in obsidian black.',
      price: 89,
      comparePrice: 120,
      images: [{ url: '/images/product-1.jpg', alt: 'Obsidian Tee', width: 800, height: 1000 }],
      category: 'tops',
      sizes: [
        { label: 'XS', available: true },
        { label: 'S', available: true },
        { label: 'M', available: true },
        { label: 'L', available: true },
      ],
      colors: [{ name: 'Obsidian', hex: '#0A0A0A', available: true }],
      materials: ['100% Heavyweight Cotton'],
      inStock: true,
      tags: ['new', 'bestseller'],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'fallback-2',
      name: 'Shadow Cargo Pants',
      slug: 'shadow-cargo-pants',
      description: 'Technical fabric with deep pockets and premium finish.',
      price: 195,
      images: [{ url: '/images/product-2.jpg', alt: 'Shadow Cargo', width: 800, height: 1000 }],
      category: 'bottoms',
      sizes: [
        { label: 'S', available: true },
        { label: 'M', available: true },
        { label: 'L', available: true },
      ],
      colors: [{ name: 'Black', hex: '#111111', available: true }],
      materials: ['65% Polyester', '35% Cotton'],
      inStock: true,
      tags: ['new'],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'fallback-3',
      name: 'Void Hoodie',
      slug: 'void-hoodie',
      description: 'The darkness you wear. Ultra-soft fleece interior.',
      price: 245,
      comparePrice: 295,
      images: [{ url: '/images/product-3.jpg', alt: 'Void Hoodie', width: 800, height: 1000 }],
      category: 'tops',
      sizes: [
        { label: 'S', available: true },
        { label: 'M', available: true },
        { label: 'L', available: true },
        { label: 'XL', available: true },
      ],
      colors: [{ name: 'Void Black', hex: '#080808', available: true }],
      materials: ['80% Cotton', '20% Polyester'],
      inStock: true,
      tags: ['bestseller'],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'fallback-4',
      name: 'Eclipse Jacket',
      slug: 'eclipse-jacket',
      description: 'Structured outerwear with gold hardware.',
      price: 425,
      images: [{ url: '/images/product-4.jpg', alt: 'Eclipse Jacket', width: 800, height: 1000 }],
      category: 'outerwear',
      sizes: [
        { label: 'S', available: true },
        { label: 'M', available: true },
      ],
      colors: [{ name: 'Black', hex: '#0A0A0A', available: true }],
      materials: ['Wool blend', 'Silk lining'],
      inStock: true,
      tags: ['limited'],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) {
    return getFallbackProducts().find((product) => product.slug === slug) || null
  }

  const product = await sanityClient!.fetch<SanityProduct | null>(
    groq`*[_type == "product" && slug.current == $slug][0] { ${productProjection} }`,
    { slug },
    { next: { revalidate: 60, tags: ['sanity:products', `sanity:product:${slug}`] } }
  )

  if (!product) return null
  return toProduct(product)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSanityConfigured) {
    return getFallbackProducts().filter((product) => product.featured)
  }

  const products = await sanityClient!.fetch<SanityProduct[] | null>(
    groq`*[_type == "homepage"][0]{
      "featuredProducts": featuredProducts[]->{ ${productProjection} }
    }.featuredProducts`,
    {},
    { next: { revalidate: 60, tags: ['sanity:homepage', 'sanity:products'] } }
  )

  return (products || []).map((product) => toProduct(product, true))
}

export async function getCollections(): Promise<SanityCollection[]> {
  if (!isSanityConfigured) {
    return [
      {
        _id: 'fallback-collection-1',
        title: 'The Shadow Line',
        slug: 'shadow-line',
        description: 'Obsidian-dark essentials. Crafted for the night.',
        productCount: 24,
      },
      {
        _id: 'fallback-collection-2',
        title: 'Golden Hour',
        slug: 'golden-hour',
        description: 'Accented pieces that catch and hold the light.',
        productCount: 18,
      },
      {
        _id: 'fallback-collection-3',
        title: 'Void Series',
        slug: 'void-series',
        description: 'Minimal. Architectural. Without limit.',
        productCount: 31,
      },
    ]
  }

  return sanityClient!.fetch(
    groq`*[_type == "collection"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "productCount": count(products[])
    }`,
    {},
    { next: { revalidate: 60, tags: ['sanity:collections'] } }
  )
}
