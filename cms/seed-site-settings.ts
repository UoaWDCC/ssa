import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

void (async () => {
  const payload = await getPayload({ config })

  const data = {
    homeJoinTitle: 'Join SSA',
    homeJoinParagraphs: [
      {
        content:
          "The Singapore Students' Association (SSA) is run by a committee of students from The University of Auckland and Auckland University of Technology. We're a home away from home for anyone looking to be part of a friendly and welcoming community.",
      },
      {
        content:
          "Through social events, good food, and a shared love for Singaporean culture, we bring people together, whether you're from Singapore or simply keen to meet new people and get involved.",
      },
    ],
    aboutHeroTitle: 'ABOUT US',
    aboutHeroSubtitle:
      'We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)',
    aboutTeamTitle: 'Meet the SSA Team',
    aboutTeamParagraphs: [
      {
        content:
          'We started off as a relatively small gathering of students years ago, for Singaporean and non-Singaporean students alike to find their “home away from home” during their time in University. Our club has since developed into a multicultural and diverse entity, and we organise cultural and social events to keep this spirit alive.',
      },
      {
        content:
          'As a committee members, we attend weekly committee meetings to plan and coordinate events with other fellow executives. We are a tight knit team and our aim is in upholding the SSA spirit and serving this community to the best of our ability.',
      },
    ],
    eventsHeroTitle: 'EVENTS',
    eventsHeroSubtitle:
      'Join us for exciting events, cultural celebrations, and community gatherings throughout the year.',
  }

  await payload.updateGlobal({ slug: 'site-settings', data })
  console.log('UPDATED site-settings global row with current default content')

  const saved = await payload.findGlobal({ slug: 'site-settings' })
  console.log(JSON.stringify(saved, null, 2))
})()
