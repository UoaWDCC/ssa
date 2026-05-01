'use client'

import { useState, useId, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const TOTAL_STEPS = 4

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  upi: string
  studentId: string
  areaOfStudy: string
  yearOfUniversity: string
  gender: string
  ethnicity: string
  returningMember: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  upi: '',
  studentId: '',
  areaOfStudy: '',
  yearOfUniversity: '',
  gender: '',
  ethnicity: '',
  returningMember: '',
}

function ProgressBar({ step }: { step: number }) {
  const progress = (step / TOTAL_STEPS) * 100
  return (
    <div
      className="w-full h-3 rounded-full overflow-hidden"
      style={{ backgroundColor: '#ffb3bf' }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${progress}%`, backgroundColor: '#f85b76' }}
      />
    </div>
  )
}

function InputField({
  label,
  required,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  error?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ssa-black">
        {label}
        {required && <span className="text-ssa-red ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        className="w-full rounded-lg px-3 py-2 text-sm text-gray-900 outline-none border border-transparent focus:border-ssa-red bg-white placeholder:text-gray-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  required,
  placeholder,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ssa-black">
        {label}
        {required && <span className="text-ssa-red ml-0.5">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-ssa-red bg-white appearance-none"
        style={{ color: value ? '#0a0805' : '#9ca3af' }}
      >
        <option value="" disabled hidden>
          {placeholder ?? 'DROP DOWN'}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function CardSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: '#ffe6b6' }}
    >
      <div>
        <h2 className="font-[family-name:var(--font-averia)] font-bold text-xl text-ssa-black">
          {title}
        </h2>
        <hr className="mt-2 border-ssa-red" />
      </div>
      {children}
    </div>
  )
}

function Step1({
  data,
  onChange,
  fieldErrors,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <CardSection title="Contact Information">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="First Name"
          required
          placeholder="Enter Name here"
          value={data.firstName}
          onChange={(v) => onChange('firstName', v)}
          error={fieldErrors.firstName}
        />
        <InputField
          label="Last Name"
          required
          placeholder="Enter Last Name here"
          value={data.lastName}
          onChange={(v) => onChange('lastName', v)}
          error={fieldErrors.lastName}
        />
      </div>
      <InputField
        label="Email Address"
        required
        placeholder="hello@gmail.com"
        type="email"
        value={data.email}
        onChange={(v) => onChange('email', v)}
        error={fieldErrors.email}
      />
      <InputField
        label="Phone Number"
        required
        placeholder="+64 21 000 0000"
        type="tel"
        value={data.phone}
        onChange={(v) => onChange('phone', v)}
        error={fieldErrors.phone}
      />
      <InputField
        label="Password"
        required
        placeholder="Min. 8 characters"
        type="password"
        value={data.password}
        onChange={(v) => onChange('password', v)}
        error={fieldErrors.password}
      />
      <InputField
        label="Confirm Password"
        required
        placeholder="Re-enter password"
        type="password"
        value={data.confirmPassword}
        onChange={(v) => onChange('confirmPassword', v)}
        error={fieldErrors.confirmPassword}
      />
    </CardSection>
  )
}

function Step2({
  data,
  onChange,
  fieldErrors,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <CardSection title="University Information">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="UPI"
          required
          placeholder="abcd123"
          value={data.upi}
          onChange={(v) => onChange('upi', v)}
          error={fieldErrors.upi}
        />
        <InputField
          label="Student ID"
          required
          placeholder="00000000"
          value={data.studentId}
          onChange={(v) => onChange('studentId', v)}
          error={fieldErrors.studentId}
        />
      </div>
      <InputField
        label="What is your Area of Study"
        required
        placeholder="Enter Degree(s) here"
        value={data.areaOfStudy}
        onChange={(v) => onChange('areaOfStudy', v)}
        error={fieldErrors.areaOfStudy}
      />
      <SelectField
        label="What Year of University are you in?"
        required
        value={data.yearOfUniversity}
        onChange={(v) => onChange('yearOfUniversity', v)}
        error={fieldErrors.yearOfUniversity}
        options={[
          { value: '1', label: 'Year 1' },
          { value: '2', label: 'Year 2' },
          { value: '3', label: 'Year 3' },
          { value: '4', label: 'Year 4' },
          { value: '5+', label: 'Year 5+' },
          { value: 'postgrad', label: 'Postgraduate' },
        ]}
      />
    </CardSection>
  )
}

function Step3({
  data,
  onChange,
  fieldErrors,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <CardSection title="Additional Information">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Gender"
          required
          value={data.gender}
          onChange={(v) => onChange('gender', v)}
          error={fieldErrors.gender}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'non-binary', label: 'Non-binary' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ]}
        />
        <SelectField
          label="Ethnicity"
          required
          value={data.ethnicity}
          onChange={(v) => onChange('ethnicity', v)}
          error={fieldErrors.ethnicity}
          options={[
            { value: 'chinese', label: 'Chinese' },
            { value: 'malay', label: 'Malay' },
            { value: 'indian', label: 'Indian' },
            { value: 'eurasian', label: 'Eurasian' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>
      <SelectField
        label="Are you a returning SSA Member?"
        required
        value={data.returningMember}
        onChange={(v) => onChange('returningMember', v)}
        error={fieldErrors.returningMember}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />
    </CardSection>
  )
}

function Step4({
  onPay,
  isLoading,
}: {
  onPay: () => void
  isLoading: boolean
}) {
  return (
    <CardSection title="Payment">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ssa-black">
          $6 is required to be a SSA member, the fee includes:
        </p>
        <ul className="list-disc list-inside text-sm text-ssa-black space-y-1 ml-1">
          <li>
            Goodies and discounts from SSA sponsors when you show them your
            membership sticker
          </li>
          <li>Please be sure to collect your MEMBERSHIP CARD from the team.</li>
        </ul>
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={onPay}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
            style={{ backgroundColor: '#635bff' }}
          >
            {isLoading ? 'Processing...' : 'Pay'}
          </button>
          <button className="mx-auto text-xs border rounded-md px-3 py-1.5 text-gray-500 border-gray-300 hover:bg-gray-50">
            Powered by Stripe
          </button>
        </div>
      </div>
    </CardSection>
  )
}

function SignupForm() {
  const searchParams = useSearchParams()
  const wasCancelled = searchParams.get('cancelled') === 'true'

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function validateStep(s: number): Record<string, string> {
    const errors: Record<string, string> = {}
    if (s === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required'
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
      if (
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        errors.email = 'Valid email is required'
      }
      if (!formData.phone.trim()) errors.phone = 'Phone number is required'
      if (formData.password.length < 8)
        errors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match'
    } else if (s === 2) {
      if (!formData.upi.trim()) errors.upi = 'UPI is required'
      if (!formData.studentId.trim()) errors.studentId = 'Student ID is required'
      if (!formData.areaOfStudy.trim()) errors.areaOfStudy = 'Area of study is required'
      if (!formData.yearOfUniversity) errors.yearOfUniversity = 'Year of university is required'
    } else if (s === 3) {
      if (!formData.gender) errors.gender = 'Gender is required'
      if (!formData.ethnicity) errors.ethnicity = 'Ethnicity is required'
      if (!formData.returningMember) errors.returningMember = 'This field is required'
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

    const allErrors = {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
    }
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      setStep(1)
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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#fff7e9' }}
    >
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

          <ProgressBar step={step} />

          {step === 1 && (
            <Step1
              data={formData}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
          )}
          {step === 2 && <Step2 data={formData} onChange={handleChange} fieldErrors={fieldErrors} />}
          {step === 3 && <Step3 data={formData} onChange={handleChange} fieldErrors={fieldErrors} />}
          {step === 4 && <Step4 onPay={handlePay} isLoading={isLoading} />}

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
                className="px-6 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: '#f85b76' }}
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
