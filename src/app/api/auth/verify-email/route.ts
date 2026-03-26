export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 })

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })
    if (!verificationToken) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    if (verificationToken.used) return NextResponse.json({ error: 'Token already used' }, { status: 400 })
    if (new Date() > verificationToken.expires) return NextResponse.json({ error: 'Token has expired' }, { status: 400 })

    await prisma.$transaction([
      prisma.user.update({ where: { id: verificationToken.userId }, data: { emailVerified: new Date() } }),
      prisma.verificationToken.update({ where: { token }, data: { used: true } }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verification error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
