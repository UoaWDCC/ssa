const timeZone = 'Pacific/Auckland'

function parseDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value?: string | null) {
  const date = parseDate(value)
  if (!date) return 'Date to be confirmed'

  return new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(date)
}

// Payload stores the day and time as separate timestamps. Format each in the
// event's timezone, ignoring the calendar date attached to the time field.
export function formatEventDate(date?: string | null, time?: string | null) {
  if (!parseDate(date)) return 'Date to be confirmed'
  const eventTime = parseDate(time)
  if (!eventTime) return formatDate(date)

  return `${formatDate(date)} – ${new Intl.DateTimeFormat('en-NZ', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(eventTime)}`
}

export function eventDateTime(date?: string | null, time?: string | null) {
  const eventDate = parseDate(date)
  if (!eventDate) return undefined

  const parts = new Intl.DateTimeFormat('en-NZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(eventDate)
  const part = (type: string) =>
    parts.find((entry) => entry.type === type)?.value
  const day = `${part('year')}-${part('month')}-${part('day')}`
  const eventTime = parseDate(time)
  if (!eventTime) return day

  const clock = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(eventTime)

  // A local datetime matches the displayed Auckland day and clock time.
  return `${day}T${clock}`
}
