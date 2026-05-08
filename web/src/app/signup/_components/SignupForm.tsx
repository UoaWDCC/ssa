'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TOTAL_STEPS, initialFormData, type FormData } from './types'
import ProgressBar from '@/components/ProgressBar'
import ContactStep from './ContactStep'
import UniInfoStep from './UniInfoStep'
import AdditionalInfoStep from './AdditionalInfoStep'
import PaymentStep from '@/components/PaymentStep'

export default function SignupForm() {
  const searchParams = useSearchParams()
  const wasCancelled = searchParams.get('cancelled') === 'true'

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function validateStep(s: number): Record<string, string> {
    const errors: Record<string, string> = {}
    if (s === 1) {
      if (!formData.firstName.trim())
        errors.firstName = 'First name is required'
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
      if (
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        errors.email = 'Valid email is required'
      }
      if (!formData.phone.trim()) errors.phone = 'Phone number is required'
      if (
        formData.password.length < 8 ||
        !/[a-zA-Z]/.test(formData.password) ||
        !/[0-9]/.test(formData.password)
      )
        errors.password =
          'Password must be at least 8 characters and include a letter and a number'
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match'
    } else if (s === 2) {
      if (!formData.upi.trim()) errors.upi = 'UPI is required'
      if (!formData.studentId.trim())
        errors.studentId = 'Student ID is required'
      if (!formData.areaOfStudy.trim())
        errors.areaOfStudy = 'Area of study is required'
      if (!formData.yearOfUniversity)
        errors.yearOfUniversity = 'Year of university is required'
    } else if (s === 3) {
      if (!formData.gender) errors.gender = 'Gender is required'
      if (!formData.ethnicity) errors.ethnicity = 'Ethnicity is required'
      if (!formData.returningMember)
        errors.returningMember = 'This field is required'
    }
    return errors
  }

  function handleNext() {
    const errors = validateStep(step)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1)
  }

  const handlePay = async () => {
    setError(null)

    const step1Errors = validateStep(1)
    const step2Errors = validateStep(2)
    const step3Errors = validateStep(3)
    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors }
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      if (Object.keys(step1Errors).length > 0) {
        setStep(1)
      } else if (Object.keys(step2Errors).length > 0) {
        setStep(2)
      } else {
        setStep(3)
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          upi: formData.upi,
          studentId: formData.studentId,
          areaOfStudy: formData.areaOfStudy,
          yearOfUniversity: formData.yearOfUniversity,
          gender: formData.gender,
          ethnicity: formData.ethnicity,
          returningMember: formData.returningMember === 'yes',
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
          {wasCancelled && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-yellow-800 text-sm">
              Payment was cancelled. You can try again below.
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <ProgressBar step={step} total={TOTAL_STEPS} />

          {step === 1 && (
            <ContactStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}
          {step === 2 && (
            <UniInfoStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}
          {step === 3 && (
            <AdditionalInfoStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}
          {step === 4 && (
            <PaymentStep onPay={handlePay} isLoading={isLoading} />
          )}

          <div className="flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-2 rounded-full border border-ssa-black text-sm font-medium text-ssa-black bg-white hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < TOTAL_STEPS && (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-full bg-ssa-red text-sm font-medium text-white"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
