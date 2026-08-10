import type { FormData } from './types'
import InputField from '@/components/InputField'
import { FcGoogle } from 'react-icons/fc'

export default function AccountSignUpStep({
  data,
  onChange,
  fieldErrors,
  onGoogleAuth,
  onUseEmailAuth,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
  onGoogleAuth: () => void
  onUseEmailAuth: () => void
}) {
  const isGoogleSignup = data.authProvider === 'google'

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onGoogleAuth}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-ssa-black transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ssa-red focus:ring-offset-2"
      >
        <FcGoogle className="h-5 w-5" aria-hidden="true" />
        {isGoogleSignup
          ? 'Use a different Google account'
          : 'Continue with Google'}
      </button>

      {isGoogleSignup && (
        <div className="rounded-lg border bg-green-50 px-3 py-2 text-sm text-green-800">
          Google account connected for {data.email}.
        </div>
      )}

      {!isGoogleSignup && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ssa-red/40" />
          <span className="text-xs font-medium uppercase tracking-wide text-ssa-black/60">
            or
          </span>
          <div className="h-px flex-1 bg-ssa-red/40" />
        </div>
      )}

      <InputField
        label="Email Address"
        required
        name="email"
        autoComplete="email"
        placeholder="hello@gmail.com"
        type="email"
        value={data.email}
        onChange={(v) => onChange('email', v)}
        error={fieldErrors.email}
        readOnly={isGoogleSignup}
      />
      {!isGoogleSignup && (
        <>
          <InputField
            label="Password"
            required
            name="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters, include a letter and number"
            type="password"
            value={data.password}
            onChange={(v) => onChange('password', v)}
            error={fieldErrors.password}
          />
          <InputField
            label="Confirm Password"
            required
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter password"
            type="password"
            value={data.confirmPassword}
            onChange={(v) => onChange('confirmPassword', v)}
            error={fieldErrors.confirmPassword}
          />
        </>
      )}

      {isGoogleSignup && (
        <button
          type="button"
          onClick={onUseEmailAuth}
          className="self-start text-sm font-medium text-ssa-red underline-offset-4 hover:underline"
        >
          Use email and password instead
        </button>
      )}
    </div>
  )
}
