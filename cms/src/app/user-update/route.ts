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

  let body: { userId?: string | number; data?: Record<string, unknown>; secret?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.secret || body.secret !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!body.userId || !body.data) {
    return Response.json({ error: 'userId and data are required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  const user = await payload.update({
    collection: 'users',
    id: body.userId,
    data: body.data,
    overrideAccess: true,
  })

  return Response.json({ user })
}
