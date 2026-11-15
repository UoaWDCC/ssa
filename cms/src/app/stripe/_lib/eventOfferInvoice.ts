import Stripe from 'stripe'
import type { EventRegistration } from '@/payload-types'

export function eventStripe() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) throw new Error('Stripe not configured')
  return new Stripe(secret, { apiVersion: '2026-04-22.dahlia' })
}

export async function createEventOfferInvoice(registration: EventRegistration, title: string) {
  const stripe = eventStripe()
  const attempt = (registration.offerVersion ?? 0) + 1
  const key = `event-offer-${registration.id}-${attempt}`
  const metadata = {
    checkoutType: 'event-waitlist-offer',
    registrationId: String(registration.id),
    offerVersion: String(attempt),
  }
  const amount = Math.round(registration.amount * 100)
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid event price')

  // A dedicated customer keeps the invoice isolated from membership billing,
  // including any customer credit balance. Retrying an offer reuses every step.
  const customer = await stripe.customers.create(
    {
      email: registration.email,
      name: `${registration.firstName} ${registration.lastName}`,
      metadata,
    },
    { idempotencyKey: `${key}-customer` },
  )
  let invoice = await stripe.invoices.create(
    {
      customer: customer.id,
      currency: registration.currency,
      collection_method: 'send_invoice',
      days_until_due: 3,
      auto_advance: false,
      pending_invoice_items_behavior: 'exclude',
      description: title,
      metadata,
    },
    { idempotencyKey: `${key}-invoice` },
  )
  // Explicitly target this invoice rather than leaving an item for the next bill.
  await stripe.invoiceItems.create(
    {
      customer: customer.id,
      invoice: invoice.id,
      amount,
      currency: registration.currency,
      description: title,
    },
    { idempotencyKey: `${key}-item` },
  )
  invoice = await stripe.invoices.finalizeInvoice(
    invoice.id,
    { auto_advance: false },
    { idempotencyKey: `${key}-finalize` },
  )
  invoice = await stripe.invoices.sendInvoice(invoice.id, {}, { idempotencyKey: `${key}-send` })

  return {
    offerVersion: attempt,
    stripeInvoiceId: invoice.id,
    stripeInvoiceUrl: invoice.hosted_invoice_url,
    offerDueAt: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    offeredAt: new Date().toISOString(),
    // Stripe immediately settles zero-value invoices, including free event offers.
    status: invoice.status === 'paid' ? ('paid' as const) : ('offered' as const),
    paidAt: invoice.status === 'paid' ? new Date().toISOString() : null,
  }
}

export async function withdrawEventOffer(invoiceId: string) {
  const stripe = eventStripe()
  const invoice = await stripe.invoices.retrieve(invoiceId)
  if (invoice.status === 'paid')
    throw new Error('This offer has already been paid; refresh the registration')
  if (invoice.status !== 'void') {
    // A due date alone does not disable Stripe's payment link. Void the invoice
    // before releasing a place so the withdrawn offer can no longer be paid.
    await stripe.invoices.voidInvoice(invoiceId, {}, { idempotencyKey: `${invoiceId}-withdraw` })
  }
}
