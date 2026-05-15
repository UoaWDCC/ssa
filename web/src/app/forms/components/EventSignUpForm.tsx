'use client'
import { useState } from 'react'
import ProgressBar from '@/components/ProgressBar'
// import GoogleFormStep from './GoogleFormStep'
import EventPaymentStep from './EventPaymentStep'

export default function SignupForm() {
  const step = 0
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handlePay() {
    setIsLoading(true)
    setError(null)
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

          {step === 0 && (
            <EventPaymentStep
              onPay={handlePay}
              eventCost={6}
              isLoading={isLoading}
            />
          )}
          {/* {step === 1 && (
            <GoogleFormStep />
          )} */}
        </div>
      </div>
    </div>
  )
}
