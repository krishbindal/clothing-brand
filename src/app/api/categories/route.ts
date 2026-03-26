import { NextRequest, NextResponse } from 'next/server'
import { getCategories, getCategoryBySlug } from '@/lib/sanity'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const slug = searchParams.get('slug')

    if (slug) {
      const category = await getCategoryBySlug(slug)
      return NextResponse.json({ category })
    }

    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
