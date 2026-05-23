export type PayloadFormField = {
  blockName?: string
  blockType: string
  defaultValue?: string | boolean | null
  label?: string
  message?: unknown
  name?: string
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
}

export type PayloadForm = {
  confirmationMessage?: unknown
  confirmationType?: 'message' | 'redirect'
  fields: PayloadFormField[]
  id: string | number
  redirect?: {
    type?: 'custom' | 'reference'
    url?: string
  }
  submitButtonLabel?: string
  title: string
}

type PayloadEvent = {
  signupForm?: PayloadForm | string | null
}

const defaultFormTitle = 'Contact Information'

export async function fetchPayloadForm(eventId?: string | null) {
  const cmsUrl = process.env.CMS_URL

  if (!cmsUrl) {
    return null
  }

  if (eventId) {
    const eventResponse = await fetch(
      new URL(`/api/events/${eventId}?depth=1`, cmsUrl),
      {
        cache: 'no-store',
      },
    )

    if (eventResponse.ok) {
      const event = (await eventResponse.json()) as PayloadEvent

      if (event.signupForm && typeof event.signupForm === 'object') {
        return event.signupForm
      }

      if (typeof event.signupForm === 'string') {
        const formResponse = await fetch(
          new URL(`/api/forms/${event.signupForm}`, cmsUrl),
          {
            cache: 'no-store',
          },
        )

        if (formResponse.ok) {
          return (await formResponse.json()) as PayloadForm
        }
      }
    }
  }

  const formId = process.env.PAYLOAD_FORM_ID?.trim()
  const formTitle = process.env.PAYLOAD_FORM_TITLE?.trim() || defaultFormTitle

  if (formId) {
    const response = await fetch(new URL(`/api/forms/${formId}`, cmsUrl), {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as PayloadForm
  }

  const url = new URL('/api/forms', cmsUrl)
  url.searchParams.set('limit', '1')
  url.searchParams.set('depth', '0')
  url.searchParams.set('where[title][equals]', formTitle)

  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { docs?: PayloadForm[] }

  return data.docs?.[0] ?? null
}
