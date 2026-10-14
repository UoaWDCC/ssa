'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi'

import ProgressBar from '@/components/ProgressBar'
import {
  DEFAULT_RSVP_QUESTIONS,
  getRsvpAnswerKey,
  type RsvpQuestion,
} from '@/lib/rsvpQuestions'

type RsvpStep = 'emergency' | 'attendee'
type AnswerValue = string | boolean
type Answers = Record<string, AnswerValue>
type FieldErrors = Record<string, string>

export type Member = {
  name: string
  email: string
  gender: string
  universityYear: string
}

type RsvpFormProps = Readonly<{
  eventId?: number
  member: Member
  questions?: RsvpQuestion[] | null
}>

const stepLabels: Record<RsvpStep, string> = {
  emergency: 'Emergency contact information',
  attendee: 'Attendee details',
}

function controlId(key: string) {
  return `rsvp-${encodeURIComponent(key)}`
}

function validateQuestion(
  question: RsvpQuestion,
  value: AnswerValue,
): string | undefined {
  if (question.type === 'checkbox') {
    return question.required && value !== true
      ? `Please confirm ${question.label.toLowerCase()}.`
      : undefined
  }

  const textValue = typeof value === 'string' ? value.trim() : ''
  if (question.required && !textValue) {
    return `Please enter ${question.label.toLowerCase()}.`
  }
  if (!textValue) return undefined

  if (question.type === 'email' && !/^\S+@\S+\.\S+$/.test(textValue)) {
    return 'Enter a valid email address.'
  }
  if (question.type === 'tel') {
    if (!/^\+?[\d\s().-]+$/.test(textValue)) {
      return 'Use only numbers, spaces, brackets, a leading +, or hyphens.'
    }
    if (textValue.replace(/\D/g, '').length < 7) {
      return 'Enter a phone number with at least 7 digits.'
    }
  }
  if (question.type === 'number' && !Number.isFinite(Number(textValue))) {
    return 'Enter a valid number.'
  }
  if (
    question.type === 'select' &&
    !(question.options ?? []).some((option) => option?.value === textValue)
  ) {
    return 'Choose one of the available options.'
  }

  return undefined
}

