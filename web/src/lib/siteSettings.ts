import { fetchFromCMS } from '@/lib/api'

type SiteSettingsPayload = {
  homeJoinTitle?: string
  homeJoinParagraphs?: Array<{ content?: string | null }>
  aboutHeroTitle?: string
  aboutHeroSubtitle?: string
  aboutTeamTitle?: string
  aboutTeamParagraphs?: Array<{ content?: string | null }>
  eventsHeroTitle?: string
  eventsHeroSubtitle?: string
}

type SiteSettingsResult = {
  homeJoinTitle: string
  homeJoinParagraphs: string[]
  aboutHeroTitle: string
  aboutHeroSubtitle: string
  aboutTeamTitle: string
  aboutTeamParagraphs: string[]
  eventsHeroTitle: string
  eventsHeroSubtitle: string
}

const DEFAULT_SITE_SETTINGS: SiteSettingsResult = {
  homeJoinTitle: 'Join SSA',
  homeJoinParagraphs: [
    "The Singapore Students' Association (SSA) is run by a committee of students from The University of Auckland and Auckland University of Technology. We're a home away from home for anyone looking to be part of a friendly and welcoming community.",
    "Through social events, good food, and a shared love for Singaporean culture, we bring people together, whether you're from Singapore or simply keen to meet new people and get involved.",
  ],
  aboutHeroTitle: 'ABOUT US',
  aboutHeroSubtitle:
    'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
  aboutTeamTitle: 'Meet the SSA Team',
  aboutTeamParagraphs: [
    'We started off as a relatively small gathering of students years ago, for Singaporean and non-Singaporean students alike to find their “home away from home” during their time in University. Our club has since developed into a multicultural and diverse entity, and we organise cultural and social events to keep this spirit alive.',
    'As a committee members, we attend weekly committee meetings to plan and coordinate events with other fellow executives. We are a tight knit team and our aim is in upholding the SSA spirit and serving this community to the best of our ability.',
  ],
  eventsHeroTitle: 'EVENTS',
  eventsHeroSubtitle:
    'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
}

export async function fetchSiteSettings(): Promise<SiteSettingsResult> {
  try {
    const data = await fetchFromCMS<SiteSettingsPayload>(
      '/globals/site-settings',
    )

    return {
      homeJoinTitle: data.homeJoinTitle || DEFAULT_SITE_SETTINGS.homeJoinTitle,
      homeJoinParagraphs:
        data.homeJoinParagraphs
          ?.map((item) => item.content || '')
          .filter(Boolean) || DEFAULT_SITE_SETTINGS.homeJoinParagraphs,
      aboutHeroTitle:
        data.aboutHeroTitle || DEFAULT_SITE_SETTINGS.aboutHeroTitle,
      aboutHeroSubtitle:
        data.aboutHeroSubtitle || DEFAULT_SITE_SETTINGS.aboutHeroSubtitle,
      aboutTeamTitle:
        data.aboutTeamTitle || DEFAULT_SITE_SETTINGS.aboutTeamTitle,
      aboutTeamParagraphs:
        data.aboutTeamParagraphs
          ?.map((item) => item.content || '')
          .filter(Boolean) || DEFAULT_SITE_SETTINGS.aboutTeamParagraphs,
      eventsHeroTitle:
        data.eventsHeroTitle || DEFAULT_SITE_SETTINGS.eventsHeroTitle,
      eventsHeroSubtitle:
        data.eventsHeroSubtitle || DEFAULT_SITE_SETTINGS.eventsHeroSubtitle,
    }
  } catch (error) {
    console.error('Failed to fetch site settings from CMS:', error)
    return DEFAULT_SITE_SETTINGS
  }
}
