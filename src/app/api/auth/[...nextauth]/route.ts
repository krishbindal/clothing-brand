import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { getAuthOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handleAuthRequest = async (req: NextRequest) => {
  try {
    return await NextAuth(getAuthOptions())(req)
  } catch (error) {
    console.error('NextAuth handler error', error)
    return new Response('Authentication handler error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return handleAuthRequest(req)
}

export async function POST(req: NextRequest) {
  return handleAuthRequest(req)
}
