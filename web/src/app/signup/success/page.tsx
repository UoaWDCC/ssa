import Link from 'next/link'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SignupSuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const hasSession = Boolean(params.session_id)

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <h1 className="font-averia font-bold text-3xl mb-3">Welcome to SSA!</h1>
        {hasSession ? (
          <p className="text-gray-600 mb-6">
            We received your signup and are confirming your payment details.
            Your membership will be activated once confirmation is complete.
            Check your email for updates.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            If you completed your payment, your membership will be activated
            shortly.
          </p>
        )}
        <Link
          href="/"
          className="inline-block rounded-lg bg-ssa-red px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Go to Homepage
        </Link>
      </div>
    </main>
  )
}
