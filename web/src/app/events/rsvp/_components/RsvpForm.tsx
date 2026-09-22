'use client'

import {
  type FormEvent,
  type HTMLInputTypeAttribute,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi'

import ProgressBar from '@/components/ProgressBar'

const TOTAL_STEPS = 3

type Step = 1 | 2 | 3

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  emergencyName: string
  emergencyPhone: string
  relationship: string
  gender: string
  dietaryRequirements: string
  universityYear: string
}

type FieldName = keyof FormValues
type FieldErrors = Partial<Record<FieldName, string>>

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  emergencyName: '',
  emergencyPhone: '',
  relationship: '',
  gender: '',
  dietaryRequirements: '',
  universityYear: '',
}

const stepDetails: Record<Step, { label: string }> = {
  1: { label: 'Contact information' },
  2: { label: 'Emergency contact information' },
  3: { label: 'Attendee details' },
}

const stepFields: Record<Step, FieldName[]> = {
  1: ['firstName', 'lastName', 'email', 'phone'],
  2: ['emergencyName', 'emergencyPhone', 'relationship'],
  3: ['gender', 'dietaryRequirements', 'universityYear'],
}

const fieldLabels: Record<FieldName, string> = {
  firstName: 'first name',
  lastName: 'last name',
  email: 'email address',
  phone: 'phone number',
  emergencyName: 'emergency contact name',
  emergencyPhone: 'emergency contact phone number',
  relationship: 'relationship',
  gender: 'gender',
  dietaryRequirements: 'dietary requirements',
  universityYear: 'university year',
}

function fieldId(name: FieldName) {
  return `rsvp-${name}`
}

function validateField(name: FieldName, rawValue: string) {
  const value = rawValue.trim()

  if (!value) return `Please enter your ${fieldLabels[name]}.`

  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Enter an email address in the format name@example.com.'
  }

  if (
    (name === 'phone' || name === 'emergencyPhone') &&
    !/^\+?[\d\s().-]+$/.test(value)
  ) {
    return 'Use only numbers, spaces, brackets, a leading +, or hyphens.'
  }

  if (
    (name === 'phone' || name === 'emergencyPhone') &&
    value.replace(/\D/g, '').length < 7
  ) {
    return 'Enter a phone number with at least 7 digits.'
  }

  return undefined
}

function getStepErrors(step: Step, values: FormValues) {
  return stepFields[step].reduce<FieldErrors>((nextErrors, field) => {
    const message = validateField(field, values[field])
    if (message) nextErrors[field] = message
    return nextErrors
  }, {})
}

type FieldProps = {
  name: FieldName
  label: string
  value: string
  placeholder: string
  error?: string
  onChange: (name: FieldName, value: string) => void
  onBlur: (name: FieldName) => void
  type?: HTMLInputTypeAttribute
  inputMode?: 'email' | 'tel' | 'text'
  autoComplete?: string
  maxLength?: number
}

