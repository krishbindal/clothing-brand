'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Category } from '@/types'

interface UseCategoriesOptions {
  slug?: string
  enabled?: boolean
}

interface UseCategoriesResult {
  categories: Category[]
  category: Category | null
  isLoading: boolean
  error: string
  refetch: () => Promise<void>
}

export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesResult {
  const { slug, enabled = true } = options
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string>('')
  const controllerRef = useRef<AbortController | null>(null)

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (slug) params.set('slug', slug)
    const queryString = params.toString()
    return `/api/categories${queryString ? `?${queryString}` : ''}`
  }, [slug])

  const fetchCategories = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false)
      setError('')
      setCategories([])
      setCategory(null)
      return
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(buildUrl(), { signal: controller.signal })
      if (!response.ok) throw new Error('Failed to fetch categories')
      const payload = await response.json()

      if (slug) {
        setCategory((payload as { category: Category | null }).category || null)
        setCategories([])
      } else {
        setCategories((payload as { categories?: Category[] }).categories || [])
        setCategory(null)
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        setCategories([])
        setCategory(null)
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [buildUrl, enabled, slug])

  useEffect(() => {
    void fetchCategories()
    return () => controllerRef.current?.abort()
  }, [fetchCategories])

  return { categories, category, isLoading, error, refetch: fetchCategories }
}
