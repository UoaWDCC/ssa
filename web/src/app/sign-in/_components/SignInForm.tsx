'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import CardSection from '@/components/CardSection'
import InputField from '@/components/InputField'

export default function SignInForm({
  isNewAccount,
  googleError,
}: Readonly<{
  isNewAccount: boolean
  googleError?: string
}>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? 'Invalid email or password')
        return
      }

      globalThis.location.href = '/'
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {isNewAccount && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Your account is ready! Sign in to view your profile.
        </div>
      )}
      {googleError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {googleError}
        </div>
      )}

      <CardSection title="Sign In">
        <button
          type="button"
          onClick={() =>
            (globalThis.location.href = '/api/auth/google?mode=signin')
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-ssa-black transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ssa-red focus:ring-offset-2"
        >
          <FcGoogle className="h-5 w-5" aria-hidden="true" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ssa-red/40" />
          <span className="text-xs font-medium uppercase tracking-wide text-ssa-black/60">
            or
          </span>
          <div className="h-px flex-1 bg-ssa-red/40" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Email Address"
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="hello@gmail.com"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="Password"
            required
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ssa-red py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ssa-red focus:ring-offset-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-ssa-black/60">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-ssa-black underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardSection>
    </div>
  )
}
