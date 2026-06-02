import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Sponsor } from '@/types/sponsors'

// Get all sponsors, sorted alphabetically by name
export function useSponsors() {
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return (data ?? []) as Sponsor[]
    },
  })
}

// Get the single sponsor currently marked as sponsor of the week
export function useSponsorOfTheWeek() {
  return useQuery({
    queryKey: ['sponsors', 'of-the-week'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_sponsor_of_the_week', true)
        .limit(1)
        .single()

      // .single() returns an error if no row is found — treat that as null
      if (error?.code === 'PGRST116') return null
      if (error) throw error
      return data as Sponsor
    },
  })
}
