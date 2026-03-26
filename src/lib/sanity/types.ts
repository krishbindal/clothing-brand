export interface SanityProductDocument {
  id: string
  name: string
  slug?: string
  description?: string
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

export interface SanityCategoryDocument {
  id: string
  name: string
  slug?: string
  image?: string
  description?: string
  productCount?: number
}
