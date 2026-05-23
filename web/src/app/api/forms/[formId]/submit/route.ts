import { NextRequest } from 'next/server'

type SubmissionDataEntry = {
  field: string
  value: unknown
}

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) => {
  const cmsUrl = process.env.CMS_URL

  if (!cmsUrl) {
    return Response.json({ error: 'CMS_URL not configured' }, { status: 500 })
  }

  const { formId } = await params

  let body: { submissionData?: SubmissionDataEntry[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!Array.isArray(body.submissionData)) {
    return Response.json(
      { error: 'submissionData is required' },
      { status: 400 },
    )
  }

  let cmsResponse: Response
  try {
    cmsResponse = await fetch(new URL('/api/form-submissions', cmsUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form: formId,
        submissionData: body.submissionData,
      }),
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
      data = { error: 'Form submission service error. Please try again.' }
    }
  }

  return Response.json(data, { status: cmsResponse.status })
}
