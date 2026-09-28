import { fetchFromCMS } from '@/lib/api'

type AboutPagePayload = {
  heroTitle?: string
  heroSubtitle?: string
  teamTitle?: string
  teamParagraphs?: Array<{ content?: string | null }>
}

export async function fetchAboutPageContent() {
  try {
    const data = await fetchFromCMS<AboutPagePayload>('/globals/about-page')

    return {
      heroTitle: data.heroTitle || 'ABOUT US',
      heroSubtitle:
        data.heroSubtitle ||
        'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
      teamTitle: data.teamTitle || 'Meet the SSA Team',
      teamParagraphs: data.teamParagraphs
        ?.map((item) => item.content || '')
        .filter(Boolean) || [
        'We started off as a relatively small gathering of students years ago, for Singaporean and non-Singaporean students alike to find their “home away from home” during their time in University. Our club has since developed into a multicultural and diverse entity, and we organise cultural and social events to keep this spirit alive.',
        'As a committee members, we attend weekly committee meetings to plan and coordinate events with other fellow executives. We are a tight knit team and our aim is in upholding the SSA spirit and serving this community to the best of our ability.',
      ],
    }
  } catch {
    return {
      heroTitle: 'ABOUT US',
      heroSubtitle:
        'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
      teamTitle: 'Meet the SSA Team',
      teamParagraphs: [
        'We started off as a relatively small gathering of students years ago, for Singaporean and non-Singaporean students alike to find their “home away from home” during their time in University. Our club has since developed into a multicultural and diverse entity, and we organise cultural and social events to keep this spirit alive.',
        'As a committee members, we attend weekly committee meetings to plan and coordinate events with other fellow executives. We are a tight knit team and our aim is in upholding the SSA spirit and serving this community to the best of our ability.',
      ],
    }
  }
}
