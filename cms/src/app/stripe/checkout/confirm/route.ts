import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import { activatePaidSignup } from '../../_lib/activatePaidSignup'

export const GET = async (request: NextRequest) => {
  const sessionId = request.nextUrl.searchParams.get('session_id')

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve Stripe session'
    return Response.json({ error: message }, { status: 502 })
  }

  const memberId = Number(session.metadata?.memberId)
  const stripeCustomerId =
    typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null)

  if (session.payment_status !== 'paid') {
    return Response.json({
      confirmed: false,
      paymentStatus: session.payment_status,
    })
  }

  if (!Number.isFinite(memberId)) {
    return Response.json({ error: 'Stripe session is missing member metadata' }, { status: 422 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    await activatePaidSignup({
      memberId,
      payload,
      stripeCustomerId,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to activate paid signup'
    return Response.json({ error: message }, { status: 500 })
  }

  return Response.json({
    confirmed: true,
    paymentStatus: session.payment_status,
  })
}
