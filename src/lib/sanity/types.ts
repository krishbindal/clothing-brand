export interface SanityImageAsset {
  url: string
  width?: number
  height?: number
  alt?: string
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
  createdAt: string
  updatedAt: string
}

export interface SanityCategory {
  id: string
  name: string
  slug?: string
  productCount?: number
}

export interface SanityBanner {
  title: string
  image?: string
  link?: string
}
