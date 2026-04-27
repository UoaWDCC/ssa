import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'

export const POST = async (request: NextRequest) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || !webhookSecret) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  // Raw body must be read before any other parsing — required for signature verification
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return Response.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return Response.json({ received: true })
    }

    const memberId = session.metadata?.memberId
    const stripeCustomerId = session.customer as string | null

    if (!memberId) {
      console.error('Stripe webhook: missing memberId in session metadata', { sessionId: session.id })
      return Response.json({ received: true })
    }

    const payload = await getPayload({ config: configPromise })

    try {
      await payload.update({
        collection: 'members',
        id: Number(memberId),
        data: {
          status: 'active',
          ...(stripeCustomerId ? { stripeCustomerId } : {}),
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update member'
      console.error('Stripe webhook: failed to update member', { memberId, error: message })
      // Return 500 so Stripe retries with exponential backoff
      return Response.json({ error: message }, { status: 500 })
    }
  }

  return Response.json({ received: true })
}
