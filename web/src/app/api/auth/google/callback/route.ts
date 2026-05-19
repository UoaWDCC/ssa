import { NextRequest, NextResponse } from 'next/server'

import {
  createGoogleSignupSession,
  googleOAuthStateCookie,
  googleSignupSessionCookie,
} from '@/lib/googleSignupSession'

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

  if (!code || !state || !storedState || state !== storedState) {
    const response = redirectToSignup(request, { google: 'invalid_state' })
    response.cookies.delete(googleOAuthStateCookie)
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
    const response = redirectToSignup(request, { google: 'token_failed' })
    response.cookies.delete(googleOAuthStateCookie)
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
    tokenInfo.email_verified === false ||
    tokenInfo.email_verified === 'false'
  ) {
    console.error('[google-oauth] invalid id token')
    const response = redirectToSignup(request, { google: 'invalid_token' })
    response.cookies.delete(googleOAuthStateCookie)
    return response
  }

  const response = redirectToSignup(request, { google: 'connected' })
  response.cookies.delete(googleOAuthStateCookie)
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
