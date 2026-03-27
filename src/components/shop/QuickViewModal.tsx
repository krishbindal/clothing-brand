'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Package, ShoppingBag, Sparkles, X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import ImageZoom from '@/components/ui/ImageZoom'
import { useCart } from '@/contexts/CartContext'
import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils'
import { Product } from '@/types'

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const { addItem } = useCart()
  const defaultSize = useMemo(
    () => product?.sizes?.find((s) => s.available)?.label || '',
    [product?.sizes]
  )
  const defaultColor = useMemo(
    () => product?.colors?.find((c) => c.available)?.name || product?.colors?.[0]?.name || '',
    [product?.colors]
  )
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(defaultSize)
  const [selectedColor, setSelectedColor] = useState(defaultColor)
  const [added, setAdded] = useState(false)

  const activeImages = product?.images?.length ? product.images : []

  if (!product) return null

  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0
  const stockLeft =
    product.stockCount ??
    product.sizes?.find((size) => typeof size.stockCount === 'number')?.stockCount
  const lowStock = stockLeft && stockLeft <= 3 && product.inStock
  const isBestseller = product.tags?.includes('bestseller')
  const isNewDrop = product.tags?.includes('new-drop') || product.tags?.includes('new')

  const handleAdd = () => {
    if (!selectedSize || !product.inStock) return
    addItem(product, 1, selectedSize, selectedColor || defaultColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title="Quick view"
      description="Preview fit, fabric, and availability without leaving the grid."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-brand-card">
            <ImageZoom zoomLevel={2.2} className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-full"
                >
                  {activeImages[selectedImage]?.url ? (
                    <Image
                      src={activeImages[selectedImage].url}
                      alt={activeImages[selectedImage].alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-card via-brand-muted to-brand-darker">
                      <span className="text-4xl font-display gold-text tracking-[0.35em] opacity-20">
                        LUXE
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </ImageZoom>

            <div className="absolute top-4 left-4 flex gap-2">
              {isBestseller && (
                <span className="bg-brand-gold text-brand-black text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-widest">
                  Bestseller
                </span>
              )}
              {isNewDrop && (
                <span className="bg-brand-white/90 text-brand-black text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-widest">
                  New Drop
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-widest">
                  -{discount}%
                </span>
              )}
            </div>
            {lowStock && (
              <div className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.2em] bg-amber-500/90 text-brand-black px-3 py-1.5 rounded-sm font-semibold shadow-gold-subtle">
                {stockLeft ? `Only ${stockLeft} left` : 'Low stock'}
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm flex items-center justify-center text-xs uppercase tracking-[0.35em]">
                <span className="px-4 py-2 bg-brand-card border border-brand-border rounded-sm">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {activeImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activeImages.map((img, idx) => (
                <button
                  key={img.url + idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    'relative w-20 aspect-[4/5] rounded-lg overflow-hidden border transition-all duration-200 ease-luxury',
                    selectedImage === idx
                      ? 'border-brand-gold shadow-[0_0_0_1px_rgba(201,168,76,0.4)]'
                      : 'border-brand-border hover:border-brand-gold/50'
                  )}
                >
                  {img.url ? (
                    <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-brand-card flex items-center justify-center">
                      <span className="text-[9px] font-display gold-text opacity-30">LUXE</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gray-500">
                {product.category}
              </p>
              <h3 className="text-2xl font-display font-semibold text-brand-white mt-2">
                {product.name}
              </h3>
              <p className="text-sm text-brand-gray-400 mt-2 line-clamp-3">
                {product.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-brand-gray-500 hover:text-brand-white transition-colors"
              aria-label="Close quick view"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-brand-white">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-brand-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gray-500">
              <Sparkles size={14} className="text-brand-gold" />
              Tailored to you — choose variants
            </div>

            {product.colors?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-brand-gray-400 uppercase tracking-wide">
                  Color: <span className="text-brand-white">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      disabled={!color.available}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all duration-200',
                        selectedColor === color.name
                          ? 'border-brand-gold scale-110 shadow-[0_0_12px_rgba(201,168,76,0.35)]'
                          : 'border-brand-border/50 hover:border-brand-gold/60',
                        !color.available && 'opacity-30 cursor-not-allowed'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-brand-gray-400 uppercase tracking-wide">
                  Size: <span className="text-brand-white">{selectedSize || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      disabled={!size.available}
                      onClick={() => setSelectedSize(size.label)}
                      className={cn(
                        'min-w-[3rem] px-3 py-2 text-sm font-medium border rounded-md transition-all duration-200',
                        selectedSize === size.label
                          ? 'bg-brand-gold text-brand-black border-brand-gold shadow-gold'
                          : 'border-brand-border text-brand-gray-200 hover:text-brand-white hover:border-brand-gold/50',
                        !size.available && 'opacity-30 cursor-not-allowed'
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {product.stockCount !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-brand-gray-500">
                <span>Status</span>
                <span className={lowStock ? 'text-amber-300' : 'text-brand-gray-400'}>
                  {lowStock ? 'Low stock' : product.inStock ? 'In stock' : 'Unavailable'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-brand-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((product.stockCount / 12) * 100, 100)}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <motion.button
              onClick={handleAdd}
              disabled={!selectedSize || !product.inStock}
              whileTap={{ scale: selectedSize && product.inStock ? 0.98 : 1 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-md font-semibold text-sm uppercase tracking-[0.2em] transition-all duration-300',
                !selectedSize || !product.inStock
                  ? 'bg-brand-muted text-brand-gray-600 cursor-not-allowed'
                  : added
                  ? 'bg-green-600 text-white shadow-[0_0_18px_rgba(34,197,94,0.35)]'
                  : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light hover:shadow-gold'
              )}
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to cart
                </>
              )}
            </motion.button>

            <div className="flex items-center gap-2 text-xs text-brand-gray-500">
              <Package size={14} className="text-brand-gold" />
              Express dispatch in 24h • Free returns
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
