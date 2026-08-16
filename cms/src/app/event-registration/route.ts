import crypto from 'node:crypto'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const genderOptions = ['woman', 'man', 'non-binary', 'not-say'] as const
const universityYearOptions = [
  '1',
  '2',
  '3',
  '4',
  '5+',
  'postgraduate',
  'not-currently-studying',
] as const

function getSecret() {
  return process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET
}

function secretsMatch(providedSecret?: string) {
  const expectedSecret = getSecret()
  if (!expectedSecret || !providedSecret) return false

  const incoming = Buffer.from(providedSecret)
  const expected = Buffer.from(expectedSecret)

  return incoming.length === expected.length && crypto.timingSafeEqual(incoming, expected)
}

function requiredText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return options.some((option) => option === value)
}

function parseId(value: unknown) {
  const id = typeof value === 'number' ? value : Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function hasCurrentMembership(
  membershipStatus?: 'active' | 'expired' | 'pending' | null,
  membershipExpiryDate?: string | null,
) {
  if (membershipStatus !== 'active') return false
  if (!membershipExpiryDate) return true

  const expiry = Date.parse(membershipExpiryDate)
  return !Number.isNaN(expiry) && expiry >= Date.now()
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    const parsed = await request.json()
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 })
    }
    body = parsed as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!secretsMatch(requiredText(body.secret) ?? undefined)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const eventId = parseId(body.event)
  const firstName = requiredText(body.firstName)
  const lastName = requiredText(body.lastName)
  const email = requiredText(body.email)?.toLowerCase() ?? null
  const phone = requiredText(body.phone)
  const emergencyContactName = requiredText(body.emergencyContactName)
  const emergencyContactPhone = requiredText(body.emergencyContactPhone)
  const emergencyContactRelationship = requiredText(body.emergencyContactRelationship)
  const gender = requiredText(body.gender)
  const dietaryRequirements = requiredText(body.dietaryRequirements)
  const universityYear = requiredText(body.universityYear)

  if (
    !eventId ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !emergencyContactName ||
    !emergencyContactPhone ||
    !emergencyContactRelationship ||
    !gender ||
    !dietaryRequirements ||
    !universityYear
  ) {
    return Response.json({ error: 'All event registration fields are required' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'A valid email address is required' }, { status: 400 })
  }

  if (!isOneOf(gender, genderOptions)) {
    return Response.json({ error: 'Invalid gender' }, { status: 400 })
  }

  if (!isOneOf(universityYear, universityYearOptions)) {
    return Response.json({ error: 'Invalid university year' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  let event
  try {
    event = await payload.findByID({
      collection: 'events',
      id: eventId,
      depth: 0,
      overrideAccess: true,
    })
  } catch {
    return Response.json({ error: 'Event not found' }, { status: 404 })
  }

  if (event.isUpcoming !== true) {
    return Response.json({ error: 'This event is not open for registration' }, { status: 409 })
  }

  const requestedUserId = body.userId === undefined ? null : parseId(body.userId)
  if (body.userId !== undefined && !requestedUserId) {
    return Response.json({ error: 'Invalid user session' }, { status: 401 })
  }

  let user = null
  if (requestedUserId) {
    try {
      user = await payload.findByID({
        collection: 'users',
        id: requestedUserId,
        depth: 0,
        overrideAccess: true,
      })
    } catch {
      return Response.json({ error: 'Invalid user session' }, { status: 401 })
    }
  }

  const isMember =
    user?.role === 'member' &&
    hasCurrentMembership(user.membershipStatus, user.membershipExpiryDate)
  const amount = isMember ? event.memberPrice : event.nonMemberPrice

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    return Response.json({ error: 'The event price is not configured' }, { status: 422 })
  }

  try {
    const registration = await payload.create({
      collection: 'event-registrations',
      overrideAccess: true,
      data: {
        event: eventId,
        ...(user ? { user: user.id } : {}),
        firstName,
        lastName,
        email,
        phone,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        gender,
        dietaryRequirements,
        universityYear,
        priceType: isMember ? 'member' : 'non-member',
        amount,
        currency: 'nzd',
        status: 'pending',
      },
    })

    return Response.json({ registration }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create event registration'
    return Response.json({ error: message }, { status: 400 })
  }
}
