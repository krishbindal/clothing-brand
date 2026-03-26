export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

const FALLBACK_CODES = process.env.NEXT_PUBLIC_DISCOUNT_CODES
  ?.split(',')
  .map((entry) => {
    const [code, value] = entry.split(':')
    return {
      code: code?.trim().toUpperCase(),
      value: Number(value) || 0,
      type: 'PERCENTAGE' as const,
    }
  })
  .filter((item) => item.code && item.value > 0)

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; subtotal?: number }
    const code = body.code?.trim().toUpperCase()
    const subtotal = Number(body.subtotal || 0)

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (!process.env.DATABASE_URL && !FALLBACK_CODES?.length) {
      return NextResponse.json({ error: 'No discounts configured' }, { status: 503 })
    }

    const now = new Date()
    const discount =
      process.env.DATABASE_URL
        ? await getPrisma().discountCode.findUnique({ where: { code } })
        : null

    const fallback = (!discount && FALLBACK_CODES
      ? FALLBACK_CODES.find((entry) => entry.code === code)
      : null) || null

    const activeDiscount = discount || fallback
    if (!activeDiscount) {
      return NextResponse.json({ valid: false, reason: 'NOT_FOUND' }, { status: 404 })
    }

    const active =
      'active' in activeDiscount
        ? activeDiscount.active &&
          (!activeDiscount.startsAt || activeDiscount.startsAt <= now) &&
          (!activeDiscount.expiresAt || activeDiscount.expiresAt >= now) &&
          (!activeDiscount.usageLimit || activeDiscount.usedCount < activeDiscount.usageLimit)
        : true

    if (!active) {
      return NextResponse.json({ valid: false, reason: 'INACTIVE' }, { status: 400 })
    }

    const meetsMinimum =
      !('minimumSubtotal' in activeDiscount) ||
      !activeDiscount.minimumSubtotal ||
      subtotal >= Number(activeDiscount.minimumSubtotal)

    if (!meetsMinimum) {
      return NextResponse.json({ valid: false, reason: 'MINIMUM_NOT_MET' }, { status: 400 })
    }

    const type = 'type' in activeDiscount ? activeDiscount.type : 'PERCENTAGE'
    const value = Number(
      'value' in activeDiscount ? activeDiscount.value : (activeDiscount as { value: number }).value,
    )
    const amount =
      type === 'PERCENTAGE' ? Math.min(subtotal * (value / 100), subtotal) : Math.min(value, subtotal)

    return NextResponse.json({
      valid: true,
      code,
      type,
      value,
      amount,
      expiresAt:
        'expiresAt' in activeDiscount ? activeDiscount.expiresAt : undefined,
      minimumSubtotal:
        'minimumSubtotal' in activeDiscount ? activeDiscount.minimumSubtotal : undefined,
    })
  } catch (error) {
    console.error('Discount validation failed:', error)
    return NextResponse.json({ error: 'Unable to validate discount' }, { status: 500 })
  }
}
