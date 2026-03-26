import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendNewsletterSubscriptionEmail } from '@/lib/email'

const newsletterSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown
    const parsed = newsletterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()
    await sendNewsletterSubscriptionEmail(email)

    return NextResponse.json({ message: 'Subscribed successfully.' }, { status: 200 })
  } catch (err) {
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json({ error: 'Unable to subscribe right now. Please try again.' }, { status: 500 })
  }
}
