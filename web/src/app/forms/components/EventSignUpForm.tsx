'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import GoogleFormStep from './GoogleFormStep'
import EventPaymentStep from './EventPaymentStep'

const EventSignupForm = () => {
  const searchParams = useSearchParams()
  const hasSession = Boolean(searchParams.get('session_id'))

  const step = hasSession ? 1 : 0
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    setError(null)

    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'First Last',
          email: 'example@email.com',
          password: '123456',
          phone: '1234567890',
          upi: 'upi@example.com',
          studentId: 'STUDENT123',
          areaOfStudy: 'Computer Science',
          yearOfUniversity: '4',
          gender: 'male',
          ethnicity: 'chinese',
          returningMember: true,
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

          {step === 0 && (
            <EventPaymentStep
              onPay={handlePay}
              eventCost={6}
              isLoading={isLoading}
            />
          )}
          {step === 1 && <GoogleFormStep />}
        </div>
      </div>
    </div>
  )
}

export default EventSignupForm
