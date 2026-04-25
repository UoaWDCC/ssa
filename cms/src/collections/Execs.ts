import type { CollectionConfig } from 'payload'

export const Execs: CollectionConfig = {
  slug: 'execs',
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
      name: 'role',
      type: 'text',
      required: true
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'year',
      type: 'number',
    }
  ]
}