import { useQuery } from '@tanstack/react-query'
import { fetchFromCMS } from '@/lib/api'
import type { ExecsResponse } from '@/types/execs'

export const execKeys = {
  all: ['execs'] as const,
  lists: () => [...execKeys.all, 'list'] as const,
  detail: (id: number) => [...execKeys.all, 'detail', id] as const,
}

export function useExecs() {
  return useQuery({
    queryKey: execKeys.lists(),
    queryFn: () =>
      fetchFromCMS<ExecsResponse>('/execs?depth=1&limit=100&sort=-year'),
    select: (data) => data.docs,
  })
}
