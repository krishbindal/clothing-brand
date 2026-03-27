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
  stock?: number
  featured?: boolean
  images?: SanityImageAsset[]
  category?: string
  categorySlug?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface SanityCategory {
  id: string
  name: string
  slug?: string
  productCount?: number
  coverImage?: SanityImageAsset
  cover?: SanityImageAsset | null
}

export interface SanityBanner {
  title: string
  image?: string
  link?: string
}