export default function RsvpForm({
  eventId,
  member,
  questions = DEFAULT_RSVP_QUESTIONS,
}: RsvpFormProps) {
  const enabledQuestions = (questions ?? []).filter(
    (question) => question.enabled !== false,
  )
  const steps = (['emergency', 'attendee'] as const).filter((candidate) =>
    enabledQuestions.some((question) => question.step === candidate),
  )
  const activeSteps: RsvpStep[] = steps.length > 0 ? [...steps] : ['attendee']

  const [step, setStep] = useState<RsvpStep>('emergency')
  const currentStep = activeSteps.includes(step) ? step : activeSteps[0]
  const stepIndex = activeSteps.indexOf(currentStep)
  const visibleQuestions = enabledQuestions
    .map((question, index) => ({
      question,
      index,
      key: getRsvpAnswerKey(question, index),
    }))
    .filter(({ question }) => question.step === currentStep)
  const [values, setValues] = useState<Answers>({
    gender: member.gender,
    universityYear: member.universityYear,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(currentStep)

  useEffect(() => {
    if (previousStep.current === currentStep) return
    stepHeadingRef.current?.focus()
    previousStep.current = currentStep
  }, [currentStep])

  function handleChange(key: string, value: AnswerValue) {
    setValues((current) => ({ ...current, [key]: value }))
    setSubmitError(null)
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function handleBlur(question: RsvpQuestion, key: string) {
    const message = validateQuestion(question, values[key] ?? '')
    setErrors((current) => {
      const next = { ...current }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }

  function validateCurrentStep() {
    const nextErrors: FieldErrors = {}
    for (const { question, key } of visibleQuestions) {
      const message = validateQuestion(
        question,
        values[key] ?? (question.type === 'checkbox' ? false : ''),
      )
      if (message) nextErrors[key] = message
    }
    return nextErrors
  }

  function focusFirstError(nextErrors: FieldErrors) {
    const firstKey = visibleQuestions.find(({ key }) => nextErrors[key])?.key
    if (!firstKey) return
    requestAnimationFrame(() =>
      document.getElementById(controlId(firstKey))?.focus(),
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = validateCurrentStep()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    setSubmitError(null)
    if (stepIndex < activeSteps.length - 1) {
      setStep(activeSteps[stepIndex + 1])
      return
    }

    if (!eventId) {
      setSubmitError('The event is still loading. Please try again shortly.')
      return
    }

    const answers: Answers = {}
    enabledQuestions.forEach((question, index) => {
      const key = getRsvpAnswerKey(question, index)
      answers[key] = values[key] ?? (question.type === 'checkbox' ? false : '')
    })

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventId, answers }),
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
    if (stepIndex <= 0) return
    setErrors({})
    setSubmitError(null)
    setStep(activeSteps[stepIndex - 1])
  }

  const currentStepLabel = stepLabels[currentStep]
  const isLastStep = stepIndex === activeSteps.length - 1

  return (
    <section
      aria-labelledby={`rsvp-step-title-${currentStep}`}
      className="min-w-0"
    >
      <ProgressBar step={stepIndex + 1} total={activeSteps.length} />
      <div className="mt-3 flex items-center justify-between gap-4 font-dm-mono text-xs font-medium uppercase tracking-[0.04em] text-ssa-form-accent">
        <h2
          ref={stepHeadingRef}
          id={`rsvp-step-title-${currentStep}`}
          tabIndex={-1}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ssa-form-accent focus-visible:ring-offset-2"
        >
          {currentStepLabel}
        </h2>
        <p className="shrink-0">
          Step {stepIndex + 1}/{activeSteps.length}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {stepIndex + 1} of {activeSteps.length}: {currentStepLabel}
      </p>

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="mt-8 flex min-h-[440px] flex-col rounded-[18px] border border-[#e6ded1] bg-ssa-card p-5 shadow-[0_1px_2px_#6d4f2b1a,0_14px_34px_#6d4f2b0a] sm:p-8 lg:p-9"
      >
        <fieldset
          key={currentStep}
          disabled={isSubmitting}
          className="rsvp-step-enter flex min-w-0 flex-1 flex-col"
        >
          <legend className="sr-only">{currentStepLabel}</legend>

          {currentStep === 'emergency' && (
            <p className="mb-5 rounded-xl border border-ssa-form-border bg-ssa-form-field px-4 py-3 font-inter text-sm leading-5 text-ssa-grey">
              Registering as{' '}
              <span className="font-semibold">
                {member.name || member.email}
              </span>
              {member.name && (
                <span className="text-[#6f6961]"> ({member.email})</span>
              )}
            </p>
          )}

          <div className="grid gap-5 sm:gap-6">
            {visibleQuestions.map(({ question, key, index }) => {
              const id = controlId(key)
              const errorId = `${id}-error`
              const value =
                values[key] ?? (question.type === 'checkbox' ? false : '')
              const error = errors[key]
              const required = question.required === true
              const sharedClasses = `w-full border bg-ssa-form-field font-inter text-base text-ssa-grey shadow-[inset_0_1px_0_#ffffff] outline-none transition-[border-color,box-shadow,background-color] duration-150 focus-visible:border-ssa-form-accent focus-visible:ring-2 focus-visible:ring-ssa-form-accent/25 ${
                error
                  ? 'border-[#b4233d] bg-[#fffafa]'
                  : 'border-ssa-form-border'
              }`
              const describedBy = error ? errorId : undefined
              const options = (question.options ?? []).filter(
                (option): option is { label: string; value: string } =>
                  Boolean(option),
              )

              return (
                <div key={`${key}-${index}`} className="flex flex-col gap-2">
                  {question.type === 'checkbox' ? (
                    <label
                      htmlFor={id}
                      className="flex min-h-12 items-center gap-3 font-inter text-sm font-medium leading-5 text-ssa-grey"
                    >
                      <input
                        id={id}
                        name={key}
                        type="checkbox"
                        checked={value === true}
                        required={required}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        onChange={(change) =>
                          handleChange(key, change.target.checked)
                        }
                        onBlur={() => handleBlur(question, key)}
                        className="size-5 accent-ssa-form-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ssa-form-accent"
                      />
                      <span>{question.label}</span>
                      {required && (
                        <span
                          aria-hidden="true"
                          className="text-ssa-form-accent"
                        >
                          *
                        </span>
                      )}
                    </label>
                  ) : (
                    <>
                      <label
                        htmlFor={id}
                        className="font-inter text-sm font-medium leading-5 text-ssa-grey"
                      >
                        {question.label}
                        {required && (
                          <span
                            aria-hidden="true"
                            className="ml-0.5 text-ssa-form-accent"
                          >
                            *
                          </span>
                        )}
                      </label>
                      {question.type === 'textarea' ? (
                        <textarea
                          id={id}
                          name={key}
                          value={typeof value === 'string' ? value : ''}
                          placeholder={question.placeholder ?? ''}
                          required={required}
                          maxLength={2000}
                          aria-invalid={Boolean(error)}
                          aria-describedby={describedBy}
                          onChange={(change) =>
                            handleChange(key, change.target.value)
                          }
                          onBlur={() => handleBlur(question, key)}
                          className={`${sharedClasses} min-h-28 resize-y rounded-2xl px-4 py-3 placeholder:text-[#6f6961] hover:border-[#6f6961]`}
                        />
                      ) : question.type === 'select' ? (
                        <div className="relative">
                          <select
                            id={id}
                            name={key}
                            value={typeof value === 'string' ? value : ''}
                            required={required}
                            aria-invalid={Boolean(error)}
                            aria-describedby={describedBy}
                            onChange={(change) =>
                              handleChange(key, change.target.value)
                            }
                            onBlur={() => handleBlur(question, key)}
                            className={`${sharedClasses} h-12 appearance-none rounded-full px-4 pr-12 ${
                              value ? '' : 'text-[#6f6961]'
                            }`}
                          >
                            <option value="" disabled>
                              {question.placeholder || 'Select an option'}
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
                      ) : (
                        <input
                          id={id}
                          name={key}
                          type={question.type}
                          inputMode={
                            question.type === 'tel' ? 'tel' : undefined
                          }
                          value={typeof value === 'string' ? value : ''}
                          placeholder={question.placeholder ?? ''}
                          required={required}
                          maxLength={500}
                          autoCapitalize={
                            question.type === 'email' ? 'none' : undefined
                          }
                          spellCheck={
                            question.type === 'email' ? false : undefined
                          }
                          aria-invalid={Boolean(error)}
                          aria-describedby={describedBy}
                          onChange={(change) =>
                            handleChange(key, change.target.value)
                          }
                          onBlur={() => handleBlur(question, key)}
                          className={`${sharedClasses} h-12 rounded-full px-4 placeholder:text-[#6f6961] hover:border-[#6f6961]`}
                        />
                      )}
                    </>
                  )}
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
            })}
          </div>

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
              stepIndex === 0 ? 'justify-end' : 'justify-between'
            }`}
          >
            {stepIndex > 0 && (
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
                : isLastStep
                  ? 'Go to Payment'
                  : 'Next'}
              {isLastStep ? (
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
