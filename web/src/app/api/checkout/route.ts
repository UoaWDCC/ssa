import { NextRequest } from 'next/server'

import {
  googleSignupSessionCookie,
  readGoogleSignupSession,
} from '@/lib/googleSignupSession'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function textValue(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

export const POST = async (request: NextRequest) => {
  const cmsUrl = process.env.CMS_URL

  if (!cmsUrl) {
    return Response.json({ error: 'CMS_URL not configured' }, { status: 500 })
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

  if (body.authProvider === 'google') {
    const profile = readGoogleSignupSession(
      request.cookies.get(googleSignupSessionCookie)?.value,
    )

    if (!profile) {
      return Response.json(
        {
          error: 'Google sign up session expired. Please connect Google again.',
        },
        { status: 401 },
      )
    }

    const firstName =
      textValue(body.firstName)?.trim() || profile.firstName || ''
    const lastName = textValue(body.lastName)?.trim() || profile.lastName || ''

    body = {
      ...body,
      authProvider: 'google',
      email: profile.email,
      firstName,
      googleSub: profile.googleSub,
      lastName,
      name: `${firstName} ${lastName}`.trim() || profile.name || profile.email,
    }
  } else {
    body = {
      ...body,
      authProvider: 'email',
    }
  }

  let cmsResponse: Response
  try {
    cmsResponse = await fetch(`${cmsUrl}/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reach CMS'
    return Response.json({ error: message }, { status: 502 })
  }

  const cmsBody = await cmsResponse.text()
  let data: unknown

  if (!cmsBody) {
    data = { error: 'Empty CMS response' }
  } else {
    try {
      data = JSON.parse(cmsBody)
    } catch {
      console.error('[api/checkout] CMS returned non-JSON body:', cmsBody)
      data = { error: 'Checkout service error. Please try again.' }
    }
  }

  return Response.json(data, { status: cmsResponse.status })
}
