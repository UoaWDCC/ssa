import { NextRequest, NextResponse } from 'next/server'

import {
  googleSignupSessionCookie,
  readGoogleSignupSession,
} from '@/lib/googleSignupSession'

export function GET(request: NextRequest) {
  const profile = readGoogleSignupSession(
    request.cookies.get(googleSignupSessionCookie)?.value,
  )

  if (!profile) {
    return Response.json({ error: 'No Google signup session' }, { status: 404 })
  }

  return Response.json({ profile })
}

export function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(googleSignupSessionCookie, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
