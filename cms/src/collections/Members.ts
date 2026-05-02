import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  auth: true,
  access: {
    create: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
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
      defaultValue: 'pending',
    },
    {
      name: 'membershipExpiryDate',
      type: 'date',
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
    },
    {
      name: 'emergencyContactName',
      type: 'text',
    },
    {
      name: 'emergencyContactPhone',
      type: 'text',
    }
  ]
}