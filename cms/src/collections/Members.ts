import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      required: true
    },
    {
      name: 'password',
      type: 'text',
      required: true
    },
    {
      name: 'phone',
      type: 'text',
      required: true
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'ACTIVE',
          value: 'active'
        },
        {
          label: 'EXPIRED',
          value: 'expired'
        },
        {
          label: 'PENDING',
          value: 'pending'
        },
      ],
      required: true,
      defaultValue: 'pending'
    },
    {
      name: 'membership expiry date',
      type: 'date',
    },
    {
      name: 'stripe customer id',
      type: 'text'
    },
    {
      name: 'emergency contact name',
      type: 'text'
    },
    {
      name: 'emergency contact phone',
      type: 'text'
    }
  ]
}