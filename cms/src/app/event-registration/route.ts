import crypto from 'node:crypto'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'

import { completePaidEventRegistration } from '../stripe/_lib/completePaidEventRegistration'

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

function getWebUrl() {
  const candidates = [
    process.env.WEB_URL,
    process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000',
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    try {
      const url = new URL(candidate)
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.origin
      }
    } catch {
      continue
    }
  }

  return null
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

function isSuccessfulPayment(session: Stripe.Checkout.Session) {
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
}

export async function GET(request: Request) {
  if (!secretsMatch(request.headers.get('x-ssa-internal-secret') ?? undefined)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessionId = new URL(request.url).searchParams.get('session_id')
  if (!sessionId) {
    return Response.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve Stripe session'
    return Response.json({ error: message }, { status: 502 })
  }

  if (session.metadata?.checkoutType !== 'event-registration') {
    return Response.json({ error: 'Invalid event checkout session' }, { status: 422 })
  }

  if (!isSuccessfulPayment(session)) {
    return Response.json({
      confirmed: false,
      paymentStatus: session.payment_status,
    })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const registration = await completePaidEventRegistration({ payload, session })
    const event =
      typeof registration.event === 'number'
        ? await payload.findByID({
            collection: 'events',
            id: registration.event,
            depth: 0,
            overrideAccess: true,
          })
        : registration.event

    return Response.json({
      confirmed: true,
      paymentStatus: session.payment_status,
      registration: {
        id: registration.id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        amount: registration.amount,
        currency: registration.currency,
        createdAt: registration.createdAt,
        paidAt: registration.paidAt,
        event: {
          id: event.id,
          title: event.title,
          date: event.date,
        },
      },
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to confirm event registration payment'
    return Response.json({ error: message }, { status: 500 })
  }
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

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webUrl = getWebUrl()
  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }
  if (!webUrl) {
    return Response.json({ error: 'WEB_URL not configured' }, { status: 500 })
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

  const amountInCents = Math.round(amount * 100)
  if (!Number.isSafeInteger(amountInCents) || amountInCents < 0) {
    return Response.json({ error: 'The event price is invalid' }, { status: 422 })
  }

  let registration
  try {
    registration = await payload.create({
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create event registration'
    return Response.json({ error: message }, { status: 400 })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })
  const metadata = {
    checkoutType: 'event-registration',
    registrationId: String(registration.id),
    eventId: String(event.id),
    priceType: registration.priceType,
  }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        client_reference_id: String(registration.id),
        ...(user?.stripeCustomerId
          ? { customer: user.stripeCustomerId }
          : { customer_email: email }),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'nzd',
              unit_amount: amountInCents,
              product_data: {
                name: event.title,
                description: `${isMember ? 'Member' : 'Non-member'} event registration`,
              },
            },
          },
        ],
        metadata,
        payment_intent_data: { metadata },
        success_url: `${webUrl}/events/rsvp/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${webUrl}/events/rsvp?cancelled=true`,
      },
      { idempotencyKey: `event-registration-${registration.id}` },
    )
  } catch (error: unknown) {
    await payload
      .delete({ collection: 'event-registrations', id: registration.id, overrideAccess: true })
      .catch(() => {})
    const message = error instanceof Error ? error.message : 'Failed to create Stripe checkout'
    return Response.json({ error: message }, { status: 502 })
  }

  if (!session.url) {
    await stripe.checkout.sessions.expire(session.id).catch(() => {})
    await payload
      .delete({ collection: 'event-registrations', id: registration.id, overrideAccess: true })
      .catch(() => {})
    return Response.json({ error: 'Stripe did not provide a checkout URL' }, { status: 502 })
  }

  try {
    registration = await payload.update({
      collection: 'event-registrations',
      id: registration.id,
      overrideAccess: true,
      data: { stripeCheckoutSessionId: session.id },
    })
  } catch (error: unknown) {
    await stripe.checkout.sessions.expire(session.id).catch(() => {})
    await payload
      .delete({ collection: 'event-registrations', id: registration.id, overrideAccess: true })
      .catch(() => {})
    const message =
      error instanceof Error ? error.message : 'Failed to save Stripe checkout session'
    return Response.json({ error: message }, { status: 500 })
  }

  return Response.json(
    {
      checkoutUrl: session.url,
      registration,
    },
    { status: 201 },
  )
}
