import crypto from 'node:crypto'
import { cookies } from 'next/headers'

export type SessionUser = {
  email: string
  userId?: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: 'admin' | 'member'
  authProvider?: 'email' | 'google'
  membershipStatus?: 'active' | 'expired' | 'pending'
  membershipExpiryDate?: string
  upi?: string
  studentId?: string
  areaOfStudy?: string
  yearOfUniversity?: string
  gender?: string
  ethnicity?: string
  returningMember?: boolean
}

export type CmsSessionUser = {
  id: string | number
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  role?: 'admin' | 'member' | null
  authProvider?: 'email' | 'google' | null
  membershipStatus?: 'active' | 'expired' | 'pending' | null
  membershipExpiryDate?: string | null
  upi?: string | null
  studentId?: string | null
  areaOfStudy?: string | null
  yearOfUniversity?: string | null
  gender?: string | null
  ethnicity?: string | null
  returningMember?: boolean | null
}

export const sessionCookie = 'ssa_session'
export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === 'production',
}

const sessionVersion = 'v1'

function getSecret() {
  const secret =
    process.env.AUTH_SECRET || process.env.GOOGLE_OAUTH_COOKIE_SECRET
  if (!secret) throw new Error('AUTH_SECRET must be configured')
  return secret
}

function sign(value: string) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('base64url')
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  return (
    aBuffer.length === bBuffer.length &&
    crypto.timingSafeEqual(aBuffer, bBuffer)
  )
}

export function createSession(user: SessionUser) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ ...user, exp })).toString(
    'base64url',
  )
  const signed = `${sessionVersion}.${payload}`
  return `${signed}.${sign(signed)}`
}

export function parseSession(value?: null | string): SessionUser | null {
  if (!value) return null

  const [version, payload, signature] = value.split('.')
  if (version !== sessionVersion || !payload || !signature) return null

  const signed = `${version}.${payload}`
  if (!timingSafeEqual(signature, sign(signed))) return null

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as Partial<SessionUser> & { exp?: number }
    if (!parsed.email) return null
    if (typeof parsed.exp !== 'number' || parsed.exp < Date.now()) return null
    return {
      email: parsed.email,
      userId: parsed.userId,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      phone: parsed.phone,
      role: parsed.role,
      authProvider: parsed.authProvider,
      membershipStatus: parsed.membershipStatus,
      membershipExpiryDate: parsed.membershipExpiryDate,
      upi: parsed.upi,
      studentId: parsed.studentId,
      areaOfStudy: parsed.areaOfStudy,
      yearOfUniversity: parsed.yearOfUniversity,
      gender: parsed.gender,
      ethnicity: parsed.ethnicity,
      returningMember: parsed.returningMember,
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  return parseSession(store.get(sessionCookie)?.value)
}

export function toSessionUser(user: CmsSessionUser): SessionUser {
  return {
    email: user.email,
    userId: String(user.id),
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    phone: user.phone ?? undefined,
    role: user.role ?? undefined,
    authProvider: user.authProvider ?? undefined,
    membershipStatus: user.membershipStatus ?? undefined,
    membershipExpiryDate: user.membershipExpiryDate ?? undefined,
    upi: user.upi ?? undefined,
    studentId: user.studentId ?? undefined,
    areaOfStudy: user.areaOfStudy ?? undefined,
    yearOfUniversity: user.yearOfUniversity ?? undefined,
    gender: user.gender ?? undefined,
    ethnicity: user.ethnicity ?? undefined,
    returningMember: user.returningMember ?? undefined,
  }
}
