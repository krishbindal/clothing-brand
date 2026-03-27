import Image from 'next/image'
import Link from 'next/link'
import { Category, Product } from '@/types'

interface CategoryShowcaseProps {
  categories: Category[]
  fallbackProducts: Product[]
}

const gradientPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%2318181b" offset="0%"/><stop stop-color="%23333339" offset="50%"/><stop stop-color="%23241c10" offset="100%"/></linearGradient></defs><rect width="400" height="500" fill="url(%23g)"/></svg>',
  )

export default function CategoryShowcase({ categories, fallbackProducts }: CategoryShowcaseProps) {
  const fallbackEntries = fallbackProducts
    .filter((p) => p.category)
    .map<[string, string | undefined]>((product) => [product.category, product.images?.[0]?.url])
    .filter((entry): entry is [string, string] => Boolean(entry[1]))

  const fallbackMap = new Map<string, string>(fallbackEntries)

  const tiles =
    categories.length > 0
      ? categories
      : Array.from(
          new Map(
            fallbackProducts
              .filter((p) => p.category)
              .map((p) => [p.category, p]),
          ).values(),
        ).map((p) => ({
          id: p.id,
          name: p.category,
          slug: p.category.toLowerCase().replace(/\s+/g, '-'),
          image: p.images?.[0]?.url,
          productCount: undefined,
        }))

  if (!tiles.length) return null

  return (
    <section className="bg-brand-black border-t border-brand-border/30">
      <div className="container-wide py-16 sm:py-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="section-overline">Refine your edit</p>
            <h2 className="section-title">Collections by mood</h2>
            <p className="text-brand-gray-400 max-w-2xl mt-2">
              Step into tailored worlds — utility street, luxe minimalism, statement outerwear. Each
              collection is art directed for discovery.
            </p>
          </div>
          <Link
            href="/collections"
            className="text-sm text-brand-gray-300 hover:text-brand-gold transition-colors hover-line"
          >
            View all collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {tiles.slice(0, 8).map((category, idx) => {
            const image =
              category.image ||
              fallbackMap.get(category.name) ||
              gradientPlaceholder
            const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'edits'
            return (
              <Link
                key={category.id || category.slug || category.name || idx}
                href={`/collections/${slug}`}
                className="group relative overflow-hidden rounded-xl border border-brand-border/50 bg-brand-card"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={idx < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.18),transparent_40%)]" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 space-y-2 pointer-events-none">
                  <p className="text-xs uppercase tracking-[0.35em] text-brand-gold/80">
                    Curated drop
                  </p>
                  <h3 className="text-2xl font-display font-semibold text-brand-white tracking-tight group-hover:text-brand-gold transition-colors">
                    {category.name}
                  </h3>
                  {category.productCount !== undefined && (
                    <p className="text-brand-gray-300 text-xs uppercase tracking-[0.25em]">
                      {category.productCount} pieces
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
