import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  auth: true,
  access: {
    create: () => false,
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
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'email',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Google', value: 'google' },
      ],
      required: true,
    },
    {
      name: 'googleSub',
      type: 'text',
      admin: {
        description: 'Google account subject identifier for OAuth signups.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'ACTIVE',
          value: 'active',
        },
        {
          label: 'EXPIRED',
          value: 'expired',
        },
        {
          label: 'PENDING',
          value: 'pending',
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
      name: 'encryptedSignupPassword',
      type: 'text',
      hidden: true,
    },
    {
      name: 'emergencyContactName',
      type: 'text',
    },
    {
      name: 'emergencyContactPhone',
      type: 'text',
    },
    {
      name: 'upi',
      type: 'text',
    },
    {
      name: 'studentId',
      type: 'text',
    },
    {
      name: 'areaOfStudy',
      type: 'text',
    },
    {
      name: 'yearOfUniversity',
      type: 'select',
      options: [
        { label: 'Year 1', value: '1' },
        { label: 'Year 2', value: '2' },
        { label: 'Year 3', value: '3' },
        { label: 'Year 4', value: '4' },
        { label: 'Year 5+', value: '5+' },
        { label: 'Postgraduate', value: 'postgrad' },
      ],
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Prefer not to say', value: 'prefer-not-to-say' },
      ],
    },
    {
      name: 'ethnicity',
      type: 'select',
      options: [
        { label: 'Chinese', value: 'chinese' },
        { label: 'Malay', value: 'malay' },
        { label: 'Indian', value: 'indian' },
        { label: 'Eurasian', value: 'eurasian' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'returningMember',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
