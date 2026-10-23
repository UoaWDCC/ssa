// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'
import type { EventRegistration } from '@/payload-types'
import { getEventAvailability } from '@/lib/eventCapacity'
import { prepareEventRegistration, protectOfferedRegistration } from '@/hooks/eventRegistrations'
import { Events } from '@/collections/Events'
import { EventRegistrations } from '@/collections/EventRegistrations'

const invoices = vi.hoisted(() => ({ create: vi.fn(), withdraw: vi.fn() }))
vi.mock('@/app/stripe/_lib/eventOfferInvoice', () => ({
  createEventOfferInvoice: invoices.create,
  withdrawEventOffer: invoices.withdraw,
}))

const event = { id: 1, title: 'Dinner', isUpcoming: true, memberPrice: 15, capacity: 1 }
const registration = {
  id: 2,
  event: 1,
  user: 3,
  email: 'member@example.com',
  firstName: 'Test',
  lastName: 'Member',
  amount: 15,
  currency: 'nzd',
  status: 'waitlisted',
  offerVersion: 0,
} as EventRegistration
let payload: {
  count: ReturnType<typeof vi.fn>
  findByID: ReturnType<typeof vi.fn>
  db: { sessions: Record<string, { db: { execute: ReturnType<typeof vi.fn> } }> }
}
let req: PayloadRequest

function change(data: Partial<EventRegistration>, operation = 'update', context = {}) {
  return prepareEventRegistration({
    data,
    originalDoc: operation === 'update' ? registration : undefined,
    operation,
    req,
    context,
  } as never)
}

beforeEach(() => {
  vi.clearAllMocks()
  payload = {
    count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
    findByID: vi
      .fn()
      .mockImplementation(({ collection }) =>
        Promise.resolve(collection === 'events' ? event : registration),
      ),
    db: {
      sessions: { txn: { db: { execute: vi.fn().mockResolvedValue({ rows: [{ id: 1 }] }) } } },
    },
  }
  req = { payload, transactionID: 'txn' } as unknown as PayloadRequest
  invoices.create.mockResolvedValue({
    stripeInvoiceId: 'in_offer',
    stripeInvoiceUrl: 'https://invoice.stripe.com/test',
    status: 'offered',
    offerVersion: 1,
  })
  invoices.withdraw.mockResolvedValue(undefined)
})

