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
      type: 'date',
      required: true,
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
        { label: 'Social', value: 'social' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Academic', value: 'academic' },
        { label: 'Sports', value: 'sports' },
        { label: 'Other', value: 'other' },
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
