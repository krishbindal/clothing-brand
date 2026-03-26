import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ users: [] })
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      take: 100,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users fetch failed:', error)
    return NextResponse.json({ error: 'Unable to load users' }, { status: 500 })
  }
}
