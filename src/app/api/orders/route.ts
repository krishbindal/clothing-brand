export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma, OrderStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Address, CartItem } from '@/types'
import { sendOrderConfirmationEmail } from '@/lib/email'

interface OrderPayload {
  userId?: string
  email: string
  shippingAddress: Address
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  discountCode?: string
  discountAmount?: number
  payment?: {
    orderId?: string
    paymentId?: string
    signature?: string
  }
}

const MAX_LIMIT = 100

function calculateSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
}

function normalizeDiscountCode(code?: string | null) {
  return code?.trim().toUpperCase() || undefined
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderPayload
    if (!body.items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const subtotal = calculateSubtotal(body.items)
    const discountCodeRaw = normalizeDiscountCode(body.discountCode)

    const baseOrder = {
      userId: body.userId || null,
      guestEmail: body.email,
      subtotal,
      tax: Number(body.tax),
      shipping: Number(body.shipping),
      discountAmount: Number(body.discountAmount || 0),
      total: Number(body.total),
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
      const total =
        Number(baseOrder.subtotal) -
        Number(baseOrder.discountAmount) +
        Number(baseOrder.shipping) +
        Number(baseOrder.tax)
      const fallbackOrder = {
        ...baseOrder,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        total,
        items,
        stored: false,
      }
      return NextResponse.json({ stored: false, order: fallbackOrder }, { status: 201 })
    }

    const discountCode = discountCodeRaw
      ? await prisma.discountCode.findUnique({
          where: { code: discountCodeRaw },
        })
      : null

    let discountAmount = 0
    if (discountCode) {
      const now = new Date()
      const startsOk = !discountCode.startsAt || discountCode.startsAt <= now
      const notExpired = !discountCode.expiresAt || discountCode.expiresAt >= now
      const underLimit =
        discountCode.usageLimit === null ||
        discountCode.usageLimit === undefined ||
        discountCode.usedCount < discountCode.usageLimit
      const meetsMinimum =
        !discountCode.minimumSubtotal ||
        Number(discountCode.minimumSubtotal) <= Number(baseOrder.subtotal)

      if (discountCode.active && startsOk && notExpired && underLimit && meetsMinimum) {
        if (discountCode.type === 'PERCENTAGE') {
          discountAmount = Number(baseOrder.subtotal) * (Number(discountCode.value) / 100)
        } else {
          discountAmount = Number(discountCode.value)
        }
        discountAmount = Math.min(discountAmount, Number(baseOrder.subtotal))
      }
    }

    const orderTotal =
      Number(baseOrder.subtotal) -
      discountAmount +
      Number(baseOrder.shipping) +
      Number(baseOrder.tax)

    const savedOrder = await prisma.order.create({
      data: {
        ...baseOrder,
        discountAmount,
        total: orderTotal,
        status: 'PENDING',
        discountCodeId: discountCode?.id,
        items: {
          create: items,
        },
      },
      include: { items: true, discountCode: true },
    })

    if (discountCode) {
      await prisma.discountCode.update({
        where: { id: discountCode.id },
        data: { usedCount: { increment: 1 } },
      })
    }

    if (body.email) {
      sendOrderConfirmationEmail(body.email, {
        orderId: savedOrder.id,
        items: items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
          size: item.size,
          color: item.color,
        })),
        total: orderTotal,
        shippingAddress: {
          firstName: body.shippingAddress.firstName,
          lastName: body.shippingAddress.lastName,
          line1: body.shippingAddress.line1,
          city: body.shippingAddress.city,
          state: body.shippingAddress.state,
          postalCode: body.shippingAddress.postalCode,
        },
      }).catch((err) => console.error('Order confirmation email failed:', err))
    }

    return NextResponse.json({ stored: true, order: savedOrder }, { status: 201 })
  } catch (error) {
    console.error('Order storage error:', error)
    return NextResponse.json({ error: 'Unable to store order' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ orders: [] })
    }

    const searchParams = req.nextUrl.searchParams
    const scope = searchParams.get('scope')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const email = searchParams.get('email')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, MAX_LIMIT) : 50

    const where: Prisma.OrderWhereInput =
      scope === 'admin'
        ? status
          ? { status: status as OrderStatus }
          : {}
        : userId
        ? { userId }
        : email
        ? { guestEmail: email }
        : {}

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, discountCode: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Unable to fetch orders' }, { status: 500 })
  }
}
