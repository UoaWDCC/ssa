import { describe, expect, it } from 'vitest'

import {
  DEFAULT_RSVP_QUESTIONS,
  validateRsvpAnswers,
} from '../../src/lib/eventRegistrationQuestions'

describe('validateRsvpAnswers', () => {
  it('accepts and snapshots the default RSVP answers', () => {
    const result = validateRsvpAnswers(DEFAULT_RSVP_QUESTIONS, {
      emergencyContactName: 'Alex Tan',
      emergencyContactPhone: '+64 21 123 4567',
      emergencyContactRelationship: 'Parent',
      gender: 'woman',
      dietaryRequirements: 'None',
      universityYear: '2',
    })

    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.answers).toHaveLength(6)
    expect(result.answers[0]).toMatchObject({
      questionId: 'emergencyContactName',
      label: 'Emergency Contact Name',
      value: 'Alex Tan',
    })
    expect(result.answers[3]).toMatchObject({
      questionId: 'gender',
      label: 'Gender',
      value: 'woman',
    })
  })

  it('allows optional and disabled questions to be unanswered', () => {
    const questions = [
      {
        fieldKey: 'custom',
        id: 'optional-question',
        label: 'Optional detail',
        type: 'text' as const,
        step: 'attendee' as const,
        required: false,
      },
      {
        fieldKey: 'custom',
        id: 'disabled-question',
        label: 'Disabled detail',
        type: 'text' as const,
        step: 'attendee' as const,
        required: true,
        enabled: false,
      },
    ]

    expect(validateRsvpAnswers(questions, {})).toMatchObject({
      answers: [
        {
          questionId: 'optional-question',
          value: '',
        },
      ],
    })
  })

  it('rejects missing required custom answers', () => {
    const result = validateRsvpAnswers(
      [
        {
          fieldKey: 'custom',
          id: 'dietary-note',
          label: 'Allergies',
          type: 'textarea',
          step: 'attendee',
          required: true,
        },
      ],
      {},
    )

    expect(result).toEqual({ error: 'Allergies is required' })
  })

  it('rejects select values not in the event question options', () => {
    const result = validateRsvpAnswers(
      [
        {
          fieldKey: 'custom',
          id: 'transport',
          label: 'Transport',
          type: 'select',
          step: 'attendee',
          required: true,
          options: [{ label: 'Bus', value: 'bus' }],
        },
      ],
      { transport: 'train' },
    )

    expect(result).toEqual({ error: 'Choose a valid option for Transport' })
  })

  it('rejects duplicate question keys and non-record answers', () => {
    const questions = [
      {
        fieldKey: 'custom',
        id: 'duplicate',
        label: 'One',
        type: 'text' as const,
        step: 'attendee' as const,
      },
      {
        fieldKey: 'custom',
        id: 'duplicate',
        label: 'Two',
        type: 'text' as const,
        step: 'attendee' as const,
      },
    ]

    expect(validateRsvpAnswers(questions, {})).toEqual({
      error: 'RSVP question keys must be unique',
    })
    expect(validateRsvpAnswers([], [])).toEqual({ error: 'Invalid RSVP answers' })
  })
})
