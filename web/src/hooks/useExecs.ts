import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Exec } from '@/types/execs'

// Get all exec members, most recent year first
export function useExecs() {
  return useQuery({
    queryKey: ['execs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('execs')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error
      return (data ?? []) as Exec[]
    },
  })
}
