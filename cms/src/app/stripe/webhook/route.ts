import { NextRequest } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import { createDecipheriv } from 'crypto'

function decryptPassword(encrypted: string, hexKey: string): string {
  const key = Buffer.from(hexKey, 'hex')
  const buf = Buffer.from(encrypted, 'base64')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const ciphertext = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}

export const POST = async (request: NextRequest) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const encryptionKey = process.env.SIGNUP_ENCRYPTION_KEY

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

    const { name, email, phone, encryptedPassword } = session.metadata ?? {}
    const stripeCustomerId = session.customer as string | null

    if (!name || !email || !phone || !encryptedPassword) {
      console.error('Stripe webhook: missing user data in session metadata', { sessionId: session.id })
      return Response.json({ received: true })
    }

    if (!encryptionKey) {
      console.error('Stripe webhook: SIGNUP_ENCRYPTION_KEY not configured')
      return Response.json({ error: 'Encryption not configured' }, { status: 500 })
    }

    let password: string
    try {
      password = decryptPassword(encryptedPassword, encryptionKey)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to decrypt password'
      console.error('Stripe webhook: failed to decrypt password', { sessionId: session.id, error: message })
      return Response.json({ error: message }, { status: 500 })
    }

    const payload = await getPayload({ config: configPromise })

    try {
      await payload.create({
        collection: 'members',
        data: {
          name,
          email,
          password,
          phone,
          status: 'active',
          ...(stripeCustomerId ? { stripeCustomerId } : {}),
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create member'
      // If the member already exists (duplicate webhook delivery), treat as success
      if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
        return Response.json({ received: true })
      }
      console.error('Stripe webhook: failed to create member', { email, error: message })
      // Return 500 so Stripe retries with exponential backoff
      return Response.json({ error: message }, { status: 500 })
    }
  }

  return Response.json({ received: true })
}
