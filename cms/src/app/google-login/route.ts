import crypto from 'node:crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

function getSecret() {
  return process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET
}

export async function POST(request: Request) {
  const secret = getSecret()
  if (!secret) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let body: { googleSub?: string; secret?: string }
  try {
    body = (await request.json()) as { googleSub?: string; secret?: string }
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const incoming = Buffer.from(body.secret ?? '')
  const expected = Buffer.from(secret)
  if (incoming.length !== expected.length || !crypto.timingSafeEqual(incoming, expected)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!body.googleSub) {
    return Response.json({ error: 'googleSub is required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { googleSub: { equals: body.googleSub } },
  })

  if (result.docs.length === 0) {
    return Response.json({ error: 'No account found for this Google account' }, { status: 404 })
  }

  return Response.json({ user: result.docs[0] })
}
