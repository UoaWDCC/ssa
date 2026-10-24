// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mock = vi.hoisted(() => ({
  getPayload: vi.fn(),
  findByID: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  checkout: vi.fn(),
  constructEvent: vi.fn(),
  invoicePayment: vi.fn(),
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', async (original) => ({
  ...(await original<typeof import('payload')>()),
  getPayload: mock.getPayload,
}))
vi.mock('stripe', () => ({
  default: vi.fn(function () {
    return {
      checkout: { sessions: { create: mock.checkout } },
      webhooks: { constructEvent: mock.constructEvent },
    }
  }),
}))
vi.mock('@/app/stripe/_lib/completeEventOfferInvoice', () => ({
  completeEventOfferInvoice: mock.invoicePayment,
}))
import { POST as register } from '@/app/event-registration/route'
import { POST as webhook } from '@/app/stripe/webhook/route'

const signup = {
  secret: 'shared-test-secret',
  event: 1,
  userId: 3,
  emergencyContactName: 'Contact',
  emergencyContactPhone: '021234567',
  emergencyContactRelationship: 'Parent',
  gender: 'not-say',
  dietaryRequirements: 'None',
  universityYear: '3',
}
function registrationRequest(body = signup) {
  return new Request('http://localhost/event-registration', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}
function webhookRequest(signature?: string) {
  return new NextRequest('http://localhost/stripe/webhook', {
    method: 'POST',
    headers: signature ? { 'stripe-signature': signature } : {},
    body: 'stripe-raw-body',
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('GOOGLE_OAUTH_COOKIE_SECRET', 'shared-test-secret')
  vi.stubEnv('WEB_URL', 'http://localhost:3000')
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_example')
  vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test_example')
  mock.getPayload.mockResolvedValue({
    findByID: mock.findByID,
    create: mock.create,
    update: mock.update,
  })
  mock.findByID.mockImplementation(({ collection }) =>
    Promise.resolve(
      collection === 'users'
        ? {
            id: 3,
            membershipStatus: 'active',
            firstName: 'Test',
            lastName: 'Member',
            email: 'member@example.com',
          }
        : { id: 1, title: 'Dinner', isUpcoming: true, memberPrice: 15 },
    ),
  )
  mock.create.mockResolvedValue({ id: 2, status: 'waitlisted', amount: 15, currency: 'nzd' })
})

describe('waitlist backend routes', () => {
  it('returns the waitlist confirmation with no payment or checkout URL', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '')
    const response = await register(registrationRequest())
    expect(response.status).toBe(201)
    const body = await response.json()
    expect(body).toMatchObject({
      status: 'waitlisted',
      message: "You're on the waitlist",
      registration: { id: 2 },
    })
    expect(body.checkoutUrl).toBeUndefined()
    expect(mock.checkout).not.toHaveBeenCalled()
    expect(mock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        context: { eventSignup: true },
        data: expect.objectContaining({ user: 3, event: 1 }),
      }),
    )
  })

  it('rejects unauthenticated internal signup calls', async () => {
    expect((await register(registrationRequest({ ...signup, secret: 'incorrect' }))).status).toBe(
      401,
    )
    expect(mock.getPayload).not.toHaveBeenCalled()
  })

  it.each(['pending', 'expired'])(
    'rejects %s memberships before joining a waitlist',
    async (membershipStatus) => {
      mock.findByID.mockResolvedValue({ id: 3, membershipStatus })
      const response = await register(registrationRequest())
      expect(response.status).toBe(403)
      expect(mock.create).not.toHaveBeenCalled()
      expect(mock.checkout).not.toHaveBeenCalled()
    },
  )

  it('preserves the free event confirmation response', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '')
    mock.create.mockResolvedValue({ id: 2, status: 'paid', amount: 0 })
    const response = await register(registrationRequest())
    expect(response.status).toBe(201)
    expect(await response.json()).toMatchObject({
      checkoutUrl: 'http://localhost:3000/events/rsvp/success?free=1',
    })
    expect(mock.checkout).not.toHaveBeenCalled()
  })

  it('requires a verified signature before processing invoice payment', async () => {
    expect((await webhook(webhookRequest())).status).toBe(400)
    mock.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })
    expect((await webhook(webhookRequest('invalid'))).status).toBe(400)
    expect(mock.invoicePayment).not.toHaveBeenCalled()
    expect(mock.getPayload).not.toHaveBeenCalled()
  })

  it('processes invoice.paid only for event waitlist invoices', async () => {
    const invoice = { id: 'in_offer', metadata: { checkoutType: 'event-waitlist-offer' } }
    mock.constructEvent.mockReturnValue({ type: 'invoice.paid', data: { object: invoice } })
    expect((await webhook(webhookRequest('valid'))).status).toBe(200)
    expect(mock.invoicePayment).toHaveBeenCalledWith(expect.objectContaining({ invoice }))
    mock.invoicePayment.mockClear()
    mock.constructEvent.mockReturnValue({
      type: 'invoice.paid',
      data: { object: { metadata: {} } },
    })
    expect((await webhook(webhookRequest('valid'))).status).toBe(200)
    expect(mock.invoicePayment).not.toHaveBeenCalled()
  })

  it('releases pending places when their Stripe checkout expires', async () => {
    mock.constructEvent.mockReturnValue({
      type: 'checkout.session.expired',
      data: { object: { id: 'cs_expired', metadata: { checkoutType: 'event-registration' } } },
    })
    expect((await webhook(webhookRequest('valid'))).status).toBe(200)
    expect(mock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        context: { eventCheckoutExpired: true },
        where: {
          and: [
            { stripeCheckoutSessionId: { equals: 'cs_expired' } },
            { status: { equals: 'pending' } },
          ],
        },
        data: { status: 'cancelled' },
      }),
    )
  })
})
