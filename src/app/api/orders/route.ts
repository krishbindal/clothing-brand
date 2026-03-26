import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Address, CartItem } from '@/types'

interface OrderPayload {
  userId?: string
  email: string
  shippingAddress: Address
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  payment?: {
    orderId?: string
    paymentId?: string
    signature?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderPayload
    if (!body.items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const baseOrder = {
      userId: body.userId || null,
      guestEmail: body.email,
      subtotal: body.subtotal,
      tax: body.tax,
      shipping: body.shipping,
      total: body.total,
      shippingAddress: body.shippingAddress as unknown as Prisma.InputJsonValue,
      paymentIntentId: body.payment?.paymentId,
      stripeSessionId: body.payment?.orderId,
      notes: body.payment?.signature,
    }

    const items = body.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images?.[0]?.url || '',
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.price,
    }))

    if (!process.env.DATABASE_URL) {
      const fallbackOrder = {
        ...baseOrder,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items,
        stored: false,
      }
      return NextResponse.json({ stored: false, order: fallbackOrder }, { status: 201 })
    }

    const savedOrder = await prisma.order.create({
      data: {
        ...baseOrder,
        status: 'PENDING',
        items: {
          create: items,
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ stored: true, order: savedOrder }, { status: 201 })
  } catch (error) {
    console.error('Order storage error:', error)
    return NextResponse.json({ error: 'Unable to store order' }, { status: 500 })
  }
}
