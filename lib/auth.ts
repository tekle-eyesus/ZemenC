import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export function generateToken(payload: any) {
  return sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function removeTokenCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

// Helper to get token from the request (for API routes)
export function getTokenFromRequest(req: Request) {
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) return null
  const cookiesArr = cookieHeader.split(';').map(c => c.trim())
  for (const cookie of cookiesArr) {
    if (cookie.startsWith('token=')) {
      return cookie.substring('token='.length)
    }
  }
  return null
}