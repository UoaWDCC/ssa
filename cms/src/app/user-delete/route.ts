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

  let body: { userId?: string | number; secret?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.secret || body.secret !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!body.userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  await payload.delete({
    collection: 'users',
    id: body.userId,
    overrideAccess: true,
  })

  return Response.json({ ok: true })
}
