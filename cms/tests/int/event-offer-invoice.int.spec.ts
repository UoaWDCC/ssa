// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type Stripe from 'stripe'
import type { Payload } from 'payload'
import type { EventRegistration } from '@/payload-types'

const stripe = vi.hoisted(() => ({
  customers: { create: vi.fn() },
  invoices: {
    create: vi.fn(),
    finalizeInvoice: vi.fn(),
    sendInvoice: vi.fn(),
    retrieve: vi.fn(),
    voidInvoice: vi.fn(),
  },
  invoiceItems: { create: vi.fn() },
}))
vi.mock('stripe', () => ({
  default: vi.fn(function () {
    return stripe
  }),
}))
vi.mock('payload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('payload')>()),
  createLocalReq: vi.fn(async ({ context }, payload) => ({ context, payload })),
}))
import { createEventOfferInvoice, withdrawEventOffer } from '@/app/stripe/_lib/eventOfferInvoice'
import { completeEventOfferInvoice } from '@/app/stripe/_lib/completeEventOfferInvoice'

const registration = {
  id: 2,
  event: 1,
  amount: 15,
  currency: 'nzd',
  email: 'member@example.com',
  firstName: 'Test',
  lastName: 'Member',
  status: 'offered',
  offerVersion: 1,
  stripeInvoiceId: 'in_offer',
} as EventRegistration
const invoice = {
  id: 'in_offer',
  status: 'paid',
  metadata: { registrationId: '2', offerVersion: '1' },
  total: 1500,
  currency: 'nzd',
  status_transitions: { paid_at: 1791763200 },
} as unknown as Stripe.Invoice
let payload: Payload
let db: {
  beginTransaction: ReturnType<typeof vi.fn>
  commitTransaction: ReturnType<typeof vi.fn>
  rollbackTransaction: ReturnType<typeof vi.fn>
  sessions: Record<string, { db: { execute: ReturnType<typeof vi.fn> } }>
}
let findByID: ReturnType<typeof vi.fn>
let update: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_example')
  stripe.customers.create.mockResolvedValue({ id: 'cus_offer' })
  stripe.invoices.create.mockResolvedValue({ id: 'in_offer' })
  stripe.invoiceItems.create.mockResolvedValue({ id: 'ii_offer' })
  stripe.invoices.finalizeInvoice.mockResolvedValue({ id: 'in_offer', status: 'open' })
  stripe.invoices.sendInvoice.mockResolvedValue({
    id: 'in_offer',
    status: 'open',
    hosted_invoice_url: 'https://invoice.stripe.com/offer',
    due_date: 1792022400,
  })
  db = {
    beginTransaction: vi.fn().mockResolvedValue('txn'),
    commitTransaction: vi.fn(),
    rollbackTransaction: vi.fn(),
    sessions: { txn: { db: { execute: vi.fn() } } },
  }
  findByID = vi.fn().mockResolvedValue(registration)
  update = vi.fn().mockResolvedValue({ ...registration, status: 'paid' })
  payload = { db, findByID, update } as unknown as Payload
})

