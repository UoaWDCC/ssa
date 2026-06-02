import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types/events'

// Get all events, newest date first
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      return (data ?? []) as Event[]
    },
  })
}

// Only events marked as upcoming
export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_upcoming', true)
        .order('date', { ascending: true })

      if (error) throw error
      return (data ?? []) as Event[]
    },
  })
}

// Only past events
export function usePastEvents() {
  return useQuery({
    queryKey: ['events', 'past'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_upcoming', false)
        .order('date', { ascending: false })

      if (error) throw error
      return (data ?? []) as Event[]
    },
  })
}
