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

export const RSVP_GENDER_VALUES = ['woman', 'man', 'non-binary', 'not-say'] as const
export const RSVP_GENDER_OPTIONS = [
  { label: 'Woman', value: RSVP_GENDER_VALUES[0] },
  { label: 'Man', value: RSVP_GENDER_VALUES[1] },
  { label: 'Non-binary', value: RSVP_GENDER_VALUES[2] },
  { label: 'Prefer not to say', value: RSVP_GENDER_VALUES[3] },
] as const

export const RSVP_UNIVERSITY_YEAR_VALUES = [
  '1',
  '2',
  '3',
  '4',
  '5+',
  'postgraduate',
  'not-currently-studying',
] as const
export const RSVP_UNIVERSITY_YEAR_OPTIONS = [
  { label: 'First year', value: RSVP_UNIVERSITY_YEAR_VALUES[0] },
  { label: 'Second year', value: RSVP_UNIVERSITY_YEAR_VALUES[1] },
  { label: 'Third year', value: RSVP_UNIVERSITY_YEAR_VALUES[2] },
  { label: 'Fourth year', value: RSVP_UNIVERSITY_YEAR_VALUES[3] },
  { label: 'Fifth year or later', value: RSVP_UNIVERSITY_YEAR_VALUES[4] },
  { label: 'Postgraduate', value: RSVP_UNIVERSITY_YEAR_VALUES[5] },
  { label: 'Not currently a university student', value: RSVP_UNIVERSITY_YEAR_VALUES[6] },
] as const

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
    options: [...RSVP_GENDER_OPTIONS],
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
    options: [...RSVP_UNIVERSITY_YEAR_OPTIONS],
  },
] satisfies RsvpQuestion[]

export function validateRsvpQuestionConfiguration(value: unknown): true | string {
  if (!Array.isArray(value)) return true

  const keys = new Set<string>()
  for (const question of value as RsvpQuestion[]) {
    const key = question.fieldKey === 'custom' ? question.id : question.fieldKey
    if (typeof key !== 'string' || !key) continue
    if (keys.has(key)) return 'Each built-in or custom RSVP question can only be added once'
    keys.add(key)
  }

  return true
}

export function isOneOf<const T extends readonly string[]>(
  values: T,
  value: string | null | undefined,
): value is T[number] {
  return value !== null && value !== undefined && (values as readonly string[]).includes(value)
}

export function validateRsvpAnswers(
  questions: readonly RsvpQuestion[],
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

      const maxLength = question.type === 'textarea' ? 2000 : 500
      if (value.length > maxLength) {
        return { error: `${question.label} must be ${maxLength} characters or fewer` }
      }

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
