import { useQuery } from '@tanstack/react-query'
import { fetchSponsors, Sponsor } from '@/lib/sponsors'

export function useSponsors() {
  const { data, status } = useQuery<Sponsor[], Error>({
    queryKey: ['sponsors'],
    queryFn: fetchSponsors,
  })

  return {
    sponsors: data ?? [],
    status,
  }
}
