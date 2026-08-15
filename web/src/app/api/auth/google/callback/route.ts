import { NextRequest, NextResponse } from 'next/server'

import {
  createGoogleSignupSession,
  googleOAuthModeCookie,
  googleOAuthStateCookie,
  googleSignupSessionCookie,
} from '@/lib/googleSignupSession'
import {
  createSession,
  sessionCookie,
  sessionCookieOptions,
  toSessionUser,
} from '@/lib/session'

type GoogleTokenResponse = {
  access_token?: string
  error?: string
  error_description?: string
  expires_in?: number
  id_token?: string
  scope?: string
  token_type?: string
}

type GoogleTokenInfoResponse = {
  aud?: string
  email?: string
  email_verified?: boolean | string
  family_name?: string
  given_name?: string
  name?: string
  sub?: string
}

function getRedirectUri(request: NextRequest) {
  const configuredRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI
  if (configuredRedirectUri) return configuredRedirectUri
  return `${request.nextUrl.origin}/api/auth/google/callback`
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete(googleOAuthStateCookie)
  response.cookies.delete(googleOAuthModeCookie)
}

function redirectToSignup(
  request: NextRequest,
  params: Record<string, string>,
) {
  const url = new URL('/signup', request.nextUrl.origin)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return NextResponse.redirect(url)
}

function redirectToSignIn(
  request: NextRequest,
  params: Record<string, string>,
) {
  const url = new URL('/sign-in', request.nextUrl.origin)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return Response.json(
      { error: 'Google OAuth is not configured' },
      { status: 500 },
    )
  }

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const storedState = request.cookies.get(googleOAuthStateCookie)?.value
  const mode = request.cookies.get(googleOAuthModeCookie)?.value

  if (!code || !state || !storedState || state !== storedState) {
    const response =
      mode === 'signin'
        ? redirectToSignIn(request, { google: 'invalid_state' })
        : redirectToSignup(request, { google: 'invalid_state' })
    clearOAuthCookies(response)
    return response
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: getRedirectUri(request),
    }),
  })
  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse

  if (!tokenResponse.ok || !tokenData.id_token) {
    console.error(
      '[google-oauth] token exchange failed',
      tokenData.error,
      tokenData.error_description,
    )
    const response =
      mode === 'signin'
        ? redirectToSignIn(request, { google: 'token_failed' })
        : redirectToSignup(request, { google: 'token_failed' })
    clearOAuthCookies(response)
    return response
  }

  const tokenInfoResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenData.id_token)}`,
  )
  const tokenInfo = (await tokenInfoResponse.json()) as GoogleTokenInfoResponse

  if (
    !tokenInfoResponse.ok ||
    tokenInfo.aud !== clientId ||
    !tokenInfo.sub ||
    !tokenInfo.email ||
    (tokenInfo.email_verified !== true && tokenInfo.email_verified !== 'true')
  ) {
    console.error('[google-oauth] invalid id token')
    const response =
      mode === 'signin'
        ? redirectToSignIn(request, { google: 'invalid_token' })
        : redirectToSignup(request, { google: 'invalid_token' })
    clearOAuthCookies(response)
    return response
  }

  // Sign-in mode: look up existing user in the CMS by googleSub
  if (mode === 'signin') {
    const cmsUrl = process.env.CMS_URL
    const secret =
      process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET

    if (cmsUrl && secret) {
      const cmsRes = await fetch(`${cmsUrl}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSub: tokenInfo.sub, secret }),
      })

      if (cmsRes.ok) {
        const { user } = (await cmsRes.json()) as {
          user: Parameters<typeof toSessionUser>[0]
        }
        const sessionUser = toSessionUser(user)

        const response = NextResponse.redirect(
          new URL('/', request.nextUrl.origin),
        )
        clearOAuthCookies(response)
        response.cookies.set(sessionCookie, createSession(sessionUser), {
          ...sessionCookieOptions,
        })
        return response
      }

      // No account found — send back to sign-in with an error
      const response = redirectToSignIn(request, { google: 'no_account' })
      clearOAuthCookies(response)
      return response
    }
  }

  // Signup mode (default): store Google profile and continue to signup form
  const response = redirectToSignup(request, { google: 'connected' })
  clearOAuthCookies(response)
  response.cookies.set(
    googleSignupSessionCookie,
    createGoogleSignupSession({
      email: tokenInfo.email,
      firstName: tokenInfo.given_name,
      googleSub: tokenInfo.sub,
      lastName: tokenInfo.family_name,
      name: tokenInfo.name,
    }),
    {
      httpOnly: true,
      maxAge: 30 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  )
  return response
}
