'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Product } from '@/types'

interface UseProductsOptions {
  slug?: string
  category?: string
  featured?: boolean
  limit?: number
  page?: number
  enabled?: boolean
}

interface UseProductsResult {
  products: Product[]
  product: Product | null
  featuredProducts: Product[]
  isLoading: boolean
  error: string
  refetch: () => Promise<void>
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { slug, category, featured, limit, page, enabled = true } = options

  const [products, setProducts] = useState<Product[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string>('')
  const controllerRef = useRef<AbortController | null>(null)

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (slug) params.set('slug', slug)
    if (category) params.set('category', category)
    if (featured) params.set('featured', 'true')
    if (limit) params.set('limit', String(limit))
    if (page) params.set('page', String(page))
    const queryString = params.toString()
    return `/api/products${queryString ? `?${queryString}` : ''}`
  }, [slug, category, featured, limit, page])

  const fetchProducts = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false)
      setError('')
      setProducts([])
      setProduct(null)
      setFeaturedProducts([])
      return
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(buildUrl(), { signal: controller.signal })
      if (!response.ok) throw new Error('Failed to fetch products')
      const payload = await response.json()

      if (slug) {
        setProduct((payload as { product: Product | null }).product || null)
        setFeaturedProducts((payload as { featuredProducts?: Product[] }).featuredProducts || [])
        setProducts([])
      } else {
        setProducts((payload as { products?: Product[] }).products || [])
        setProduct(null)
        setFeaturedProducts([])
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setProducts([])
        setProduct(null)
        setFeaturedProducts([])
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [enabled, buildUrl, slug])

  useEffect(() => {
    void fetchProducts()
    return () => controllerRef.current?.abort()
  }, [fetchProducts])

  return { products, product, featuredProducts, isLoading, error, refetch: fetchProducts }
}
