import { useQuery } from '@tanstack/react-query'
import { Exec, fetchExecs } from '@/lib/execs'

export function useExecs() {
  const { data, error, isPending } = useQuery<Exec[], Error>({
    queryKey: ['execs'],
    queryFn: fetchExecs,
  })

  return {
    execs: data ?? [],
    error,
    isPending,
  }
}
