'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import Button from '@/components/Button'

type SignInFormProps = Readonly<{
  isNewAccount: boolean
  googleError?: string
}>

type FieldProps = Readonly<{
  label: string
  name: 'email' | 'password'
  type: 'email' | 'password'
  autoComplete: 'email' | 'current-password'
  placeholder: string
  value: string
  onChange: (value: string) => void
}>

function SignInField({
  label,
  name,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-inter text-base font-normal leading-6 text-ssa-grey"
      >
        {label}
        <span className="text-ssa-red">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-11 w-full rounded-full border-[0.8px] border-ssa-grey/30 bg-ssa-background px-5 font-inter text-base font-normal text-ssa-grey outline-none transition-colors placeholder:text-ssa-muted-grey/50 focus:border-ssa-red focus:ring-1 focus:ring-ssa-red"
      />
    </div>
  )
}

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
    <section className="flex w-full max-w-[756px] flex-col rounded-2xl bg-ssa-yellow-light px-6 py-8 shadow-md sm:px-9 lg:h-[537px]">
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
        <SignInField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="hello@gmail.com"
          value={email}
          onChange={setEmail}
        />
        <SignInField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
        />

        {error && (
          <p role="alert" className="font-inter text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          size="long"
          variant="filled"
          color="red"
          arrow={false}
          className="h-11 !bg-ssa-salmon !py-0 hover:!bg-ssa-red hover:!text-ssa-white"
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
