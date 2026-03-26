import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const getPrisma = (): PrismaClient => {
  // If we're in a browser, we don't want to initialize Prisma
  if (typeof window !== 'undefined') {
    throw new Error('Prisma cannot be initialized on the client side')
  }

  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  return prisma
}

// Keep a placeholder export for type safety but it's now just a function call at runtime
export const prisma = {} as PrismaClient // We'll replace usages of this with getPrisma()
