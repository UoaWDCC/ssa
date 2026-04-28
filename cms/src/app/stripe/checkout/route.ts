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

  const { name, email, password, phone, upi, studentId, areaOfStudy, yearOfUniversity, gender, ethnicity, returningMember } = body
  if (!name || !email || !password || !phone) {
    return Response.json({ error: 'Missing required fields: name, email, password, phone' }, { status: 400 })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID
  const webUrl = process.env.WEB_URL || 'http://localhost:3000'

  if (!stripeSecretKey || !priceId) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })

  let memberId: number
  try {
    const member = await payload.create({
      collection: 'members',
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
        returningMember: returningMember ?? false,
        status: 'pending',
      },
    })
    memberId = member.id
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create member'
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 409 })
    }
    return Response.json({ error: message }, { status: 400 })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  let customerId: string
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { memberId: String(memberId) },
    })
    customerId = customer.id
  } catch (err: unknown) {
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
    return Response.json({ checkoutUrl: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create Stripe checkout session'
    return Response.json({ error: message }, { status: 502 })
  }
}