describe('Stripe waitlist offer invoices', () => {
  it('creates, finalizes, and emails an isolated invoice with a three-day deadline', async () => {
    const result = await createEventOfferInvoice(
      { ...registration, status: 'waitlisted', offerVersion: 0 },
      'Dinner',
    )
    expect(result).toMatchObject({
      stripeInvoiceId: 'in_offer',
      stripeInvoiceUrl: 'https://invoice.stripe.com/offer',
      offerVersion: 1,
      status: 'offered',
      offerDueAt: new Date(1792022400 * 1000).toISOString(),
    })
    expect(stripe.invoices.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection_method: 'send_invoice',
        days_until_due: 3,
        auto_advance: false,
        pending_invoice_items_behavior: 'exclude',
        metadata: { checkoutType: 'event-waitlist-offer', registrationId: '2', offerVersion: '1' },
      }),
      { idempotencyKey: 'event-offer-2-1-invoice' },
    )
    expect(stripe.invoiceItems.create).toHaveBeenCalledWith(
      expect.objectContaining({ invoice: 'in_offer', amount: 1500, currency: 'nzd' }),
      { idempotencyKey: 'event-offer-2-1-item' },
    )
    expect(stripe.invoices.sendInvoice).toHaveBeenCalledWith(
      'in_offer',
      {},
      { idempotencyKey: 'event-offer-2-1-send' },
    )
  })

  it('uses stable idempotency keys for retry and a fresh version for re-offering', async () => {
    await createEventOfferInvoice(registration, 'Dinner')
    await createEventOfferInvoice(registration, 'Dinner')
    expect(stripe.invoices.create.mock.calls[0]).toEqual(stripe.invoices.create.mock.calls[1])
    await createEventOfferInvoice({ ...registration, offerVersion: 2 }, 'Dinner')
    expect(stripe.invoices.create.mock.calls[2][1]).toEqual({
      idempotencyKey: 'event-offer-2-3-invoice',
    })
  })

  it('confirms a zero-value offer when Stripe finalizes it as paid', async () => {
    stripe.invoices.sendInvoice.mockResolvedValue({ ...invoice, total: 0 })
    expect(
      await createEventOfferInvoice({ ...registration, amount: 0 }, 'Free dinner'),
    ).toMatchObject({ status: 'paid', paidAt: expect.any(String) })
    expect(stripe.invoiceItems.create.mock.calls[0][0].amount).toBe(0)
  })

  it('voids unpaid invoices, safely retries withdrawal, and refuses paid invoices', async () => {
    stripe.invoices.retrieve.mockResolvedValue({ status: 'open' })
    await withdrawEventOffer('in_offer')
    expect(stripe.invoices.voidInvoice).toHaveBeenCalledWith(
      'in_offer',
      {},
      { idempotencyKey: 'in_offer-withdraw' },
    )
    stripe.invoices.retrieve.mockResolvedValue({ status: 'void' })
    await withdrawEventOffer('in_offer')
    expect(stripe.invoices.voidInvoice).toHaveBeenCalledOnce()
    stripe.invoices.retrieve.mockResolvedValue({ status: 'paid' })
    await expect(withdrawEventOffer('in_offer')).rejects.toThrow('already been paid')
  })

  it('marks the matching offer paid in the same locked transaction', async () => {
    await completeEventOfferInvoice({ payload, invoice })
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        data: { status: 'paid', paidAt: new Date(1791763200 * 1000).toISOString() },
        req: expect.objectContaining({
          transactionID: 'txn',
          context: { eventInvoicePayment: true },
        }),
      }),
    )
    expect(db.commitTransaction).toHaveBeenCalledWith('txn')
    expect(db.rollbackTransaction).not.toHaveBeenCalled()
  })

  it.each(['paid', 'refunded'])(
    'does not overwrite %s registrations on webhook replay',
    async (status) => {
      findByID.mockResolvedValue({ ...registration, status })
      await completeEventOfferInvoice({ payload, invoice })
      expect(update).not.toHaveBeenCalled()
      expect(db.commitTransaction).toHaveBeenCalledOnce()
    },
  )

  it.each([{ total: 1000 }, { currency: 'usd' }])(
    'rejects payment mismatches: %j',
    async (changes) => {
      await expect(
        completeEventOfferInvoice({
          payload,
          invoice: { ...invoice, ...changes } as Stripe.Invoice,
        }),
      ).rejects.toThrow('amount or currency')
      expect(update).not.toHaveBeenCalled()
      expect(db.rollbackTransaction).toHaveBeenCalledWith('txn')
    },
  )

  it('ignores delayed payment events for a withdrawn or replaced offer', async () => {
    findByID.mockResolvedValue({ ...registration, status: 'waitlisted', stripeInvoiceId: null })
    await completeEventOfferInvoice({ payload, invoice })
    expect(update).not.toHaveBeenCalled()
    expect(db.commitTransaction).toHaveBeenCalledOnce()
  })

  it('asks Stripe to retry if the invoice webhook arrives before the offer commits', async () => {
    findByID.mockResolvedValue({
      ...registration,
      status: 'waitlisted',
      stripeInvoiceId: null,
      offerVersion: 0,
    })
    await expect(completeEventOfferInvoice({ payload, invoice })).rejects.toThrow('current offer')
    expect(db.rollbackTransaction).toHaveBeenCalledOnce()
  })
})
