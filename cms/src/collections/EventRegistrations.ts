import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { prepareEventRegistration, protectOfferedRegistration } from '@/hooks/eventRegistrations'

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  hooks: { beforeChange: [prepareEventRegistration], beforeDelete: [protectOfferedRegistration] },
  access: {
    admin: adminOnly,
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['event', 'email', 'status', 'amount', 'createdAt'],
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      index: true,
    },
    {
      name: 'user',
      label: 'Member Account',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        description: 'The authenticated member account, when applicable.',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'emergencyContactName',
      type: 'text',
      required: true,
    },
    {
      name: 'emergencyContactPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'emergencyContactRelationship',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Woman', value: 'woman' },
        { label: 'Man', value: 'man' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Prefer not to say', value: 'not-say' },
      ],
    },
    {
      name: 'dietaryRequirements',
      type: 'textarea',
      required: true,
    },
    {
      name: 'universityYear',
      label: 'University Year',
      type: 'select',
      required: true,
      options: [
        { label: 'First year', value: '1' },
        { label: 'Second year', value: '2' },
        { label: 'Third year', value: '3' },
        { label: 'Fourth year', value: '4' },
        { label: 'Fifth year or later', value: '5+' },
        { label: 'Postgraduate', value: 'postgraduate' },
        {
          label: 'Not currently a university student',
          value: 'not-currently-studying',
        },
      ],
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Amount charged in NZD.',
        position: 'sidebar',
        step: 0.01,
      },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'nzd',
      options: [{ label: 'NZD', value: 'nzd' }],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Offered', value: 'offered' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: {
        description:
          'Offer a waitlisted member a place by selecting Offered. Withdraw an unpaid offer by selecting Waitlisted or Cancelled.',
        position: 'sidebar',
      },
    },
    {
      name: 'offerVersion',
      type: 'number',
      defaultValue: 0,
      admin: { hidden: true },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'stripeInvoiceId',
      type: 'text',
      unique: true,
      admin: { readOnly: true, position: 'sidebar' },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'stripeInvoiceUrl',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'offeredAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'offerDueAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Invoice due date. Execs must withdraw unpaid offers manually.',
      },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'stripeCheckoutSessionId',
      label: 'Stripe Checkout Session ID',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stripePaymentIntentId',
      label: 'Stripe Payment Intent ID',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd MMM yyyy h:mm a',
        },
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
