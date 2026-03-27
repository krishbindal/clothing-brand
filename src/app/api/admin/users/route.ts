import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ users: [] })
  }

  try {
    const prisma = getPrisma()
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

    return Response.json({ users })
  } catch (error) {
    console.error('Admin users fetch failed:', error)
    return Response.json({ error: 'Unable to load users' }, { status: 500 })
  }
}
