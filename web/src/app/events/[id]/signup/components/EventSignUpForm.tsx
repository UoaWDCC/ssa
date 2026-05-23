'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import EventPaymentStep from './EventPaymentStep'
import PayloadFormStep from './PayloadFormStep'
import type { PayloadForm } from '@/lib/payload-form'
import { PayloadEvent } from '@/lib/events'

type EventSignupFormProps = {
  form: PayloadForm | null
  event: PayloadEvent | null
}

type SubmissionDataEntry = {
  field: string
  value: unknown
}

const EventSignupForm = ({ form, event }: EventSignupFormProps) => {
  const searchParams = useSearchParams()
  const hasSession = Boolean(searchParams.get('session_id'))

  const [step, setStep] = useState(hasSession ? 1 : 0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handlePendingSubmission(submissionData: SubmissionDataEntry[]) {
    if (!form) {
      setError('The signup form is not configured in Payload CMS yet.')
      return
    }

    window.sessionStorage.setItem(
      `event-signup-submission:${form.id}`,
      JSON.stringify(submissionData),
    )
    setStep(1)
  }

  const handlePay = async () => {
    setError(null)

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event?.id,
          customerId: 'cus_UYuqhW1J65hvuZ',
          priceId: event?.stripePriceId,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.checkoutUrl) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      window.location.href = result.checkoutUrl
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-ssa-yellow-light min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl flex flex-col gap-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <ProgressBar step={step} total={2} />
          {step === 0 && form ? (
            <PayloadFormStep
              form={form}
              onSubmitPending={handlePendingSubmission}
            />
          ) : (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
              The signup form is not configured in Payload CMS yet.
            </div>
          )}

          {step === 1 && (
            <EventPaymentStep
              onPay={handlePay}
              eventCost={event?.eventCost}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EventSignupForm
