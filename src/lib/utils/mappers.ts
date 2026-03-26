import type { Category, Product } from '@/types'
import type { SanityCategoryDocument, SanityProductDocument } from '@/lib/sanity/types'

const DEFAULT_IMAGE_DIMENSIONS = { width: 800, height: 1000 }

export function mapProduct(doc: SanityProductDocument): Product {
  return {
    ...doc,
    slug: doc.slug || '',
    description: doc.description || '',
    category: doc.category || '',
    featured: Boolean(doc.featured),
    images:
      doc.images?.map((url: string) => ({
        url,
        alt: doc.name,
        width: DEFAULT_IMAGE_DIMENSIONS.width,
        height: DEFAULT_IMAGE_DIMENSIONS.height,
      })) || [],
    sizes: doc.sizes?.map((size: string) => ({ label: size, available: doc.inStock })) || [],
    colors: doc.colors?.map((color: string) => ({ name: color, hex: '#000000', available: doc.inStock })) || [],
    materials: [],
    tags: [],
  }
}

export function mapProducts(docs: SanityProductDocument[] = []): Product[] {
  return docs.map(mapProduct)
}

export function mapCategory(doc: SanityCategoryDocument): Category {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
    image: doc.image,
    description: doc.description,
    productCount: doc.productCount,
  }
}

export function mapCategories(docs: SanityCategoryDocument[] = []): Category[] {
  return docs.map(mapCategory)
}
