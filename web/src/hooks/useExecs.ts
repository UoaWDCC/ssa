import { useQuery } from '@tanstack/react-query'
import { Exec, fetchExecs } from '@/lib/execs'

export function useExecs() {
  const { data, error } = useQuery<Exec[], Error>({
    queryKey: ['execs'],
    queryFn: fetchExecs,
  })

  return {
    execs: data ?? [],
    error,
  }
}
