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
  _id: string
  title?: string
  slug?: string | { current?: string }
  price: number
  description?: string
  images?: SanityImageAsset[]
  image?: SanityImageAsset | null
  stock?: number
  isFeatured?: boolean
  category?: string | { name?: string; slug?: { current?: string } }
  categorySlug?: string | { current?: string }
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface SanityCategory {
  _id: string
  name: string
  slug?: string | { current?: string }
  productCount?: number
  cover?: SanityImageAsset | null
}

export interface SanityBanner {
  title: string
  subtitle?: string
  eyebrow?: string
  image?: SanityImageAsset | null
  cta?: {
    label?: string
    href?: string
  }
}
