'use client'

import { useEffect, useState } from 'react'
import type { SessionUser } from '@/lib/session'

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: SessionUser }
  | { status: 'unauthenticated' }

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          setState({ status: 'unauthenticated' })
          return
        }
        return res
          .json()
          .then(({ user }) => setState({ status: 'authenticated', user }))
      })
      .catch(() => setState({ status: 'unauthenticated' }))
  }, [])

  return state
}
