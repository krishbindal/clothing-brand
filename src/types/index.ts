export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: ProductImage[]
  category: string
  collection?: string
  sizes: ProductSize[]
  colors: ProductColor[]
  materials: string[]
  inStock: boolean
  stockCount?: number
  tags: string[]
  featured: boolean
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface ProductSize {
  label: string
  available: boolean
  stockCount?: number
}

export interface ProductColor {
  name: string
  hex: string
  available: boolean
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface Order {
  id: string
  userId?: string | null
  guestEmail?: string | null
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discountAmount?: number
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentIntentId?: string
  discountCodeId?: string | null
  discountCode?: DiscountCode | null
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  size: string
  color: string
  price: number
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface Address {
  id?: string
  firstName: string
  lastName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export interface User {
  id: string
  name?: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  role: UserRole
  createdAt: string
}

export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  title: string
  body: string
  fitFeedback?: 'runs_small' | 'true_to_size' | 'runs_large'
  verified: boolean
  createdAt: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  image: ProductImage
  featured: boolean
  productCount?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
  productCount?: number
}

export interface FilterState {
  categories: string[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  inStock: boolean
  sortBy: SortOption
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating'

export interface SizeRecommendation {
  recommendedSize: string
  confidence: number
  note: string
}

export interface CheckoutFormData {
  email: string
  shippingAddress: Address
  saveAddress: boolean
}

export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface DiscountCode {
  id: string
  code: string
  description?: string
  type: DiscountType
  value: number
  active: boolean
  usageLimit?: number | null
  usedCount: number
  startsAt?: string | null
  expiresAt?: string | null
  minimumSubtotal?: number | null
  createdAt: string
  updatedAt: string
}

export type AnalyticsEventType = 'PAGE_VIEW' | 'PRODUCT_CLICK' | 'ADD_TO_CART'

export interface AnalyticsEvent {
  id: string
  userId?: string | null
  sessionId: string
  type: AnalyticsEventType
  path: string
  productId?: string | null
  metadata?: Record<string, unknown>
  createdAt: string
}
