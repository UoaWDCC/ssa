'use client'

import { useMemo, useState } from 'react'
import CardSection from '@/components/CardSection'
import InputField from '@/components/InputField'
import SelectField from '@/components/SelectField'
import type { PayloadForm, PayloadFormField } from '@/lib/payload-form'

type FormValues = Record<string, string | boolean>

type SubmissionDataEntry = {
  field: string
  value: unknown
}

type PayloadFormStepProps = {
  form: PayloadForm
  onSubmitPending: (submissionData: SubmissionDataEntry[]) => void
}

function getFieldKey(field: PayloadFormField, index: number) {
  return field.name || field.blockName || `field-${index}`
}

function getInitialValue(field: PayloadFormField) {
  if (field.blockType === 'checkbox') {
    return Boolean(field.defaultValue)
  }

  if (typeof field.defaultValue === 'string') {
    return field.defaultValue
  }

  return ''
}

function toLabel(field: PayloadFormField, index: number) {
  return field.label || field.blockName || `Field ${index + 1}`
}

function renderMessage(message: unknown) {
  if (typeof message === 'string') {
    return <p className="text-sm text-ssa-black">{message}</p>
  }

  return null
}

export default function PayloadFormStep({
  form,
  onSubmitPending,
}: PayloadFormStepProps) {
  const initialValues = useMemo<FormValues>(() => {
    return form.fields.reduce<FormValues>((accumulator, field, index) => {
      if (field.blockType === 'message') {
        return accumulator
      }

      accumulator[getFieldKey(field, index)] = getInitialValue(field)
      return accumulator
    }, {})
  }, [form.fields])

  const [values, setValues] = useState<FormValues>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const buttonLabel = form.submitButtonLabel || 'Submit'

  function updateValue(key: string, value: string | boolean) {
    setValues((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) {
        return current
      }

      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validate() {
    const nextErrors: Record<string, string> = {}

    form.fields.forEach((field, index) => {
      if (field.blockType === 'message') {
        return
      }

      const key = getFieldKey(field, index)
      const value = values[key]

      if (field.required) {
        const hasValue =
          typeof value === 'boolean'
            ? value
            : String(value ?? '').trim().length > 0

        if (!hasValue) {
          nextErrors[key] = 'This field is required'
        }
      }
    })

    return nextErrors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = form.fields
        .map((field, index) => {
          if (field.blockType === 'message') {
            return null
          }

          const key = getFieldKey(field, index)
          return {
            field: key,
            value: values[key],
          }
        })
        .filter(Boolean) as Array<{ field: string; value: unknown }>

      onSubmitPending(submissionData)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CardSection title={form.title}>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        {form.fields.map((field, index) => {
          if (field.blockType === 'message') {
            return (
              <div key={getFieldKey(field, index)}>
                {renderMessage(field.message)}
              </div>
            )
          }

          const key = getFieldKey(field, index)
          const label = toLabel(field, index)
          const value = values[key]
          const errorMessage = fieldErrors[key]

          if (field.blockType === 'select') {
            return (
              <SelectField
                key={key}
                label={label}
                required={field.required}
                placeholder={field.placeholder}
                value={typeof value === 'string' ? value : ''}
                onChange={(nextValue) => updateValue(key, nextValue)}
                options={field.options || []}
                error={errorMessage}
              />
            )
          }

          if (field.blockType === 'radio') {
            return (
              <div key={key} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ssa-black">
                  {label}
                  {field.required && (
                    <span className="text-ssa-red ml-0.5">*</span>
                  )}
                </span>
                <div className="flex flex-col gap-2 rounded-lg bg-white p-3 border border-transparent">
                  {(field.options || []).map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-sm text-ssa-black"
                    >
                      <input
                        type="radio"
                        name={key}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => updateValue(key, option.value)}
                        className="accent-ssa-red"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-600">{errorMessage}</p>
                )}
              </div>
            )
          }

          if (field.blockType === 'checkbox') {
            return (
              <div key={key} className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm font-medium text-ssa-black">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => updateValue(key, event.target.checked)}
                    className="h-4 w-4 accent-ssa-red"
                  />
                  <span>
                    {label}
                    {field.required && (
                      <span className="text-ssa-red ml-0.5">*</span>
                    )}
                  </span>
                </label>
                {errorMessage && (
                  <p className="text-xs text-red-600">{errorMessage}</p>
                )}
              </div>
            )
          }

          if (field.blockType === 'textarea') {
            return (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-ssa-black">
                  {label}
                  {field.required && (
                    <span className="text-ssa-red ml-0.5">*</span>
                  )}
                </label>
                <textarea
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => updateValue(key, event.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full min-h-32 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none border border-transparent focus:border-ssa-red bg-white placeholder:text-gray-400"
                />
                {errorMessage && (
                  <p className="text-xs text-red-600">{errorMessage}</p>
                )}
              </div>
            )
          }

          const inputType =
            field.blockType === 'email' ||
            field.blockType === 'number' ||
            field.blockType === 'date'
              ? field.blockType
              : 'text'

          return (
            <InputField
              key={key}
              label={label}
              required={field.required}
              placeholder={field.placeholder}
              value={typeof value === 'string' ? value : ''}
              onChange={(nextValue) => updateValue(key, nextValue)}
              type={inputType}
              error={errorMessage}
            />
          )
        })}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-ssa-red text-white text-sm font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : buttonLabel}
        </button>
      </form>
    </CardSection>
  )
}
