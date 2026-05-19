import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import crypto from 'crypto'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import { encryptSignupPassword } from '../_lib/signupPassword'

function getWebUrl(request: NextRequest) {
  const forwardedWebUrl = request.headers.get('x-web-url')
  const configuredWebUrl = process.env.WEB_URL
  const fallbackWebUrl = 'http://localhost:3000'

  for (const value of [forwardedWebUrl, configuredWebUrl, fallbackWebUrl]) {
    if (!value) continue

    try {
      const url = new URL(value)
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.origin
      }
    } catch {
      continue
    }
  }

  return fallbackWebUrl
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export const POST = async (request: NextRequest) => {
  let body: {
    firstName?: string
    lastName?: string
    name?: string
    authProvider?: 'email' | 'google'
    email?: string
    googleSub?: string
    password?: string
    phone?: string
    upi?: string
    studentId?: string
    areaOfStudy?: string
    yearOfUniversity?: '1' | '2' | '3' | '4' | '5+' | 'postgrad'
    gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
    ethnicity?: 'chinese' | 'malay' | 'indian' | 'eurasian' | 'other'
    returningMember?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    firstName,
    lastName,
    name,
    authProvider: requestedAuthProvider,
    email,
    googleSub,
    password,
    phone,
    upi,
    studentId,
    areaOfStudy,
    yearOfUniversity,
    gender,
    ethnicity,
    returningMember,
  } = body
  const authProvider = requestedAuthProvider === 'google' ? 'google' : 'email'
  const normalizedEmail = email ? normalizeEmail(email) : ''

  if (
    !name ||
    !normalizedEmail ||
    (authProvider === 'email' && !password) ||
    (authProvider === 'google' && !googleSub) ||
    !phone ||
    !upi ||
    !studentId ||
    !areaOfStudy ||
    !yearOfUniversity ||
    !gender ||
    !ethnicity ||
    returningMember === undefined
  ) {
    return Response.json(
      {
        error:
          'Missing required fields: name, email, phone, upi, studentId, areaOfStudy, yearOfUniversity, gender, ethnicity, returningMember',
      },
      { status: 400 },
    )
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID
  const webUrl = getWebUrl(request)

  if (!stripeSecretKey || !priceId) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })
  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })
  const memberPassword =
    authProvider === 'google' ? crypto.randomBytes(32).toString('base64url') : (password ?? '')
  const encryptedSignupPassword = encryptSignupPassword(memberPassword)
  const trimmedFirstName = firstName?.trim()
  const trimmedLastName = lastName?.trim()

  // Reuse an existing pending member so a transient Stripe failure doesn't
  // permanently block the email from retrying.
  let memberId: number
  let memberCreatedHere = false
  let existingStripeCustomerId: string | null | undefined

  const [existingUser, existingRegisteredMember] = await Promise.all([
    payload.find({
      collection: 'users',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { email: { equals: normalizedEmail } },
    }),
    payload.find({
      collection: 'members',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [{ email: { equals: normalizedEmail } }, { status: { not_equals: 'pending' } }],
      },
    }),
  ])

  if (existingUser.docs.length > 0 || existingRegisteredMember.docs.length > 0) {
    return Response.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const existing = await payload.find({
    collection: 'members',
    overrideAccess: true,
    where: {
      and: [{ email: { equals: normalizedEmail } }, { status: { equals: 'pending' } }],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const existingDoc = existing.docs[0]
    memberId = existingDoc.id
    existingStripeCustomerId = existingDoc.stripeCustomerId
    // Update the existing pending member with the latest submitted details,
    // including password so a retry after correcting credentials works correctly.
    await payload.update({
      collection: 'members',
      id: memberId,
      overrideAccess: true,
      data: {
        name,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        authProvider,
        phone,
        googleSub: authProvider === 'google' ? googleSub : null,
        password: memberPassword,
        encryptedSignupPassword,
        upi,
        studentId,
        areaOfStudy,
        yearOfUniversity,
        gender,
        ethnicity,
        returningMember,
      },
    })
  } else {
    try {
      const member = await payload.create({
        collection: 'members',
        // This is a trusted server-side route that creates only a pending
        // member record for the Stripe checkout flow, so bypass collection
        // create access here explicitly.
        overrideAccess: true,
        data: {
          name,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          authProvider,
          email: normalizedEmail,
          googleSub: authProvider === 'google' ? googleSub : undefined,
          password: memberPassword,
          encryptedSignupPassword,
          phone,
          upi,
          studentId,
          areaOfStudy,
          yearOfUniversity,
          gender,
          ethnicity,
          returningMember,
          status: 'pending',
        },
      })
      memberId = member.id
      memberCreatedHere = true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create member'
      if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
        return Response.json(
          { error: 'An account with this email already exists' },
          { status: 409 },
        )
      }
      return Response.json({ error: message }, { status: 400 })
    }
  }

  // Reuse the existing Stripe customer if this pending member already has one.
  // This prevents orphaned customers from accumulating on retries.
  let customerId: string
  let customerCreatedHere = false
  if (existingStripeCustomerId) {
    customerId = existingStripeCustomerId
  } else {
    try {
      const customer = await stripe.customers.create({ email: normalizedEmail, name })
      customerId = customer.id
      customerCreatedHere = true
      // Persist the customer ID so future retries can reuse it.
      await payload
        .update({
          collection: 'members',
          id: memberId,
          overrideAccess: true,
          data: { stripeCustomerId: customerId },
        })
        .catch(() => {})
    } catch (err: unknown) {
      if (memberCreatedHere) {
        await payload
          .delete({ collection: 'members', id: memberId, overrideAccess: true })
          .catch(() => {})
      }
      const message = err instanceof Error ? err.message : 'Failed to create Stripe customer'
      return Response.json({ error: message }, { status: 502 })
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${webUrl}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webUrl}/signup?cancelled=true`,
      metadata: { memberId: String(memberId) },
    })

    if (!session.url) {
      if (customerCreatedHere) {
        await stripe.customers.del(customerId).catch(() => {})
        if (!memberCreatedHere) {
          await payload
            .update({
              collection: 'members',
              id: memberId,
              overrideAccess: true,
              data: { stripeCustomerId: null },
            })
            .catch(() => {})
        }
      }
      if (memberCreatedHere) {
        await payload
          .delete({ collection: 'members', id: memberId, overrideAccess: true })
          .catch(() => {})
      }
      return Response.json(
        { error: 'Stripe did not provide a checkout URL for the created session' },
        { status: 502 },
      )
    }

    return Response.json({ checkoutUrl: session.url })
  } catch (err: unknown) {
    if (customerCreatedHere) {
      await stripe.customers.del(customerId).catch(() => {})
      if (!memberCreatedHere) {
        await payload
          .update({
            collection: 'members',
            id: memberId,
            overrideAccess: true,
            data: { stripeCustomerId: null },
          })
          .catch(() => {})
      }
    }
    if (memberCreatedHere) {
      await payload
        .delete({ collection: 'members', id: memberId, overrideAccess: true })
        .catch(() => {})
    }
    const message = err instanceof Error ? err.message : 'Failed to create Stripe checkout session'
    return Response.json({ error: message }, { status: 502 })
  }
}
