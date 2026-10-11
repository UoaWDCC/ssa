import { redirect } from 'next/navigation'

import { getSession } from '@/lib/session'
import RsvpContent from './_components/RsvpContent'

const GENDER_MAP: Record<string, string> = {
  male: 'man',
  female: 'woman',
  'non-binary': 'non-binary',
  'prefer-not-to-say': 'not-say',
}

export default async function RsvpPage() {
  const session = await getSession()

  if (!session?.userId) {
    redirect('/sign-in?next=%2Fevents%2Frsvp')
  }

  return (
    <RsvpContent
      member={{
        name: [session.firstName, session.lastName].filter(Boolean).join(' '),
        email: session.email,
        gender: GENDER_MAP[session.gender ?? ''] ?? '',
        universityYear:
          session.yearOfUniversity === 'postgrad'
            ? 'postgraduate'
            : (session.yearOfUniversity ?? ''),
      }}
    />
  )
}
