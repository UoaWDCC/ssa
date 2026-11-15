import { APIError, type CollectionBeforeChangeHook, type CollectionBeforeDeleteHook } from 'payload'
import { getEventAvailability, lockEvent, relationshipId } from '@/lib/eventCapacity'
import { createEventOfferInvoice, withdrawEventOffer } from '@/app/stripe/_lib/eventOfferInvoice'
import type { EventRegistration } from '@/payload-types'

export const prepareEventRegistration: CollectionBeforeChangeHook<EventRegistration> = async ({
  data,
  originalDoc,
  operation,
  req,
  context,
}) => {
  const eventId = relationshipId(data.event ?? originalDoc?.event)
  await lockEvent(req, eventId)

  if (operation === 'create' && context.eventSignup) {
    const event = await req.payload.findByID({ collection: 'events', id: eventId, depth: 0, req })
    if (!event.isUpcoming) throw new APIError('This event is not open for registration', 409)
    const existing = await req.payload.count({
      collection: 'event-registrations',
      where: {
        and: [
          { event: { equals: eventId } },
          { user: { equals: relationshipId(data.user) } },
          { status: { not_in: ['cancelled', 'refunded'] } },
        ],
      },
      overrideAccess: true,
      req,
    })
    if (existing.totalDocs) throw new APIError('You have already registered for this event', 409)
    const availability = await getEventAvailability(req.payload, eventId, event.capacity, req)
    // Re-read price under the event lock in case an organiser edited it mid-signup.
    data.amount = event.memberPrice ?? 0
    const amountInCents = Math.round(data.amount * 100)
    if (!Number.isSafeInteger(amountInCents) || amountInCents < 0) {
      throw new APIError('The event price is invalid', 422)
    }
    if (availability.waitlistEnabled) {
      data.status = 'waitlisted'
      data.paidAt = null
    } else {
      const free = amountInCents === 0
      data.status = free ? 'paid' : 'pending'
      data.paidAt = free ? new Date().toISOString() : null
    }
  }

  if (operation !== 'update' || !originalDoc) {
    if (data.status === 'offered')
      throw new APIError('Create a waitlisted registration before offering a place', 400)
    return data
  }

  // Reload after acquiring the lock: simultaneous admin saves/webhooks must not
  // operate on the original document fetched before another request committed.
  const current = await req.payload.findByID({
    collection: 'event-registrations',
    id: originalDoc.id,
    depth: 0,
    req,
  })
  if (eventId !== relationshipId(current.event))
    throw new APIError('A registration cannot be moved to another event', 400)
  if (current.stripeInvoiceId || current.stripeCheckoutSessionId || data.status === 'offered') {
    for (const field of ['amount', 'currency', 'email', 'user'] as const) {
      if (
        field in data &&
        (field === 'user'
          ? relationshipId(data[field]) !== relationshipId(current[field])
          : data[field] !== current[field])
      )
        throw new APIError(
          'Payment details cannot be changed after payment has been requested',
          400,
        )
    }
  }
  // An expiry webhook may have selected the row before a payment committed.
  if (context.eventCheckoutExpired && current.status !== 'pending')
    return { ...data, status: current.status }
  const nextStatus = data.status ?? current.status
  if (
    current.status === 'waitlisted' &&
    nextStatus !== 'waitlisted' &&
    nextStatus !== 'offered' &&
    nextStatus !== 'cancelled'
  ) {
    throw new APIError('Offer a place before marking a waitlisted registration paid', 400)
  }
  if (nextStatus === 'offered' && current.status !== 'offered') {
    if (current.status !== 'waitlisted')
      throw new APIError('Only waitlisted registrations can be offered a place', 400)
    const event = await req.payload.findByID({ collection: 'events', id: eventId, depth: 0, req })
    // Offers deliberately bypass capacity: execs may admit people over the limit.
    Object.assign(data, await createEventOfferInvoice(current as EventRegistration, event.title))
  }
  if (current.status === 'offered' && nextStatus !== 'offered') {
    if (nextStatus === 'waitlisted' || nextStatus === 'cancelled') {
      if (current.stripeInvoiceId) await withdrawEventOffer(current.stripeInvoiceId)
      Object.assign(data, {
        stripeInvoiceId: null,
        stripeInvoiceUrl: null,
        offerDueAt: null,
        offeredAt: null,
      })
    } else if (!context.eventInvoicePayment || nextStatus !== 'paid') {
      throw new APIError(
        'Offer payment is confirmed by Stripe; withdraw it by selecting Waitlisted or Cancelled',
        400,
      )
    }
  }
  return data
}

export const protectOfferedRegistration: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const registration = await req.payload.findByID({
    collection: 'event-registrations',
    id,
    depth: 0,
    req,
  })
  await lockEvent(req, relationshipId(registration.event))
  const current = await req.payload.findByID({
    collection: 'event-registrations',
    id,
    depth: 0,
    req,
  })
  if (current.status === 'offered')
    throw new APIError('Withdraw the offer before deleting this registration', 400)
}
