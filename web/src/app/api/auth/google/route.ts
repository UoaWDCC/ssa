import { NextRequest, NextResponse } from 'next/server'

import {
  createOAuthState,
  googleOAuthModeCookie,
  googleOAuthStateCookie,
} from '@/lib/googleSignupSession'

function getRedirectUri(request: NextRequest) {
  const configuredRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI
  if (configuredRedirectUri) return configuredRedirectUri

  return `${request.nextUrl.origin}/api/auth/google/callback`
}

export function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return Response.json(
      { error: 'GOOGLE_CLIENT_ID not configured' },
      { status: 500 },
    )
  }

  const state = createOAuthState()
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', getRedirectUri(request))
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('prompt', 'select_account')

  const mode =
    request.nextUrl.searchParams.get('mode') === 'signin' ? 'signin' : 'signup'
  const cookieOptions = {
    httpOnly: true,
    maxAge: 10 * 60,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }

  const response = NextResponse.redirect(authUrl)
  response.cookies.set(googleOAuthStateCookie, state, cookieOptions)
  response.cookies.set(googleOAuthModeCookie, mode, cookieOptions)

  return response
}
