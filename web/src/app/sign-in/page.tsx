'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import CardSection from '@/components/CardSection'
import InputField from '@/components/InputField'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implement email/password sign-in
  }

  return (
    <main className="min-h-screen bg-ssa-yellow-light flex items-center justify-center px-4 pt-[88px]">
      <div className="w-full max-w-md">
        <CardSection title="Sign In">
          <button
            type="button"
            onClick={() => (window.location.href = '/api/auth/google')}
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

            <button
              type="submit"
              className="w-full rounded-full bg-ssa-red py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ssa-red focus:ring-offset-2"
            >
              Sign In
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
    </main>
  )
}
