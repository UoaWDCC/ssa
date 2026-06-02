import crypto from 'crypto'

export type GoogleSignupProfile = {
  email: string
  firstName?: string
  googleSub: string
  lastName?: string
  name?: string
}

export const googleSignupSessionCookie = 'ssa_google_signup'
export const googleOAuthStateCookie = 'ssa_google_oauth_state'
export const googleOAuthModeCookie = 'ssa_google_oauth_mode'

const sessionVersion = 'v1'

function getCookieSecret() {
  const secret =
    process.env.AUTH_SECRET || process.env.GOOGLE_OAUTH_COOKIE_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET must be configured')
  }

  return secret
}

function sign(value: string) {
  return crypto
    .createHmac('sha256', getCookieSecret())
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

export function createGoogleSignupSession(profile: GoogleSignupProfile) {
  const exp = Date.now() + 30 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ ...profile, exp })).toString(
    'base64url',
  )
  const signedPayload = `${sessionVersion}.${payload}`

  return `${signedPayload}.${sign(signedPayload)}`
}

export function readGoogleSignupSession(value?: null | string) {
  if (!value) return null

  const [version, payload, signature] = value.split('.')
  if (version !== sessionVersion || !payload || !signature) return null

  const signedPayload = `${version}.${payload}`
  if (!timingSafeEqual(signature, sign(signedPayload))) return null

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as Partial<GoogleSignupProfile> & { exp?: number }

    if (!parsed.email || !parsed.googleSub) return null
    if (typeof parsed.exp !== 'number' || parsed.exp < Date.now()) return null

    return {
      email: parsed.email,
      firstName: parsed.firstName,
      googleSub: parsed.googleSub,
      lastName: parsed.lastName,
      name: parsed.name,
    } satisfies GoogleSignupProfile
  } catch {
    return null
  }
}

export function createOAuthState() {
  return crypto.randomBytes(24).toString('base64url')
}
