import configPromise from '@payload-config'
import { getPayload } from 'payload'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: { email?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = normalizeEmail(body.email ?? '')

  if (!isValidEmail(email)) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  const [existingUser, existingRegisteredMember] = await Promise.all([
    payload.find({
      collection: 'users',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { email: { equals: email } },
    }),
    payload.find({
      collection: 'members',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [{ email: { equals: email } }, { status: { not_equals: 'pending' } }],
      },
    }),
  ])

  if (existingUser.docs.length > 0 || existingRegisteredMember.docs.length > 0) {
    return Response.json(
      { available: false, error: 'An account with this email already exists' },
      { status: 409 },
    )
  }

  return Response.json({ available: true })
}
