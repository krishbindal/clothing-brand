export interface SanityImageAsset {
  url?: string
  width?: number
  height?: number
  alt?: string
  asset?: {
    _id: string
    url?: string
    altText?: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
}

export interface SanityProduct {
  id: string
  name: string
  slug?: string
  price: number
  description?: string
  image?: SanityImageAsset | null
  stock?: number
  featured?: boolean
  images?: SanityImageAsset[]
  category?: string
  categorySlug?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface SanityCategory {
  id: string
  name: string
  slug?: string
  productCount?: number
  cover?: SanityImageAsset | null
}

export interface SanityBanner {
  title: string
  subtitle?: string
  image?: SanityImageAsset | null
  ctaText?: string
  ctaLink?: string
}
