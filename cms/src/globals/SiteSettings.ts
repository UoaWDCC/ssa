import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home',
          fields: [
            {
              name: 'homeJoinTitle',
              type: 'text',
              label: 'Join SSA title',
              defaultValue: 'Join SSA',
            },
            {
              name: 'homeJoinParagraphs',
              type: 'array',
              label: 'Join SSA paragraphs',
              minRows: 1,
              maxRows: 2,
              defaultValue: [
                {
                  content:
                    "The Singapore Students' Association (SSA) is run by a committee of students from The University of Auckland and Auckland University of Technology. We're a home away from home for anyone looking to be part of a friendly and welcoming community.",
                },
                {
                  content:
                    "Through social events, good food, and a shared love for Singaporean culture, we bring people together, whether you're from Singapore or simply keen to meet new people and get involved.",
                },
              ],
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'aboutHeroTitle',
              type: 'text',
              label: 'Hero title',
              defaultValue: 'ABOUT US',
            },
            {
              name: 'aboutHeroSubtitle',
              type: 'textarea',
              label: 'Hero subtitle',
              defaultValue:
                'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
            },
            {
              name: 'aboutTeamTitle',
              type: 'text',
              label: 'Team heading',
              defaultValue: 'Meet the SSA Team',
            },
            {
              name: 'aboutTeamParagraphs',
              type: 'array',
              label: 'Team paragraphs',
              minRows: 1,
              maxRows: 2,
              defaultValue: [
                {
                  content:
                    'We started off as a relatively small gathering of students years ago, for Singaporean and non-Singaporean students alike to find their “home away from home” during their time in University. Our club has since developed into a multicultural and diverse entity, and we organise cultural and social events to keep this spirit alive.',
                },
                {
                  content:
                    'As a committee members, we attend weekly committee meetings to plan and coordinate events with other fellow executives. We are a tight knit team and our aim is in upholding the SSA spirit and serving this community to the best of our ability.',
                },
              ],
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Events',
          fields: [
            {
              name: 'eventsHeroTitle',
              type: 'text',
              label: 'Hero title',
              defaultValue: 'EVENTS',
            },
            {
              name: 'eventsHeroSubtitle',
              type: 'textarea',
              label: 'Hero subtitle',
              defaultValue:
                'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
            },
          ],
        },
      ],
    },
  ],
}
