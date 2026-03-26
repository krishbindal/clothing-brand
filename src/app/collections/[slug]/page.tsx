import { getCategoryBySlug, getProductsByCategory } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CategoryClient from './CategoryClient'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | LUXE Collections`,
    description: category.description || `Explore our ${category.name} collection`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  const products = await getProductsByCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-brand-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-white transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/collections" className="hover:text-brand-white transition-colors">
            Collections
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-white">{category.name}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white mb-4 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-brand-gray-300 text-lg max-w-3xl font-light leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Client-side filtering and sorting */}
        <CategoryClient products={products} categoryName={category.name} />
      </div>
    </main>
  )
}
