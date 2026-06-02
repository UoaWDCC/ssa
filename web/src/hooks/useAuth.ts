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
    let isActive = true
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          if (isActive) setState({ status: 'unauthenticated' })
          return
        }
        return res.json().then(({ user }) => {
          if (isActive) setState({ status: 'authenticated', user })
        })
      })
      .catch(() => {
        if (isActive) setState({ status: 'unauthenticated' })
      })
    return () => {
      isActive = false
    }
  }, [])

  return state
}
