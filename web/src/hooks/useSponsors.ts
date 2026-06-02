import { useQuery } from '@tanstack/react-query'
import { fetchFromCMS } from '@/lib/api'
import type { Sponsor, SponsorsResponse } from '@/types/sponsors'

export const sponsorKeys = {
  all: ['sponsors'] as const,
  lists: () => [...sponsorKeys.all, 'list'] as const,
  detail: (id: number) => [...sponsorKeys.all, 'detail', id] as const,
}

export function useSponsors() {
  return useQuery({
    queryKey: sponsorKeys.lists(),
    queryFn: () =>
      fetchFromCMS<SponsorsResponse>('/sponsors?depth=1&limit=100&sort=name'),
    select: (data) => data.docs,
  })
}

export function useSponsorOfTheWeek() {
  const query = useSponsors()
  return {
    ...query,
    data:
      query.data?.find((s: Sponsor) => s.isSponsorOfTheWeek === true) ?? null,
  }
}
