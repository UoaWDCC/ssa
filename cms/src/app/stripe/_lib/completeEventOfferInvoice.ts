import type Stripe from 'stripe'
import { createLocalReq, type Payload } from 'payload'
import { lockEvent, relationshipId } from '@/lib/eventCapacity'

export async function completeEventOfferInvoice({
  payload,
  invoice,
}: {
  payload: Payload
  invoice: Stripe.Invoice
}) {
  const registrationId = Number(invoice.metadata?.registrationId)
  if (!Number.isSafeInteger(registrationId) || registrationId <= 0)
    throw new Error('Invoice is missing event registration metadata')
  if (invoice.status !== 'paid') throw new Error('Invoice has not been paid')

  const transactionID = await payload.db.beginTransaction()
  if (transactionID == null) throw new Error('Invoice payment requires a database transaction')
  const req = await createLocalReq({ context: { eventInvoicePayment: true } }, payload)
  req.transactionID = transactionID
  try {
    const original = await payload.findByID({
      collection: 'event-registrations',
      id: registrationId,
      depth: 0,
      overrideAccess: true,
      req,
    })
    await lockEvent(req, relationshipId(original.event))
    const registration = await payload.findByID({
      collection: 'event-registrations',
      id: registrationId,
      depth: 0,
      overrideAccess: true,
      req,
    })
    // A delayed webhook for a withdrawn/replaced offer must not admit someone.
    if (registration.stripeInvoiceId !== invoice.id) {
      if (Number(invoice.metadata?.offerVersion) > (registration.offerVersion ?? 0)) {
        throw new Error('Invoice does not match the current offer')
      }
      await payload.db.commitTransaction(transactionID)
      return registration
    }
    if (
      invoice.total !== Math.round(registration.amount * 100) ||
      invoice.currency !== registration.currency
    ) {
      throw new Error('Invoice amount or currency does not match the registration')
    }
    if (registration.status !== 'paid' && registration.status !== 'refunded') {
      if (registration.status !== 'offered')
        throw new Error('This registration has no active offer')
      const updated = await payload.update({
        collection: 'event-registrations',
        id: registrationId,
        overrideAccess: true,
        req,
        data: {
          status: 'paid',
          paidAt: new Date(
            (invoice.status_transitions.paid_at ?? Math.floor(Date.now() / 1000)) * 1000,
          ).toISOString(),
        },
      })
      await payload.db.commitTransaction(transactionID)
      return updated
    }
    await payload.db.commitTransaction(transactionID)
    return registration
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    throw error
  }
}
