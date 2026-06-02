import crypto from 'node:crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

function getSecret() {
  return process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET
}

export async function POST(request: Request) {
  const secret = getSecret()
  if (!secret) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let body: { userId?: string | number; data?: Record<string, unknown>; secret?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const incoming = Buffer.from(body.secret ?? '')
  const expected = Buffer.from(secret)
  if (incoming.length !== expected.length || !crypto.timingSafeEqual(incoming, expected)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!body.userId || !body.data) {
    return Response.json({ error: 'userId and data are required' }, { status: 400 })
  }

  const d = body.data as {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    upi?: string | null
    studentId?: string | null
    areaOfStudy?: string | null
    yearOfUniversity?: '1' | '2' | '3' | '4' | '5+' | 'postgrad' | null
    gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null
    ethnicity?: 'chinese' | 'malay' | 'indian' | 'eurasian' | 'other' | null
    returningMember?: boolean | null
  }

  const payload = await getPayload({ config: configPromise })

  const current = (await payload.findByID({
    collection: 'users',
    id: body.userId,
    overrideAccess: true,
  })) as { firstName?: string | null; lastName?: string | null }

  const mergedFirst = d.firstName === undefined ? (current.firstName ?? '') : (d.firstName ?? '')
  const mergedLast = d.lastName === undefined ? (current.lastName ?? '') : (d.lastName ?? '')
  const derivedName = [mergedFirst, mergedLast].filter(Boolean).join(' ') || null

  const user = await payload.update({
    collection: 'users',
    id: body.userId,
    overrideAccess: true,
    data: {
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      upi: d.upi,
      studentId: d.studentId,
      areaOfStudy: d.areaOfStudy,
      yearOfUniversity: d.yearOfUniversity,
      gender: d.gender,
      ethnicity: d.ethnicity,
      returningMember: d.returningMember,
      ...(derivedName === null ? {} : { name: derivedName }),
    },
  })

  return Response.json({ user })
}
