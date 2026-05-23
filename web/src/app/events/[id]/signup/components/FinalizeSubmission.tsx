'use client'

import { useEffect, useState } from 'react'

type SubmissionDataEntry = {
  field: string
  value: unknown
}

type FinalizeSubmissionProps = {
  formId: string | number
}

type SubmissionStatus = 'loading' | 'success' | 'error'

export default function FinalizeSubmission({
  formId,
}: FinalizeSubmissionProps) {
  const [status, setStatus] = useState<SubmissionStatus>('loading')
  const [message, setMessage] = useState('Finalizing your signup...')

  useEffect(() => {
    const run = async () => {
      const storageKey = `event-signup-submission:${formId}`
      const storedSubmission = window.sessionStorage.getItem(storageKey)

      if (!storedSubmission) {
        setStatus('error')
        setMessage(
          'We could not find your saved signup details. Please contact support if your payment went through.',
        )
        return
      }

      let submissionData: SubmissionDataEntry[]
      try {
        submissionData = JSON.parse(storedSubmission) as SubmissionDataEntry[]
      } catch {
        setStatus('error')
        setMessage(
          'Your saved signup details were unreadable. Please try again.',
        )
        return
      }

      try {
        const response = await fetch(`/api/forms/${formId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionData }),
        })

        const result = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            result?.error ?? 'Something went wrong. Please try again.',
          )
        }

        window.sessionStorage.removeItem(storageKey)
        setStatus('success')
        setMessage('Your response has been submitted.')
      } catch (err) {
        setStatus('error')
        setMessage(
          err instanceof Error
            ? err.message
            : 'Network error. Please check your connection and try again.',
        )
      }
    }

    void run()
  }, [formId])

  return (
    <div
      className={
        status === 'error'
          ? 'rounded-lg bg-red-50 border border-red-200 p-3 text-red-800 text-sm'
          : 'rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800'
      }
    >
      {message}
    </div>
  )
}
