import { fetchFromCMS } from '@/lib/api'

type EventsPagePayload = {
  title?: string
  subtitle?: string
}

export async function fetchEventsPageContent() {
  try {
    const data = await fetchFromCMS<EventsPagePayload>('/globals/events-page')

    return {
      title: data.title || 'EVENTS',
      subtitle:
        data.subtitle ||
        'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
    }
  } catch {
    return {
      title: 'EVENTS',
      subtitle:
        'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
    }
  }
}
