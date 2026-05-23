export type PayloadEvent = {
  id: string | number
  name: string
  description?: string
  eventCost?: number
  date?: string
  location?: string
  signupForm?: PayloadForm | number | string | null
  stripePriceId: string
}

export type PayloadForm = {
  id: string | number
  title: string
  customerId?: string
  priceId?: string
  fields: PayloadFormField[]
}

export type PayloadFormField = {
  name?: string
  label?: string
  blockName?: string
  blockType: string
  defaultValue?: string | boolean | null
  message?: unknown
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
}

export async function fetchEvent(eventId: string) {
  const cmsUrl = process.env.CMS_URL

  if (!cmsUrl) {
    return null
  }
  const response = await fetch(
    new URL(`/api/events/${eventId}?depth=1`, cmsUrl),
    {
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    return null
  }
  return (await response.json()) as PayloadEvent
}
