'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TOTAL_STEPS, initialFormData, type FormData } from './types'
import ProgressBar from '@/components/ProgressBar'
import AccountSignUpStep from './AccountSignUpStep'
import ContactStep from './ContactStep'
import UniInfoStep from './UniInfoStep'
import AdditionalInfoStep from './AdditionalInfoStep'
import PaymentStep from '@/components/PaymentStep'
import Button from '@/components/Button'
import CardSection from '@/components/CardSection'

export default function SignupForm() {
  const searchParams = useSearchParams()
  const wasCancelled = searchParams.get('cancelled') === 'true'
  const googleStatus = searchParams.get('google')
  const googleConnectionError =
    googleStatus && googleStatus !== 'connected'
      ? 'Google sign up could not be completed. Please try again.'
      : null

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!googleStatus) return

    if (googleStatus !== 'connected') return

    let isActive = true

    async function loadGoogleProfile() {
      try {
        const response = await fetch('/api/auth/google/session')
        const result = (await response.json()) as {
          profile?: {
            email?: string
            firstName?: string
            googleSub?: string
            lastName?: string
          }
        }

        if (!isActive) return

        if (
          !response.ok ||
          !result.profile?.email ||
          !result.profile.googleSub
        ) {
          setError(
            'Google sign up session expired. Please connect Google again.',
          )
          return
        }

        setFormData((prev) => ({
          ...prev,
          authProvider: 'google',
          email: result.profile?.email ?? '',
          firstName: prev.firstName || result.profile?.firstName || '',
          googleSub: result.profile?.googleSub ?? '',
          lastName: prev.lastName || result.profile?.lastName || '',
          password: '',
          confirmPassword: '',
        }))
        setFieldErrors((prev) => {
          const next = { ...prev }
          delete next.email
          delete next.password
          delete next.confirmPassword
          return next
        })
        setError(null)
      } catch {
        if (isActive) {
          setError('Google sign up could not be loaded. Please try again.')
        }
      }
    }

    loadGoogleProfile()

    return () => {
      isActive = false
    }
  }, [googleStatus])

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
      if (
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        errors.email = 'Valid email is required'
      }
      if (formData.authProvider === 'google') {
        if (!formData.googleSub) {
          errors.email = 'Please connect your Google account again'
        }
      } else {
        if (
          formData.password.length < 8 ||
          !/[a-zA-Z]/.test(formData.password) ||
          !/[0-9]/.test(formData.password)
        )
          errors.password =
            'Password must be at least 8 characters and include a letter and a number'
        if (formData.password !== formData.confirmPassword)
          errors.confirmPassword = 'Passwords do not match'
      }
    } else if (s === 2) {
      if (!formData.firstName.trim())
        errors.firstName = 'First name is required'
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
      if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    } else if (s === 3) {
      if (!formData.upi.trim()) errors.upi = 'UPI is required'
      if (!formData.studentId.trim())
        errors.studentId = 'Student ID is required'
      if (!formData.areaOfStudy.trim())
        errors.areaOfStudy = 'Area of study is required'
      if (!formData.yearOfUniversity)
        errors.yearOfUniversity = 'Year of university is required'
    } else if (s === 4) {
      if (!formData.gender) errors.gender = 'Gender is required'
      if (!formData.ethnicity) errors.ethnicity = 'Ethnicity is required'
      if (!formData.returningMember)
        errors.returningMember = 'This field is required'
    }
    return errors
  }

  async function checkEmailAvailability() {
    setIsCheckingEmail(true)
    try {
      const response = await fetch('/api/signup/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })
      const result = (await response.json()) as {
        available?: boolean
        error?: string
      }

      if (!response.ok || result.available === false) {
        const message = result.error ?? 'This email is already registered'
        setFieldErrors((prev) => ({ ...prev, email: message }))
        return false
      }

      return true
    } catch {
      setError('Could not check this email. Please try again.')
      return false
    } finally {
      setIsCheckingEmail(false)
    }
  }

  async function handleNext() {
    const errors = validateStep(step)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    if (step === 1) {
      setError(null)
      const isEmailAvailable = await checkEmailAvailability()
      if (!isEmailAvailable) return
    }

    setFieldErrors({})
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1)
  }

  function handleGoogleAuth() {
    window.location.href = '/api/auth/google'
  }

  function handleUseEmailAuth() {
    fetch('/api/auth/google/session', { method: 'DELETE' }).catch(() => {})
    setFormData((prev) => ({
      ...prev,
      authProvider: 'email',
      googleSub: '',
    }))
  }

  const handlePay = async () => {
    setError(null)

    const step1Errors = validateStep(1)
    const step2Errors = validateStep(2)
    const step3Errors = validateStep(3)
    const step4Errors = validateStep(4)
    const allErrors = {
      ...step1Errors,
      ...step2Errors,
      ...step3Errors,
      ...step4Errors,
    }
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      if (Object.keys(step1Errors).length > 0) {
        setStep(1)
      } else if (Object.keys(step2Errors).length > 0) {
        setStep(2)
      } else if (Object.keys(step3Errors).length > 0) {
        setStep(3)
      } else {
        setStep(4)
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          authProvider: formData.authProvider,
          email: formData.email,
          googleSub: formData.googleSub,
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
        const message =
          result.error ?? 'Something went wrong. Please try again.'
        setError(message)
        if (response.status === 409) {
          setFieldErrors((prev) => ({ ...prev, email: message }))
          setStep(1)
        }
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
    <div className="w-full px-4 md:px-8 lg:px-12">
      {wasCancelled && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-yellow-800 text-sm">
          Payment was cancelled. You can try again below.
        </div>
      )}

      {(error || googleConnectionError) && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
          {error || googleConnectionError}
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto mt-10">
        <div className="mb-12">
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        <CardSection>
          {step === 1 && (
            <AccountSignUpStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
              onGoogleAuth={handleGoogleAuth}
              onUseEmailAuth={handleUseEmailAuth}
            />
          )}

          {step === 2 && (
            <ContactStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}

          {step === 3 && (
            <UniInfoStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}

          {step === 4 && (
            <AdditionalInfoStep
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}

          {step === 5 && (
            <PaymentStep onPay={handlePay} isLoading={isLoading} />
          )}

          {/* Inside the card */}
          <div className="flex items-center justify-between pt-4">
            {step > 1 ? (
              <Button
                onClick={handleBack}
                size="short"
                variant="outline"
                color="red"
                arrow={false}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS && (
              <Button
                onClick={handleNext}
                disabled={isCheckingEmail}
                size="short"
                variant="filled"
                color="red"
              >
                {isCheckingEmail ? 'Checking...' : 'Next'}
              </Button>
            )}
          </div>
        </CardSection>
      </div>
    </div>
  )
}
