import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSession, sessionCookie, type SessionUser } from '@/lib/session'

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

  const { user } = (await cmsRes.json()) as { user: Record<string, unknown> }

  const sessionUser: SessionUser = {
    email: user.email as string,
    userId: user.id as string,
    firstName: user.firstName as string | undefined,
    lastName: user.lastName as string | undefined,
    phone: user.phone as string | undefined,
    role: user.role as 'admin' | 'member' | undefined,
    authProvider: user.authProvider as 'email' | 'google' | undefined,
    membershipStatus: user.membershipStatus as
      | 'active'
      | 'expired'
      | 'pending'
      | undefined,
    membershipExpiryDate: user.membershipExpiryDate as string | undefined,
    upi: user.upi as string | undefined,
    studentId: user.studentId as string | undefined,
    areaOfStudy: user.areaOfStudy as string | undefined,
    yearOfUniversity: user.yearOfUniversity as string | undefined,
    gender: user.gender as string | undefined,
    ethnicity: user.ethnicity as string | undefined,
    returningMember: user.returningMember as boolean | undefined,
  }

  const store = await cookies()
  store.set(sessionCookie, createSession(sessionUser), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  })

  return NextResponse.json({ user: sessionUser })
}
