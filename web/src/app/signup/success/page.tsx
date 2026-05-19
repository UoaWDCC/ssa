import Link from 'next/link'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

type ConfirmationResult = 'confirmed' | 'pending' | 'unavailable' | 'missing'

async function confirmCheckoutSession(
  sessionId?: string,
): Promise<ConfirmationResult> {
  if (!sessionId) return 'missing'

  const cmsUrl = process.env.CMS_URL
  if (!cmsUrl) return 'unavailable'

  try {
    const response = await fetch(
      `${cmsUrl}/stripe/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`,
      { cache: 'no-store' },
    )

    if (!response.ok) return 'unavailable'

    const result = (await response.json()) as {
      confirmed?: boolean
    }

    return result.confirmed ? 'confirmed' : 'pending'
  } catch {
    return 'unavailable'
  }
}

export default async function SignupSuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const confirmation = await confirmCheckoutSession(params.session_id)

  const messageByConfirmation: Record<ConfirmationResult, string> = {
    confirmed:
      'Your payment has been confirmed and your SSA membership is now active.',
    pending:
      'We received your signup and are confirming your payment details. Your membership will be activated once confirmation is complete.',
    unavailable:
      'Your payment was completed, but we could not confirm it automatically. Please check your email for updates.',
    missing:
      'If you completed your payment, your membership will be activated shortly.',
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <h1 className="font-averia font-bold text-3xl mb-3">Welcome to SSA!</h1>
        <p className="text-gray-600 mb-6">
          {messageByConfirmation[confirmation]}
        </p>
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
