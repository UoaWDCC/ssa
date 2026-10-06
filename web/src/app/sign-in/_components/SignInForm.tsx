'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import Button from '@/components/Button'
import InputField from '@/components/InputField'

type SignInFormProps = Readonly<{
  isNewAccount: boolean
  googleError?: string
}>

export default function SignInForm({
  isNewAccount,
  googleError,
}: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
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
    <section className="flex w-full max-w-[756px] flex-col rounded-2xl bg-ssa-yellow-light px-6 py-8 shadow-md sm:px-9 lg:min-h-[537px]">
      <h1 className="font-be-vietnam-pro text-2xl font-bold leading-7 tracking-[-1px] text-ssa-muted-taupe">
        Sign In
      </h1>

      <div className="mt-6 flex flex-col items-center">
        {(isNewAccount || googleError) && (
          <p
            role={googleError ? 'alert' : 'status'}
            className={`mb-3 w-full max-w-[644px] rounded-lg border px-4 py-2 font-inter text-sm ${
              googleError
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-green-200 bg-green-50 text-green-800'
            }`}
          >
            {googleError ??
              'Your account is ready! Sign in to view your profile.'}
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            (globalThis.location.href = '/api/auth/google?mode=signin')
          }
          className="flex h-11 w-full max-w-[644px] items-center justify-center gap-3 rounded-lg border-[1px] border-ssa-grey/20 bg-white font-inter text-base font-normal text-ssa-grey transition-colors hover:bg-ssa-background focus:outline-none focus:ring-2 focus:ring-ssa-red focus:ring-offset-2"
        >
          <FcGoogle className="size-5" aria-hidden="true" />
          Continue with Google
        </button>

        <p className="mt-6 font-inter text-base font-normal leading-6 text-ssa-muted-grey">
          Or
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <InputField
          label="Email Address"
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="hello@gmail.com"
          value={email}
          onChange={setEmail}
          variant="sign-in"
        />
        <InputField
          label="Password"
          required
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
          error={error || undefined}
          variant="sign-in"
        />

        <Button
          type="submit"
          disabled={loading}
          size="long"
          variant="filled"
          color="pink"
          arrow={false}
        >
          {loading ? 'Signing in…' : 'SIGN IN'}
        </Button>
      </form>

      <p className="mx-auto mt-6 flex h-6 items-center justify-center font-inter text-base font-normal leading-6">
        <span className="text-ssa-muted-grey">Don&apos;t have an account?</span>
        <span aria-hidden="true">&nbsp;</span>
        <Link
          href="/signup"
          className="text-ssa-grey transition-colors hover:text-ssa-salmon focus-visible:text-ssa-salmon focus-visible:outline-none"
        >
          Sign up
        </Link>
      </p>
    </section>
  )
}
