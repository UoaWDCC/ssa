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

export const DEFAULT_RSVP_QUESTIONS: RsvpQuestion[] = [
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
      {
        label: 'Not currently a university student',
        value: 'not-currently-studying',
      },
    ],
  },
]

export function getRsvpAnswerKey(
  question: RsvpQuestion,
  index: number,
): string {
  return question.fieldKey === 'custom'
    ? question.id || `custom-${index}`
    : question.fieldKey
}