function Field({
  name,
  label,
  value,
  placeholder,
  error,
  onChange,
  onBlur,
  type = 'text',
  inputMode,
  autoComplete,
  maxLength,
}: FieldProps) {
  const id = fieldId(name)
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-inter text-sm font-medium leading-5 text-ssa-grey"
      >
        {label}
        <span aria-hidden="true" className="ml-0.5 text-ssa-form-accent">
          *
        </span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        autoCapitalize={type === 'email' ? 'none' : undefined}
        spellCheck={type === 'email' ? false : undefined}
        value={value}
        placeholder={placeholder}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(name, event.target.value)}
        onBlur={() => onBlur(name)}
        className={`h-12 w-full rounded-full border bg-ssa-form-field px-4 font-inter text-base text-ssa-grey shadow-[inset_0_1px_0_#ffffff] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[#6f6961] hover:border-[#6f6961] focus-visible:border-ssa-form-accent focus-visible:ring-2 focus-visible:ring-ssa-form-accent/25 ${
          error ? 'border-[#b4233d] bg-[#fffafa]' : 'border-ssa-form-border'
        }`}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-inter text-sm leading-5 text-[#a51d37]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

type SelectFieldProps = {
  name: FieldName
  label: string
  value: string
  placeholder: string
  options: { value: string; label: string }[]
  error?: string
  onChange: (name: FieldName, value: string) => void
  onBlur: (name: FieldName) => void
}

function SelectField({
  name,
  label,
  value,
  placeholder,
  options,
  error,
  onChange,
  onBlur,
}: SelectFieldProps) {
  const id = fieldId(name)
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-inter text-sm font-medium leading-5 text-ssa-grey"
      >
        {label}
        <span aria-hidden="true" className="ml-0.5 text-ssa-form-accent">
          *
        </span>
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(name, event.target.value)}
          onBlur={() => onBlur(name)}
          className={`h-12 w-full appearance-none rounded-full border bg-ssa-form-field px-4 pr-12 font-inter text-base shadow-[inset_0_1px_0_#ffffff] outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#aaa398] focus-visible:border-ssa-form-accent focus-visible:ring-2 focus-visible:ring-ssa-form-accent/25 ${
            value ? 'text-ssa-grey' : 'text-[#6f6961]'
          } ${
            error ? 'border-[#b4233d] bg-[#fffafa]' : 'border-ssa-form-border'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#716b63]"
        />
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-inter text-sm leading-5 text-[#a51d37]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default function RsvpForm({ eventId }: Readonly<{ eventId?: number }>) {
  const [step, setStep] = useState<Step>(1)
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef<Step>(step)

  useEffect(() => {
    if (previousStep.current === step) return
    stepHeadingRef.current?.focus()
    previousStep.current = step
  }, [step])

  function handleChange(name: FieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setSubmitError(null)
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  function handleBlur(name: FieldName) {
    const message = validateField(name, values[name])
    setErrors((current) => {
      const nextErrors = { ...current }
      if (message) nextErrors[name] = message
      else delete nextErrors[name]
      return nextErrors
    })
  }

  function focusFirstError(nextErrors: FieldErrors) {
    const firstInvalidField = stepFields[step].find(
      (field) => nextErrors[field],
    )
    if (!firstInvalidField) return

    requestAnimationFrame(() => {
      document.getElementById(fieldId(firstInvalidField))?.focus()
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const normalizedValues = { ...values }
    for (const field of stepFields[step]) {
      normalizedValues[field] = values[field].trim()
    }
    const nextErrors = getStepErrors(step, normalizedValues)

    setValues(normalizedValues)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      focusFirstError(nextErrors)
      return
    }

    setErrors({})
    setSubmitError(null)
    if (step < TOTAL_STEPS) {
      setStep((step + 1) as Step)
      return
    }

    if (!eventId) {
      setSubmitError('The event is still loading. Please try again shortly.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventId,
          firstName: normalizedValues.firstName,
          lastName: normalizedValues.lastName,
          email: normalizedValues.email,
          phone: normalizedValues.phone,
          emergencyContactName: normalizedValues.emergencyName,
          emergencyContactPhone: normalizedValues.emergencyPhone,
          emergencyContactRelationship: normalizedValues.relationship,
          gender: normalizedValues.gender,
          dietaryRequirements: normalizedValues.dietaryRequirements,
          universityYear: normalizedValues.universityYear,
        }),
      })
      const result = (await response.json().catch(() => ({}))) as {
        checkoutUrl?: string
        error?: string
      }

      if (!response.ok || !result.checkoutUrl) {
        setSubmitError(
          result.error ?? 'Unable to start payment. Please try again.',
        )
        return
      }

      globalThis.location.assign(result.checkoutUrl)
    } catch {
      setSubmitError('Unable to reach the payment service. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBack() {
    if (step === 1) return
    setErrors({})
    setSubmitError(null)
    setStep((step - 1) as Step)
  }

  const currentStep = stepDetails[step]

  return (
    <section aria-labelledby={`rsvp-step-title-${step}`} className="min-w-0">
      <ProgressBar step={step} total={TOTAL_STEPS} />
      <div className="mt-3 flex items-center justify-between gap-4 font-dm-mono text-xs font-medium uppercase tracking-[0.04em] text-ssa-form-accent">
        <h2
          ref={stepHeadingRef}
          id={`rsvp-step-title-${step}`}
          tabIndex={-1}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ssa-form-accent focus-visible:ring-offset-2"
        >
          {currentStep.label}
        </h2>
        <p className="shrink-0">Step {step}/3</p>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {step} of {TOTAL_STEPS}: {currentStep.label}
      </p>

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="mt-8 flex min-h-[440px] flex-col rounded-[18px] border border-[#e6ded1] bg-ssa-card p-5 shadow-[0_1px_2px_#6d4f2b1a,0_14px_34px_#6d4f2b0a] sm:p-8 lg:p-9"
      >
        <fieldset
          key={step}
          disabled={isSubmitting}
          className="rsvp-step-enter flex min-w-0 flex-1 flex-col"
        >
          <legend className="sr-only">{currentStep.label}</legend>

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-6">
              <Field
                name="firstName"
                label="First Name"
                placeholder="First name"
                value={values.firstName}
                error={errors.firstName}
                autoComplete="given-name"
                maxLength={60}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                name="lastName"
                label="Last Name"
                placeholder="Last name"
                value={values.lastName}
                error={errors.lastName}
                autoComplete="family-name"
                maxLength={60}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div className="sm:col-span-2">
                <Field
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  value={values.email}
                  error={errors.email}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  name="phone"
                  label="Phone Number"
                  placeholder="+64 21 000 0000"
                  value={values.phone}
                  error={errors.phone}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={32}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 sm:gap-6">
              <Field
                name="emergencyName"
                label="Emergency Contact Name"
                placeholder="Full name"
                value={values.emergencyName}
                error={errors.emergencyName}
                autoComplete="section-emergency name"
                maxLength={80}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                name="emergencyPhone"
                label="Phone Number"
                placeholder="+64 21 000 0000"
                value={values.emergencyPhone}
                error={errors.emergencyPhone}
                type="tel"
                inputMode="tel"
                autoComplete="section-emergency tel"
                maxLength={32}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field
                name="relationship"
                label="Relationship"
                placeholder="e.g. parent, sibling, friend"
                value={values.relationship}
                error={errors.relationship}
                autoComplete="off"
                maxLength={80}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 sm:gap-6">
              <SelectField
                name="gender"
                label="Gender"
                placeholder="Select gender"
                value={values.gender}
                error={errors.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  { value: 'woman', label: 'Woman' },
                  { value: 'man', label: 'Man' },
                  { value: 'non-binary', label: 'Non-binary' },
                  { value: 'not-say', label: 'Prefer not to say' },
                ]}
              />
              <Field
                name="dietaryRequirements"
                label="Dietary Requirements"
                placeholder="e.g. vegetarian, halal, allergies, or none"
                value={values.dietaryRequirements}
                error={errors.dietaryRequirements}
                autoComplete="off"
                maxLength={200}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <SelectField
                name="universityYear"
                label="What Year of University are you in?"
                placeholder="Select university year"
                value={values.universityYear}
                error={errors.universityYear}
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  { value: '1', label: 'First year' },
                  { value: '2', label: 'Second year' },
                  { value: '3', label: 'Third year' },
                  { value: '4', label: 'Fourth year' },
                  { value: '5+', label: 'Fifth year or later' },
                  { value: 'postgraduate', label: 'Postgraduate' },
                  {
                    value: 'not-currently-studying',
                    label: 'Not currently a university student',
                  },
                ]}
              />
            </div>
          )}

          {submitError && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-[#e6aab5] bg-[#fffafa] px-4 py-3 font-inter text-sm leading-5 text-[#a51d37]"
            >
              {submitError}
            </p>
          )}

          <div
            className={`mt-auto flex flex-col-reverse items-stretch gap-3 pt-10 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4 ${
              step === 1 ? 'justify-end' : 'justify-between'
            }`}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ssa-form-border bg-transparent px-5 font-be-vietnam-pro text-sm font-semibold text-ssa-grey outline-none transition-colors duration-150 hover:bg-ssa-form-field focus-visible:ring-2 focus-visible:ring-ssa-form-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiArrowLeft aria-hidden="true" className="size-4" />
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ssa-form-accent px-6 font-be-vietnam-pro text-sm font-semibold uppercase tracking-[0.02em] text-white outline-none transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-[#bd2f4c] focus-visible:ring-2 focus-visible:ring-ssa-form-accent focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting
                ? 'Redirecting…'
                : step === TOTAL_STEPS
                  ? 'Go to Payment'
                  : 'Next'}
              {step === TOTAL_STEPS ? (
                <FiCheck aria-hidden="true" className="size-4" />
              ) : (
                <FiArrowRight aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  )
}
