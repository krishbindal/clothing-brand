'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logEvent } from '@/lib/analytics'
import { useAuth } from '@/contexts/AuthContext'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    if (!pathname) return
    logEvent('PAGE_VIEW', { path: pathname, userId: user?.uid })
  }, [pathname, user?.uid])

  return null
}
