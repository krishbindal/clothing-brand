import { NextRequest } from 'next/server'
import NextAuth, { type NextAuthResult } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

let authHandler: NextAuthResult | null = null

const getAuthHandler = () => {
  if (!authHandler) {
    authHandler = NextAuth(getAuthOptions())
  }
  return authHandler
}

const handleAuthRequest = async (req: NextRequest, method: 'GET' | 'POST') => {
  try {
    const handler = getAuthHandler().handlers[method]
    return await handler(req)
  } catch (error) {
    console.error('NextAuth handler error', error)
    return new Response('Authentication handler error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return handleAuthRequest(req, 'GET')
}

export async function POST(req: NextRequest) {
  return handleAuthRequest(req, 'POST')
}
