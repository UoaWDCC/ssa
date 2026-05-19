import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req }) => {
      if (req.user?.collection !== 'users') return false

      return (req.user as { role?: string | null }).role !== 'member'
    },
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ],
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'email',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Google', value: 'google' },
      ],
    },
    {
      name: 'googleSub',
      type: 'text',
      admin: {
        description: 'Google account subject identifier for OAuth signups.',
      },
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
    },
    {
      name: 'membershipStatus',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Pending', value: 'pending' },
      ],
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
