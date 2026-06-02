import { useQuery } from '@tanstack/react-query'
import { getSupabase } from '@/lib/supabase'
import type { Event } from '@/types/events'

// Get all events, newest date first.
// The cover_image field is joined from the media table via cover_image_id.
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('events')
        .select('*, cover_image:media!cover_image_id(url, alt)')
        .order('date', { ascending: false })

      if (error) throw error
      return (data ?? []) as Event[]
    },
  })
}

// Only events marked as upcoming, soonest first
export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('events')
        .select('*, cover_image:media!cover_image_id(url, alt)')
        .eq('is_upcoming', true)
        .order('date', { ascending: true })

      if (error) throw error
      return (data ?? []) as Event[]
    },
  })
}

// Only past events, most recent first
export function usePastEvents() {
  return useQuery({
    queryKey: ['events', 'past'],
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('events')
        .select('*, cover_image:media!cover_image_id(url, alt)')
        .eq('is_upcoming', false)
        .order('date', { ascending: false })

      if (error) throw error
      return (data ?? []) as Event[]
    },
  })
}
