import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Exec } from '@/types/execs'

// Get all exec members, most recent year first.
// The photo field is joined from the media table using the photo_id foreign key.
export function useExecs() {
  return useQuery({
    queryKey: ['execs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('execs')
        .select('*, photo:media!photo_id(url, alt)')
        .order('year', { ascending: false })

      if (error) throw error
      return (data ?? []) as Exec[]
    },
  })
}
