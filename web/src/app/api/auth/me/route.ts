import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createSession,
  getSession,
  sessionCookie,
  type SessionUser,
} from '@/lib/session'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user })
}

export async function PATCH(request: Request) {
  const user = await getSession()
  if (!user?.userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cmsUrl = process.env.CMS_URL
  const secret =
    process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET
  if (!cmsUrl || !secret)
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const data = (await request.json()) as Record<string, unknown>

  const cmsRes = await fetch(`${cmsUrl}/user-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.userId, data, secret }),
  })

  if (!cmsRes.ok)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    )

  const { user: updated } = (await cmsRes.json()) as {
    user: Record<string, unknown>
  }

  const sessionUser: SessionUser = { ...user }
  const editableKeys = [
    'firstName',
    'lastName',
    'phone',
    'upi',
    'studentId',
    'areaOfStudy',
    'yearOfUniversity',
    'gender',
    'ethnicity',
    'returningMember',
  ] as const
  for (const key of editableKeys) {
    if (key in updated) {
      ;(sessionUser as Record<string, unknown>)[key] =
        updated[key] === null ? undefined : updated[key]
    }
  }

  const store = await cookies()
  store.set(sessionCookie, createSession(sessionUser), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })

  return NextResponse.json({ user: sessionUser })
}

export async function DELETE() {
  const user = await getSession()
  if (!user?.userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cmsUrl = process.env.CMS_URL
  const secret =
    process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET
  if (!cmsUrl || !secret)
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const cmsRes = await fetch(`${cmsUrl}/user-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.userId, secret }),
  })

  if (!cmsRes.ok)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 },
    )

  const store = await cookies()
  store.delete(sessionCookie)

  return NextResponse.json({ ok: true })
}
