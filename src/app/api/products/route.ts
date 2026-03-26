import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getFeaturedProducts, getProductBySlug } from '@/lib/sanity'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const slug = searchParams.get('slug')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    if (slug) {
      const [product, featuredProducts] = await Promise.all([getProductBySlug(slug), getFeaturedProducts()])
      return NextResponse.json({ product, featuredProducts })
    }

    const products =
      featured === 'true'
        ? await getFeaturedProducts()
        : await getAllProducts(category || undefined)
    const total = products.length
    const paginatedProducts = products.slice(skip, skip + limit)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('Products API error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
