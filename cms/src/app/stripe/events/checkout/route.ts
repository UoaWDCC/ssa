import { NextRequest } from 'next/server'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import Stripe from 'stripe'

// Generic route for all event payments, takes in stripe customer ID and event price ID
export const POST = async (request: NextRequest) => {
  let body: {
    eventId?: string
    customerId?: string
    priceId?: string
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { customerId, priceId, eventId } = body
  if (!customerId || !priceId) {
    return Response.json(
      {
        error: 'Missing required fields: customerId, priceId',
      },
      { status: 400 },
    )
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webUrl = process.env.WEB_URL || 'http://localhost:3000'

  if (!stripeSecretKey || !priceId) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  // const payload = await getPayload({ config: configPromise })
  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${webUrl}/events/signup/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webUrl}/events//signup/${eventId}?cancelled=true`,
      metadata: { customerId: String(customerId) },
    })

    if (!session.url) {
      return Response.json(
        { error: 'Stripe did not provide a checkout URL for the created session' },
        { status: 502 },
      )
    }

    return Response.json({ checkoutUrl: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create Stripe checkout session'
    return Response.json({ error: message }, { status: 502 })
  }
}
