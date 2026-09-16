import type Stripe from 'stripe'
import type { Payload } from 'payload'

type CompletePaidEventRegistrationArgs = {
  payload: Payload
  session: Stripe.Checkout.Session
}

function getRegistrationId(session: Stripe.Checkout.Session) {
  const registrationId = Number(session.metadata?.registrationId)

  if (!Number.isInteger(registrationId) || registrationId <= 0) {
    throw new Error('Stripe session is missing event registration metadata')
  }

  return registrationId
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === 'string') return session.payment_intent
  return session.payment_intent?.id ?? null
}

export async function completePaidEventRegistration({
  payload,
  session,
}: CompletePaidEventRegistrationArgs) {
  const registrationId = getRegistrationId(session)
  const registration = await payload.findByID({
    collection: 'event-registrations',
    id: registrationId,
    depth: 1,
    overrideAccess: true,
  })

  if (registration.stripeCheckoutSessionId && registration.stripeCheckoutSessionId !== session.id) {
    throw new Error('Stripe session does not match the event registration')
  }

  const expectedAmount = Math.round(registration.amount * 100)
  if (session.amount_total !== expectedAmount) {
    throw new Error('Stripe payment amount does not match the event registration')
  }

  if (session.currency?.toLowerCase() !== registration.currency) {
    throw new Error('Stripe payment currency does not match the event registration')
  }

  if (registration.status === 'paid' || registration.status === 'refunded') {
    return registration
  }

  return payload.update({
    collection: 'event-registrations',
    id: registration.id,
    depth: 1,
    overrideAccess: true,
    data: {
      status: 'paid',
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: getPaymentIntentId(session),
      paidAt: new Date().toISOString(),
    },
  })
}
