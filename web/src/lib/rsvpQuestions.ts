import type { RsvpQuestion } from '../../../cms/src/lib/eventRegistrationQuestions'

export type { RsvpQuestion } from '../../../cms/src/lib/eventRegistrationQuestions'

export function getRsvpAnswerKey(
  question: RsvpQuestion,
  index: number,
): string {
  return question.fieldKey === 'custom'
    ? question.id || `custom-${index}`
    : question.fieldKey
}
