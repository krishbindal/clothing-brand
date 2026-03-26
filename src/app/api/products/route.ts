import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    console.error('Products API error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
