import { fetchFromCMS } from '@/lib/api'

type HomePagePayload = {
  title?: string
  paragraphs?: Array<{ content?: string | null }>
}

export async function fetchHomePageContent() {
  try {
    const data = await fetchFromCMS<HomePagePayload>('/globals/home-page')

    return {
      title: data.title || 'Join SSA',
      paragraphs: data.paragraphs
        ?.map((item) => item.content || '')
        .filter(Boolean) || [
        "The Singapore Students' Association (SSA) is run by a committee of students from The University of Auckland and Auckland University of Technology. We're a home away from home for anyone looking to be part of a friendly and welcoming community.",
        "Through social events, good food, and a shared love for Singaporean culture, we bring people together, whether you're from Singapore or simply keen to meet new people and get involved.",
      ],
    }
  } catch {
    return {
      title: 'Join SSA',
      paragraphs: [
        "The Singapore Students' Association (SSA) is run by a committee of students from The University of Auckland and Auckland University of Technology. We're a home away from home for anyone looking to be part of a friendly and welcoming community.",
        "Through social events, good food, and a shared love for Singaporean culture, we bring people together, whether you're from Singapore or simply keen to meet new people and get involved.",
      ],
    }
  }
}
