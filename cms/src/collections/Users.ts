import type { Access, CollectionConfig, FieldAccess } from 'payload'

const isAdmin = (user: unknown) => {
  const u = user as { collection?: string; role?: string | null } | null

  return u?.collection === 'users' && u.role === 'admin'
}

const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true

  return { id: { equals: user.id } }
}

// Members can edit their own profile but must not grant themselves a role or membership.
const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdmin(user)

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req: { user } }) => isAdmin(user),
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      access: { update: adminOnlyField },
      type: 'select',
      defaultValue: 'member',
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
      access: { update: adminOnlyField },
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
      access: { update: adminOnlyField },
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
