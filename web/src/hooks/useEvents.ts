import { useQuery } from '@tanstack/react-query'
import { fetchFromCMS } from '@/lib/api'
import type { Event, EventsResponse } from '@/types/events'

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  detail: (id: number) => [...eventKeys.all, 'detail', id] as const,
}

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () =>
      fetchFromCMS<EventsResponse>('/events?depth=1&limit=100&sort=-date'),
    select: (data) => data.docs,
  })
}

export function useUpcomingEvents() {
  const query = useEvents()

  return {
    ...query,
    data: query.data?.filter((event: Event) => event.isUpcoming === true) ?? [],
  }
}

export function usePastEvents() {
  const query = useEvents()

  return {
    ...query,
    data: query.data?.filter((event: Event) => event.isUpcoming !== true) ?? [],
  }
}
