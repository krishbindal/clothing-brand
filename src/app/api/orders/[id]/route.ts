import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { OrderStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const ALLOWED_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, discountCode: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order lookup failed:', error)
    return NextResponse.json({ error: 'Unable to load order' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const body = (await req.json()) as { status?: string; notes?: string }
    if (body.status && !ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status as OrderStatus } : {}),
        ...(body.notes ? { notes: body.notes } : {}),
      },
      include: { items: true, discountCode: true },
    })

    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error('Order update failed:', error)
    return NextResponse.json({ error: 'Unable to update order' }, { status: 500 })
  }
}
