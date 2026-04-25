import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'websiteURL',
      type: 'text',
    },
    {
      name: 'isSponsorOfTheWeek',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'description',
      type: 'textarea',
    }
  ]
}