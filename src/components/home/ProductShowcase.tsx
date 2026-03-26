'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types'

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Obsidian Oversized Tee',
    slug: 'obsidian-oversized-tee',
    description: 'Premium heavyweight cotton in obsidian black.',
    price: 89,
    comparePrice: 120,
    images: [{ url: '/images/product-1.jpg', alt: 'Obsidian Tee', width: 800, height: 1000 }],
    category: 'tops',
    sizes: [
      { label: 'XS', available: true },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: false },
    ],
    colors: [{ name: 'Obsidian', hex: '#0A0A0A', available: true }],
    materials: ['100% Heavyweight Cotton'],
    inStock: true,
    tags: ['new', 'bestseller'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Shadow Cargo Pants',
    slug: 'shadow-cargo-pants',
    description: 'Technical fabric with deep pockets and premium finish.',
    price: 195,
    images: [{ url: '/images/product-2.jpg', alt: 'Shadow Cargo', width: 800, height: 1000 }],
    category: 'bottoms',
    sizes: [
      { label: 'XS', available: false },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: true },
    ],
    colors: [
      { name: 'Black', hex: '#111111', available: true },
      { name: 'Slate', hex: '#334155', available: true },
    ],
    materials: ['65% Polyester', '35% Cotton'],
    inStock: true,
    tags: ['new'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Void Hoodie',
    slug: 'void-hoodie',
    description: 'The darkness you wear. Ultra-soft fleece interior.',
    price: 245,
    comparePrice: 295,
    images: [{ url: '/images/product-3.jpg', alt: 'Void Hoodie', width: 800, height: 1000 }],
    category: 'tops',
    sizes: [
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: true },
    ],
    colors: [{ name: 'Void Black', hex: '#080808', available: true }],
    materials: ['80% Cotton', '20% Polyester'],
    inStock: true,
    tags: ['bestseller'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Eclipse Jacket',
    slug: 'eclipse-jacket',
    description: 'Structured outerwear with gold hardware.',
    price: 425,
    images: [{ url: '/images/product-4.jpg', alt: 'Eclipse Jacket', width: 800, height: 1000 }],
    category: 'outerwear',
    sizes: [
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: false },
    ],
    colors: [
      { name: 'Black', hex: '#0A0A0A', available: true },
      { name: 'Charcoal', hex: '#1a1a1a', available: true },
    ],
    materials: ['Wool blend', 'Silk lining'],
    inStock: true,
    tags: ['limited'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const tabs = ['All', 'New Arrivals', 'Bestsellers', 'Sale']

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <section className="section-padding bg-brand-black">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-2">Featured</p>
            <h2 className="text-display-md font-display font-bold text-brand-white">The Drop</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-brand-card rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-medium rounded transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-brand-gold text-brand-black'
                    : 'text-brand-gray-400 hover:text-brand-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link href="/shop" className="btn-secondary group">
            View All Products
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
