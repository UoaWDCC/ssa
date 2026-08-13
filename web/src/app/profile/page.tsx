import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ProfileClient from './_components/ProfileClient'

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/sign-in')

  // Figma runs the card column at ~60% of the page width with the cards a hair
  // over 3.4% of that apart, which lands on max-w-3xl and `gap-6` at desktop.
  return (
    <main className="min-h-screen bg-ssa-background px-4 pb-24 pt-[88px] sm:px-6">
      <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-6">
        <ProfileClient user={user} />
      </div>
    </main>
  )
}
