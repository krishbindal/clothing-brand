import { Category, Order, Product } from '@/types'
import { SanityBanner } from './sanity/types'

const baseSizes = [
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: true },
  { label: 'XL', available: true },
]

const baseColors = [
  { name: 'Onyx', hex: '#0f0f0f', available: true },
  { name: 'Fog', hex: '#cbd5e1', available: true },
  { name: 'Umber', hex: '#5c4433', available: true },
  { name: 'Steel', hex: '#94a3b8', available: true },
]

const now = Date.now()

export const demoProducts: Product[] = [
  {
    id: 'demo_aether_bomber',
    name: 'Aether Bomber',
    slug: 'aether-bomber',
    description: 'Featherweight Italian nylon with matte hardware, cut for a cropped, architectural silhouette.',
    price: 420,
    comparePrice: 520,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542293787938-4d4e6c1f75b9?auto=format&fit=crop&w=1400&q=80',
        alt: 'Aether Bomber',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'Streetwear',
    sizes: baseSizes,
    colors: baseColors,
    materials: ['Italian nylon', 'Metal hardware'],
    inStock: true,
    stockCount: 8,
    tags: ['new', 'trending'],
    featured: true,
    rating: 4.9,
    reviewCount: 124,
    createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_seraph_overshirt',
    name: 'Seraph Overshirt',
    slug: 'seraph-overshirt',
    description: 'Structured wool-cashmere blend with tonal pick-stitching and hidden snap closures.',
    price: 320,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
        alt: 'Seraph Overshirt',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'Essentials',
    sizes: baseSizes,
    colors: baseColors,
    materials: ['Wool-cashmere', 'Viscose lining'],
    inStock: true,
    stockCount: 3,
    tags: ['new', 'low-stock'],
    featured: true,
    createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_obsidian_coat',
    name: 'Obsidian Tailored Coat',
    slug: 'obsidian-tailored-coat',
    description: 'Double-faced cashmere with sculpted shoulders, satin piping, and hand-finished seams.',
    price: 780,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1400&q=80',
        alt: 'Obsidian Tailored Coat',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'Luxury',
    sizes: baseSizes,
    colors: [
      { name: 'Carbon', hex: '#1f1f1f', available: true },
      { name: 'Ash', hex: '#4a4a4a', available: true },
    ],
    materials: ['Cashmere', 'Silk satin'],
    inStock: true,
    stockCount: 6,
    tags: ['trending'],
    featured: true,
    createdAt: new Date(now - 24 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_ion_knit_set',
    name: 'Ion Knit Set',
    slug: 'ion-knit-set',
    description: 'Technical knit hoodie and track pant with laser-cut ventilation and bonded seams.',
    price: 350,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
        alt: 'Ion Knit Set',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'New Drops',
    sizes: baseSizes,
    colors: [
      { name: 'Shadow', hex: '#121212', available: true },
      { name: 'Slate', hex: '#2f2f30', available: true },
    ],
    materials: ['Technical knit', 'Bonded seams'],
    inStock: true,
    stockCount: 2,
    tags: ['new', 'low-stock'],
    featured: false,
    createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_noir_cargo',
    name: 'Noir Technical Cargo',
    slug: 'noir-technical-cargo',
    description: 'Tapered Italian ripstop cargo with water-resistant coating and magnetic pockets.',
    price: 260,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80',
        alt: 'Noir Technical Cargo',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'Streetwear',
    sizes: baseSizes,
    colors: [
      { name: 'Onyx', hex: '#0f0f0f', available: true },
      { name: 'Olive', hex: '#3d4a36', available: true },
    ],
    materials: ['Italian ripstop', 'Water-resistant coating'],
    inStock: true,
    stockCount: 14,
    tags: ['trending'],
    featured: true,
    createdAt: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_eclipse_shirt',
    name: 'Eclipse Silk Shirt',
    slug: 'eclipse-silk-shirt',
    description: 'Washed silk charmeuse with micro-pleated collar and matte enamel buttons.',
    price: 540,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80',
        alt: 'Eclipse Silk Shirt',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'Luxury',
    sizes: baseSizes,
    colors: [
      { name: 'Ink', hex: '#0b0b0c', available: true },
      { name: 'Pearl', hex: '#f5f5f5', available: true },
    ],
    materials: ['Silk charmeuse'],
    inStock: true,
    stockCount: 9,
    tags: ['new'],
    featured: false,
    createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_pulse_runner',
    name: 'Pulse Runner',
    slug: 'pulse-runner',
    description: 'Hand-lasted leather runner with carbon fiber plate and smoked translucent outsole.',
    price: 380,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
        alt: 'Pulse Runner',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'New Drops',
    sizes: [
      { label: '40', available: true },
      { label: '41', available: true },
      { label: '42', available: true },
      { label: '43', available: true },
    ],
    colors: [
      { name: 'Carbon', hex: '#1b1b1b', available: true },
      { name: 'Ivory', hex: '#e5e5e5', available: true },
    ],
    materials: ['Leather', 'Carbon fiber'],
    inStock: true,
    stockCount: 4,
    tags: ['trending', 'low-stock'],
    featured: true,
    createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_monolith_denim',
    name: 'Monolith Selvedge Denim',
    slug: 'monolith-selvedge-denim',
    description: 'Japanese 16oz black selvedge with resin-coated finish and tonal bartacks.',
    price: 290,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
        alt: 'Monolith Selvedge Denim',
        width: 1400,
        height: 1750,
      },
    ],
    category: 'Essentials',
    sizes: [
      { label: '28', available: true },
      { label: '30', available: true },
      { label: '32', available: true },
      { label: '34', available: true },
    ],
    colors: [{ name: 'Ink', hex: '#0d0d0d', available: true }],
    materials: ['Japanese selvedge denim'],
    inStock: true,
    stockCount: 11,
    tags: ['new'],
    featured: false,
    createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const demoCategories: Category[] = [
  { id: 'streetwear', name: 'Streetwear', slug: 'streetwear' },
  { id: 'essentials', name: 'Essentials', slug: 'essentials' },
  { id: 'luxury', name: 'Luxury', slug: 'luxury' },
  { id: 'new-drops', name: 'New Drops', slug: 'new-drops' },
]

export const demoBanner: SanityBanner = {
  title: 'Nightfall Atelier',
  subtitle: 'A capsule of architectural silhouettes, matte blacks, and quiet metallics crafted for the modern vanguard.',
  eyebrow: 'New Drop · Limited Run',
  featured: true,
  image: {
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=90',
    width: 1800,
    height: 1100,
    alt: 'Nightfall Atelier banner',
  },
  cta: {
    label: 'Explore Collection',
    href: '/shop',
  },
}

export const liveCities = ['Delhi', 'Paris', 'New York', 'Seoul', 'Dubai', 'Tokyo', 'London', 'Sydney', 'Toronto', 'Los Angeles']

export function getDemoOrders(userId?: string): Order[] {
  const shipping = {
    id: 'demo_address',
    firstName: 'Ava',
    lastName: 'Luxe',
    line1: '18 Mercer St',
    city: 'New York',
    state: 'NY',
    postalCode: '10013',
    country: 'USA',
    phone: '+1 212 555 0147',
  }

  const first = demoProducts[0]
  const second = demoProducts[4]
  const third = demoProducts[2]

  const orders: Order[] = [
    {
      id: 'INV-9843',
      userId: userId || 'guest',
      guestEmail: 'client@luxe.studio',
      items: [
        {
          id: 'item-1',
          productId: first.id,
          productName: first.name,
          productImage: first.images[0]?.url || '',
          quantity: 1,
          size: first.sizes[1]?.label || 'M',
          color: first.colors[0]?.name || 'Onyx',
          price: first.price,
        },
        {
          id: 'item-2',
          productId: second.id,
          productName: second.name,
          productImage: second.images[0]?.url || '',
          quantity: 1,
          size: second.sizes[1]?.label || 'M',
          color: second.colors[0]?.name || 'Onyx',
          price: second.price,
        },
      ],
      subtotal: first.price + second.price,
      tax: 58,
      shipping: 20,
      total: first.price + second.price + 58 + 20,
      status: 'DELIVERED',
      shippingAddress: shipping,
      createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'INV-10217',
      userId: userId || 'guest',
      guestEmail: 'client@luxe.studio',
      items: [
        {
          id: 'item-3',
          productId: third.id,
          productName: third.name,
          productImage: third.images[0]?.url || '',
          quantity: 1,
          size: third.sizes[2]?.label || 'L',
          color: third.colors[0]?.name || 'Carbon',
          price: third.price,
        },
      ],
      subtotal: third.price,
      tax: 68,
      shipping: 0,
      discountAmount: 40,
      total: third.price + 68 - 40,
      status: 'PROCESSING',
      shippingAddress: shipping,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return orders
}