describe('event capacity and waitlist', () => {
  it.each([
    [null, 100, false, null],
    [0, 0, true, 0],
    [2, 1, false, 1],
    [2, 2, true, 0],
    [2, 3, true, 0],
    [4, 3, false, 1],
  ])(
    'capacity %s with %s registrations gives waitlist %s',
    async (capacity, count, waitlistEnabled, spotsRemaining) => {
      payload.count.mockResolvedValue({ totalDocs: count })
      expect(await getEventAvailability(req.payload, 1, capacity, req)).toEqual({
        registrationCount: count,
        waitlistEnabled,
        spotsRemaining,
      })
      expect(payload.count.mock.calls[0][0]).toMatchObject({
        req,
        where: {
          and: [{ event: { equals: 1 } }, { status: { in: ['pending', 'offered', 'paid'] } }],
        },
      })
    },
  )

  it('waitlists a full event under the signup transaction without requesting payment', async () => {
    payload.count.mockResolvedValueOnce({ totalDocs: 0 }).mockResolvedValueOnce({ totalDocs: 1 })
    const data = await change({ event: 1, user: 3, status: 'pending' }, 'create', {
      eventSignup: true,
    })
    expect(data).toMatchObject({ status: 'waitlisted', amount: 15, paidAt: null })
    expect(payload.db.sessions.txn.db.execute).toHaveBeenCalledOnce()
    for (const [args] of payload.count.mock.calls) expect(args.req).toBe(req)
    expect(invoices.create).not.toHaveBeenCalled()
  })

  it('rejects duplicate signups and requires a database transaction', async () => {
    payload.count.mockResolvedValue({ totalDocs: 1 })
    await expect(change({ event: 1, user: 3 }, 'create', { eventSignup: true })).rejects.toThrow(
      'already registered',
    )
    req.transactionID = undefined
    await expect(change({ event: 1 }, 'create', { eventSignup: true })).rejects.toThrow(
      'database transaction',
    )
  })

  it('uses the latest event price and preserves free confirmation when places remain', async () => {
    payload.findByID.mockResolvedValue({ ...event, memberPrice: 0, capacity: null })
    expect(
      await change({ event: 1, user: 3, amount: 15 }, 'create', { eventSignup: true }),
    ).toMatchObject({ status: 'paid', amount: 0, paidAt: expect.any(String) })
  })

  it('offers a specific waitlisted registration even when the event is over capacity', async () => {
    payload.count.mockResolvedValue({ totalDocs: 5 })
    expect(await change({ status: 'offered' })).toMatchObject({
      status: 'offered',
      stripeInvoiceId: 'in_offer',
      offerVersion: 1,
    })
    expect(invoices.create).toHaveBeenCalledWith(registration, 'Dinner')
    expect(payload.count).not.toHaveBeenCalled()
  })

  it('leaves the status unchanged when invoice creation fails', async () => {
    invoices.create.mockRejectedValue(new Error('Stripe unavailable'))
    await expect(change({ status: 'offered' })).rejects.toThrow('Stripe unavailable')
  })

  it('requires an offer instead of directly admitting a waitlisted member', async () => {
    await expect(change({ status: 'paid' })).rejects.toThrow('Offer a place')
    await expect(change({ status: 'pending' })).rejects.toThrow('Offer a place')
  })

  it('voids withdrawn offers and clears the payment link', async () => {
    payload.findByID.mockResolvedValue({
      ...registration,
      status: 'offered',
      stripeInvoiceId: 'in_offer',
    })
    expect(await change({ status: 'waitlisted' })).toMatchObject({
      status: 'waitlisted',
      stripeInvoiceId: null,
      stripeInvoiceUrl: null,
      offerDueAt: null,
    })
    expect(invoices.withdraw).toHaveBeenCalledWith('in_offer')
  })

  it('blocks withdrawal if Stripe reports that payment already completed', async () => {
    payload.findByID.mockResolvedValue({
      ...registration,
      status: 'offered',
      stripeInvoiceId: 'in_offer',
    })
    invoices.withdraw.mockRejectedValue(new Error('This offer has already been paid'))
    await expect(change({ status: 'cancelled' })).rejects.toThrow('already been paid')
  })

  it('only accepts offer payment confirmation from the internal webhook path', async () => {
    payload.findByID.mockResolvedValue({
      ...registration,
      status: 'offered',
      stripeInvoiceId: 'in_offer',
    })
    await expect(change({ status: 'paid' })).rejects.toThrow('confirmed by Stripe')
    expect(await change({ status: 'paid' }, 'update', { eventInvoicePayment: true })).toMatchObject(
      { status: 'paid' },
    )
  })

  it('protects identity and price when offering a place', async () => {
    await expect(change({ status: 'offered', amount: 1 })).rejects.toThrow('Payment details')
    await expect(change({ event: 9 })).rejects.toThrow('another event')
    expect(invoices.create).not.toHaveBeenCalled()
  })

  it('does not let an out-of-order checkout expiry overwrite paid status', async () => {
    payload.findByID.mockResolvedValue({ ...registration, status: 'paid' })
    expect(
      await change({ status: 'cancelled' }, 'update', { eventCheckoutExpired: true }),
    ).toMatchObject({ status: 'paid' })
  })

  it('requires withdrawal before an offered registration can be deleted', async () => {
    payload.findByID.mockResolvedValue({ ...registration, status: 'offered' })
    await expect(protectOfferedRegistration({ req, id: 2, context: {} } as never)).rejects.toThrow(
      'Withdraw the offer',
    )
  })

  it('rejects negative or fractional capacities and permits an empty capacity', () => {
    const field = Events.fields.find((field) => 'name' in field && field.name === 'capacity')
    const validate = (field as { validate: (value: number | null) => true | string }).validate
    expect(validate(-1)).toEqual(expect.any(String))
    expect(validate(1.5)).toEqual(expect.any(String))
    expect(validate(null)).toBe(true)
    expect(validate(0)).toBe(true)
    expect(validate(10)).toBe(true)
    for (const action of ['create', 'update', 'delete'] as const) {
      expect(
        Events.access?.[action]?.({
          req: { user: { collection: 'users', role: 'member' } },
        } as never),
      ).toBe(false)
    }
  })

  it('keeps registration administration restricted to admins', () => {
    for (const action of ['create', 'read', 'update', 'delete'] as const) {
      const access = EventRegistrations.access?.[action]
      expect(access?.({ req: { user: { collection: 'users', role: 'member' } } } as never)).toBe(
        false,
      )
      expect(access?.({ req: { user: { collection: 'users', role: 'admin' } } } as never)).toBe(
        true,
      )
    }
    const capacity = Events.fields.find((field) => 'name' in field && field.name === 'capacity')
    expect(capacity).toMatchObject({ min: 0 })
  })
})
