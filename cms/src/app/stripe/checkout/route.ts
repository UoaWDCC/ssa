import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'

export const POST = async (request: NextRequest) => {
  let body: {
    name?: string
    email?: string
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
    name,
    email,
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
  if (
    !name ||
    !email ||
    !password ||
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
          'Missing required fields: name, email, password, phone, upi, studentId, areaOfStudy, yearOfUniversity, gender, ethnicity, returningMember',
      },
      { status: 400 },
    )
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID
  const webUrl = process.env.WEB_URL || 'http://localhost:3000'

  if (!stripeSecretKey || !priceId) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })
  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  // Reuse an existing pending member so a transient Stripe failure doesn't
  // permanently block the email from retrying.
  let memberId: number
  let memberCreatedHere = false

  const existing = await payload.find({
    collection: 'members',
    where: { and: [{ email: { equals: email } }, { status: { equals: 'pending' } }] },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    memberId = existing.docs[0].id
    // Update the existing pending member with the latest submitted details
    // so a retry after correcting input always uses the most recent data.
    await payload.update({
      collection: 'members',
      id: memberId,
      overrideAccess: true,
      data: {
        name,
        phone,
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
          email,
          password,
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
        return Response.json({ error: 'An account with this email already exists' }, { status: 409 })
      }
      return Response.json({ error: message }, { status: 400 })
    }
  }

  let customerId: string
  try {
    const customer = await stripe.customers.create({ email, name })
    customerId = customer.id
  } catch (err: unknown) {
    if (memberCreatedHere) {
      await payload.delete({ collection: 'members', id: memberId }).catch(() => {})
    }
    const message = err instanceof Error ? err.message : 'Failed to create Stripe customer'
    return Response.json({ error: message }, { status: 502 })
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
      if (memberCreatedHere) {
        await payload.delete({ collection: 'members', id: memberId }).catch(() => {})
      }
      return Response.json(
        { error: 'Stripe did not provide a checkout URL for the created session' },
        { status: 502 },
      )
    }

    return Response.json({ checkoutUrl: session.url })
  } catch (err: unknown) {
    if (memberCreatedHere) {
      await payload.delete({ collection: 'members', id: memberId }).catch(() => {})
    }
    const message = err instanceof Error ? err.message : 'Failed to create Stripe checkout session'
    return Response.json({ error: message }, { status: 502 })
  }
}
