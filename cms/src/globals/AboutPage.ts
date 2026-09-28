import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Hero title',
      defaultValue: 'ABOUT US',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Hero subtitle',
      defaultValue:
        'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
    },
    {
      name: 'teamTitle',
      type: 'text',
      label: 'Team heading',
      defaultValue: 'Meet the SSA Team',
    },
    {
      name: 'teamParagraphs',
      type: 'array',
      label: 'Team paragraphs',
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
