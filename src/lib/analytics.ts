'use client'

import { AnalyticsEventType } from '@/types'

const SESSION_STORAGE_KEY = 'luxe:session'

function ensureSessionId() {
  if (typeof window === 'undefined') return ''
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (existing) return existing
  const next = crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}_${Math.random()}`
  window.localStorage.setItem(SESSION_STORAGE_KEY, next)
  return next
}

export async function logEvent(
  type: AnalyticsEventType,
  payload: {
    path: string
    productId?: string
    metadata?: Record<string, unknown>
    userId?: string
  },
) {
  if (typeof window === 'undefined') return

  const sessionId = ensureSessionId()
  const body = JSON.stringify({
    ...payload,
    type,
    sessionId,
  })

  const url = '/api/analytics'
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon(url, blob)
    return
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => null)
}
