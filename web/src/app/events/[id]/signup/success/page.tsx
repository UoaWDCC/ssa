import Link from 'next/link'
import FinalizeSubmission from '../components/FinalizeSubmission'
import { fetchPayloadForm } from '@/lib/payload-form'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ session_id?: string }>
}

export default async function EventSignupSuccessPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params
  const search = await searchParams
  const hasSession = Boolean(search.session_id)
  const form = await fetchPayloadForm(id)

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md text-center">
        <h1 className="font-averia font-bold text-3xl mb-3">
          You&apos;re Signed Up
        </h1>
        {hasSession ? (
          <p className="text-gray-600 mb-6">
            We received your signup and are confirming your payment details.
            Your membership will be activated once confirmation is complete.
            Check your email for updates.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            If you completed your payment, you will be added to the event
            attendees.
          </p>
        )}
        {hasSession && form && (
          <div className="mb-6 text-left">
            <FinalizeSubmission formId={form.id} />
          </div>
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
