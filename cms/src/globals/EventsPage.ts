import type { GlobalConfig } from 'payload'

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  label: 'Events Page',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Hero title',
      defaultValue: 'EVENTS',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Hero subtitle',
      defaultValue:
        'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
    },
  ],
}
