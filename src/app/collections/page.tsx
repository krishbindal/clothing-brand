import { getCategories } from '@/lib/sanity'
import CategoryCard from '@/components/ui/CategoryCard'
import EmptyState from '@/components/ui/EmptyState'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections | LUXE',
  description: 'Explore our curated collections of luxury fashion',
}

export default async function CollectionsPage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-brand-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-white mb-6 tracking-tight">
            Collections
          </h1>
          <p className="text-brand-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover our carefully curated collections, each telling its own story of luxury and
            sophistication
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                image={category.image || '/placeholder.jpg'}
                productCount={category.productCount}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Collections Available"
            description="We're currently curating our collections. Check back soon for our latest offerings."
            actionLabel="Browse All Products"
            actionHref="/shop"
          />
        )}
      </div>
    </main>
  )
}
