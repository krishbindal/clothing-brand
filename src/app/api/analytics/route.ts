import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type EventType = 'PAGE_VIEW' | 'PRODUCT_CLICK' | 'ADD_TO_CART'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type?: EventType
      path?: string
      productId?: string
      metadata?: Record<string, unknown>
      sessionId?: string
      userId?: string
    }

    if (!body.type || !body.path || !body.sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ stored: false }, { status: 201 })
    }

    await prisma.analyticsEvent.create({
      data: {
        type: body.type,
        path: body.path,
        sessionId: body.sessionId,
        productId: body.productId,
        userId: body.userId,
        metadata: body.metadata as Prisma.InputJsonValue,
      },
    })

    return NextResponse.json({ stored: true }, { status: 201 })
  } catch (error) {
    console.error('Analytics capture failed:', error)
    return NextResponse.json({ error: 'Unable to record analytics event' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      stats: { pageViews: 0, productClicks: 0, addToCart: 0 },
    })
  }

  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const [pageViews, productClicks, addToCart] = await Promise.all([
      prisma.analyticsEvent.count({ where: { type: 'PAGE_VIEW', createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { type: 'PRODUCT_CLICK', createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { type: 'ADD_TO_CART', createdAt: { gte: since } } }),
    ])

    return NextResponse.json({
      stats: { pageViews, productClicks, addToCart },
    })
  } catch (error) {
    console.error('Analytics summary failed:', error)
    return NextResponse.json({ error: 'Unable to load analytics' }, { status: 500 })
  }
}
