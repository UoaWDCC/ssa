import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createSession,
  sessionCookie,
  sessionCookieOptions,
  toSessionUser,
} from '@/lib/session'

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email: string
    password: string
  }

  const cmsUrl = process.env.CMS_URL
  if (!cmsUrl) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    )
  }

  const cmsRes = await fetch(`${cmsUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!cmsRes.ok) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    )
  }

  const { user } = (await cmsRes.json()) as {
    user: Parameters<typeof toSessionUser>[0]
  }
  const sessionUser = toSessionUser(user)

  const store = await cookies()
  store.set(sessionCookie, createSession(sessionUser), {
    ...sessionCookieOptions,
  })

  return NextResponse.json({ user: sessionUser })
}
