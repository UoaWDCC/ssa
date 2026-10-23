import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { getEventAvailability } from '@/lib/eventCapacity'

export const Events: CollectionConfig = {
  slug: 'events',
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        Object.assign(doc, await getEventAvailability(req.payload, doc.id, doc.capacity, req))
        return doc
      },
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
    admin: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
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
      name: 'capacity',
      type: 'number',
      min: 0,
      validate: (value: number | null | undefined) =>
        value == null ||
        (Number.isSafeInteger(value) && value >= 0) ||
        'Capacity must be a non-negative whole number.',
      admin: {
        description: 'Leave empty for unlimited places. Can be changed after signups open.',
      },
    },
    { name: 'registrationCount', type: 'number', virtual: true, admin: { readOnly: true } },
    { name: 'spotsRemaining', type: 'number', virtual: true, admin: { readOnly: true } },
    { name: 'waitlistEnabled', type: 'checkbox', virtual: true, admin: { readOnly: true } },
    {
      name: 'description',
      type: 'textarea',
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
