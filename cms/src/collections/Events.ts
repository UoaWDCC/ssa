import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
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
      label: 'Member Price',
      type: 'number',
      min: 0,
      admin: {
        description: 'Price in NZD',
        step: 0.01,
      },
    },
    {
      name: 'nonMemberPrice',
      label: 'Non-member Price',
      type: 'number',
      min: 0,
      admin: {
        description: 'Price in NZD',
        step: 0.01,
      },
    },
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
