import type { GlobalConfig } from 'payload'
import { DEFAULT_SITE_SETTINGS } from './siteSettingsDefaults'

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
              defaultValue: DEFAULT_SITE_SETTINGS.homeJoinTitle,
            },
            {
              name: 'homeJoinParagraphs',
              type: 'array',
              label: 'Join SSA paragraphs',
              minRows: 1,
              maxRows: 2,
              defaultValue: DEFAULT_SITE_SETTINGS.homeJoinParagraphs,
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
              defaultValue: DEFAULT_SITE_SETTINGS.aboutHeroTitle,
            },
            {
              name: 'aboutHeroSubtitle',
              type: 'textarea',
              label: 'Hero subtitle',
              defaultValue: DEFAULT_SITE_SETTINGS.aboutHeroSubtitle,
            },
            {
              name: 'aboutTeamTitle',
              type: 'text',
              label: 'Team heading',
              defaultValue: DEFAULT_SITE_SETTINGS.aboutTeamTitle,
            },
            {
              name: 'aboutTeamParagraphs',
              type: 'array',
              label: 'Team paragraphs',
              minRows: 1,
              maxRows: 2,
              defaultValue: DEFAULT_SITE_SETTINGS.aboutTeamParagraphs,
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
              defaultValue: DEFAULT_SITE_SETTINGS.eventsHeroTitle,
            },
            {
              name: 'eventsHeroSubtitle',
              type: 'textarea',
              label: 'Hero subtitle',
              defaultValue: DEFAULT_SITE_SETTINGS.eventsHeroSubtitle,
            },
          ],
        },
      ],
    },
  ],
}
