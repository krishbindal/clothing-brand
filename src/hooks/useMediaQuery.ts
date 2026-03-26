import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {}

      const mediaQuery = window.matchMedia(query)
      const handler = () => onStoreChange()
      mediaQuery.addEventListener('change', handler)

      return () => mediaQuery.removeEventListener('change', handler)
    },
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    () => false
  )
}

// Preset breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
