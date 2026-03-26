export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

interface RazorpayRequest {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Razorpay keys are not configured' },
      { status: 500 },
    )
  }

  try {
    const body = (await req.json()) as RazorpayRequest
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(body.amount),
      currency: body.currency || 'INR',
      receipt: body.receipt || `order_${Date.now()}`,
      notes: body.notes,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Razorpay order error:', error)
    return NextResponse.json({ error: 'Unable to create Razorpay order' }, { status: 500 })
  }
}
