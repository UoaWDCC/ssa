import type { CollectionConfig } from 'payload'
import { DEFAULT_RSVP_QUESTIONS } from '../lib/eventRegistrationQuestions'

export const Events: CollectionConfig = {
  slug: 'events',
  hooks: {
    afterRead: [
      ({ doc }) => ({
        ...doc,
        rsvpQuestions:
          doc.rsvpQuestions?.length > 0
            ? doc.rsvpQuestions
            : DEFAULT_RSVP_QUESTIONS.map((question) => ({
                ...question,
                id: question.fieldKey,
              })),
      }),
    ],
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (data.isUpcoming !== true) {
          return data
        }

        const upcomingEvents = await req.payload.find({
          collection: 'events',
          where: {
            isUpcoming: {
              equals: true,
            },
          },
          limit: 0,
          req,
        })

        const currentEventId = operation === 'update' ? originalDoc?.id : undefined

        await Promise.all(
          upcomingEvents.docs
            .filter((event) => event.id !== currentEventId)
            .map((event) =>
              req.payload.update({
                collection: 'events',
                id: event.id,
                data: {
                  isUpcoming: false,
                },
                req,
              }),
            ),
        )

        return data
      },
    ],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      label: 'Day',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    {
      name: 'time',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
          displayFormat: 'h:mm a',
          timeIntervals: 15,
        },
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'memberPrice',
      label: 'Price',
      type: 'number',
      min: 0,
      admin: {
        description: 'Price in NZD. Leave empty (or 0) for a free event.',
        step: 0.01,
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'rsvpQuestions',
      label: 'RSVP Form Questions',
      type: 'array',
      defaultValue: DEFAULT_RSVP_QUESTIONS,
      admin: {
        description:
          'Add, edit, reorder, or disable questions shown on this event’s RSVP form. Existing registrations keep a snapshot of their submitted answers.',
      },
      fields: [
        {
          name: 'fieldKey',
          label: 'Question field',
          type: 'select',
          required: true,
          defaultValue: 'custom',
          options: [
            { label: 'Custom question', value: 'custom' },
            { label: 'Emergency contact name', value: 'emergencyContactName' },
            { label: 'Emergency contact phone', value: 'emergencyContactPhone' },
            { label: 'Emergency contact relationship', value: 'emergencyContactRelationship' },
            { label: 'Gender', value: 'gender' },
            { label: 'Dietary requirements', value: 'dietaryRequirements' },
            { label: 'University year', value: 'universityYear' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Short text', value: 'text' },
            { label: 'Long text', value: 'textarea' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'tel' },
            { label: 'Number', value: 'number' },
            { label: 'Dropdown', value: 'select' },
            { label: 'Checkbox', value: 'checkbox' },
          ],
        },
        {
          name: 'step',
          type: 'select',
          required: true,
          defaultValue: 'attendee',
          options: [
            { label: 'Emergency contact information', value: 'emergency' },
            { label: 'Attendee details', value: 'attendee' },
          ],
        },
        {
          name: 'placeholder',
          type: 'text',
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'select',
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Games', value: 'games' },
        { label: 'Community', value: 'community' },
        { label: 'Food', value: 'food' },
        { label: 'AGM', value: 'agm' },
        { label: 'All', value: 'all' },
      ],
    },
    {
      name: 'isUpcoming',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
