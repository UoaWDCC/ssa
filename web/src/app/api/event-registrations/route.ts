import { getSession } from '@/lib/session'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function POST(request: Request) {
  const cmsUrl = process.env.CMS_URL?.replace(/\/$/, '')
  const internalSecret =
    process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET

  if (!cmsUrl || !internalSecret) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!isRecord(body)) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const session = await getSession()

  let cmsResponse: Response
  try {
    cmsResponse = await fetch(`${cmsUrl}/event-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        userId: session?.userId,
        secret: internalSecret,
      }),
    })
  } catch {
    return Response.json({ error: 'Failed to reach CMS' }, { status: 502 })
  }

  const cmsBody = await cmsResponse.text()
  let data: unknown

  if (!cmsBody) {
    data = { error: 'Empty CMS response' }
  } else {
    try {
      data = JSON.parse(cmsBody)
    } catch {
      console.error(
        '[api/event-registrations] CMS returned non-JSON body:',
        cmsBody,
      )
      data = { error: 'Event registration service error. Please try again.' }
    }
  }

  return Response.json(data, { status: cmsResponse.status })
}
