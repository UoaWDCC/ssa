import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Join SSA title',
      defaultValue: 'Join SSA',
    },
    {
      name: 'paragraphs',
      type: 'array',
      label: 'Join SSA paragraphs',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
