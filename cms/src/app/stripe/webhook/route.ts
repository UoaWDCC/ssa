import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import { activatePaidSignup } from '../_lib/activatePaidSignup'
import { completePaidEventRegistration } from '../_lib/completePaidEventRegistration'

function isSuccessfulPayment(session: Stripe.Checkout.Session) {
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
}

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

  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'checkout.session.async_payment_succeeded'
  ) {
    return Response.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!isSuccessfulPayment(session)) {
    return Response.json({ received: true })
  }

  const payload = await getPayload({ config: configPromise })

  if (session.metadata?.checkoutType === 'event-registration') {
    try {
      await completePaidEventRegistration({ payload, session })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to complete event registration payment'
      console.error('Stripe webhook: failed to complete event registration', {
        sessionId: session.id,
        error: message,
      })
      return Response.json({ error: message }, { status: 500 })
    }

    return Response.json({ received: true })
  }

  const { memberId: rawMemberId } = session.metadata ?? {}
  const stripeCustomerId =
    typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null)

  const memberId = Number(rawMemberId)
  if (!Number.isFinite(memberId)) {
    console.error('Stripe webhook: invalid or missing memberId in session metadata', {
      sessionId: session.id,
      rawMemberId,
    })
    return Response.json({ received: true })
  }

  try {
    await activatePaidSignup({
      memberId,
      payload,
      stripeCustomerId,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to activate paid signup'
    console.error('Stripe webhook: failed to activate paid signup', { memberId, error: message })
    // Return 500 so Stripe retries with exponential backoff
    return Response.json({ error: message }, { status: 500 })
  }

  return Response.json({ received: true })
}
