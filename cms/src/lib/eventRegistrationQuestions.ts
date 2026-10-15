export const DEFAULT_RSVP_QUESTIONS = [
  {
    fieldKey: 'emergencyContactName',
    label: 'Emergency Contact Name',
    type: 'text',
    step: 'emergency',
    required: true,
    enabled: true,
    placeholder: 'Full name',
  },
  {
    fieldKey: 'emergencyContactPhone',
    label: 'Emergency Contact Phone',
    type: 'tel',
    step: 'emergency',
    required: true,
    enabled: true,
    placeholder: '+64 21 000 0000',
  },
  {
    fieldKey: 'emergencyContactRelationship',
    label: 'Relationship',
    type: 'text',
    step: 'emergency',
    required: true,
    enabled: true,
    placeholder: 'e.g. parent, sibling, friend',
  },
  {
    fieldKey: 'gender',
    label: 'Gender',
    type: 'select',
    step: 'attendee',
    required: true,
    enabled: true,
    placeholder: 'Select gender',
    options: [
      { label: 'Woman', value: 'woman' },
      { label: 'Man', value: 'man' },
      { label: 'Non-binary', value: 'non-binary' },
      { label: 'Prefer not to say', value: 'not-say' },
    ],
  },
  {
    fieldKey: 'dietaryRequirements',
    label: 'Dietary Requirements',
    type: 'textarea',
    step: 'attendee',
    required: true,
    enabled: true,
    placeholder: 'e.g. vegetarian, halal, allergies, or none',
  },
  {
    fieldKey: 'universityYear',
    label: 'What Year of University are you in?',
    type: 'select',
    step: 'attendee',
    required: true,
    enabled: true,
    placeholder: 'Select university year',
    options: [
      { label: 'First year', value: '1' },
      { label: 'Second year', value: '2' },
      { label: 'Third year', value: '3' },
      { label: 'Fourth year', value: '4' },
      { label: 'Fifth year or later', value: '5+' },
      { label: 'Postgraduate', value: 'postgraduate' },
      { label: 'Not currently a university student', value: 'not-currently-studying' },
    ],
  },
] satisfies RsvpQuestion[]

export type RsvpQuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'number'
  | 'select'
  | 'checkbox'

export type RsvpQuestion = {
  id?: string | null
  fieldKey: string
  label: string
  type: RsvpQuestionType
  step: 'emergency' | 'attendee'
  required?: boolean | null
  enabled?: boolean | null
  placeholder?: string | null
  options?: Array<{ label: string; value: string } | null> | null
}

export type RsvpAnswerValue = string | boolean

export type RsvpAnswerSnapshot = {
  questionId: string
  fieldKey: string
  label: string
  type: RsvpQuestionType
  value: RsvpAnswerValue
}

export function validateRsvpAnswers(
  questions: RsvpQuestion[],
  submittedAnswers: unknown,
): { answers: RsvpAnswerSnapshot[] } | { error: string } {
  if (
    typeof submittedAnswers !== 'object' ||
    submittedAnswers === null ||
    Array.isArray(submittedAnswers)
  ) {
    return { error: 'Invalid RSVP answers' }
  }

  const values = submittedAnswers as Record<string, unknown>
  const activeQuestions = questions.filter((question) => question.enabled !== false)
  const identityKeys = activeQuestions.map((question) =>
    question.fieldKey === 'custom' ? question.id : question.fieldKey,
  )

  if (identityKeys.some((key) => typeof key !== 'string' || !key)) {
    return { error: 'Every custom RSVP question needs an ID' }
  }

  if (new Set(identityKeys).size !== identityKeys.length) {
    return { error: 'RSVP question keys must be unique' }
  }

  const answers: RsvpAnswerSnapshot[] = []

  for (const question of activeQuestions) {
    const questionId = question.fieldKey === 'custom' ? question.id! : question.fieldKey
    const rawValue = values[questionId]
    let value: RsvpAnswerValue

    if (question.type === 'checkbox') {
      if (rawValue !== undefined && typeof rawValue !== 'boolean') {
        return { error: `Invalid answer for ${question.label}` }
      }
      value = rawValue === true
    } else {
      if (rawValue !== undefined && typeof rawValue !== 'string') {
        return { error: `Invalid answer for ${question.label}` }
      }
      value = typeof rawValue === 'string' ? rawValue.trim() : ''

      if (question.required && value === '') {
        return { error: `${question.label} is required` }
      }

      if (question.type === 'select' && value !== '') {
        const allowedValues = (question.options ?? [])
          .filter((option): option is { label: string; value: string } => Boolean(option))
          .map((option) => option.value)
        if (!allowedValues.includes(value)) {
          return { error: `Choose a valid option for ${question.label}` }
        }
      }

      if (question.type === 'email' && value !== '' && !/^\S+@\S+\.\S+$/.test(value)) {
        return { error: `Enter a valid email address for ${question.label}` }
      }

      if (question.type === 'tel' && value !== '') {
        if (!/^\+?[\d\s().-]+$/.test(value) || value.replace(/\D/g, '').length < 7) {
          return { error: `Enter a valid phone number for ${question.label}` }
        }
      }

      if (question.type === 'number' && value !== '' && !Number.isFinite(Number(value))) {
        return { error: `Enter a valid number for ${question.label}` }
      }
    }

    if (question.required && question.type === 'checkbox' && value !== true) {
      return { error: `${question.label} is required` }
    }

    answers.push({
      questionId,
      fieldKey: question.fieldKey,
      label: question.label,
      type: question.type,
      value,
    })
  }

  return { answers }
}
