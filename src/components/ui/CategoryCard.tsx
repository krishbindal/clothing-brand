import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface CategoryCardProps {
  name: string
  slug: string
  image: string
  productCount?: number
}

export default function CategoryCard({ name, slug, image, productCount }: CategoryCardProps) {
  return (
    <Link href={`/collections/${slug}`} className="group block relative overflow-hidden rounded-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/5] overflow-hidden bg-brand-card"
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-all duration-800 ease-luxury group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-600 ease-luxury" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <motion.h3
            className="font-display text-3xl md:text-4xl font-bold text-brand-white mb-2 tracking-tight group-hover:text-brand-gold transition-colors duration-400"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>

          {productCount !== undefined && (
            <p className="text-brand-gray-300 text-sm uppercase tracking-wider font-light">
              {productCount} {productCount === 1 ? 'Product' : 'Products'}
            </p>
          )}

          {/* Decorative line */}
          <div className="mt-4 w-12 h-px bg-brand-gold origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-luxury" />
        </div>
      </motion.div>
    </Link>
  )
}
