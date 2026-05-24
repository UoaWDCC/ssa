import crypto from 'crypto'
import { cookies } from 'next/headers'

export type SessionUser = {
  email: string
  firstName?: string
  lastName?: string
  userId?: string
}

export const sessionCookie = 'ssa_session'

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
  const payload = Buffer.from(JSON.stringify(user)).toString('base64url')
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
    ) as Partial<SessionUser>
    if (!parsed.email) return null
    return {
      email: parsed.email,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      userId: parsed.userId,
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  return parseSession(store.get(sessionCookie)?.value)
}
