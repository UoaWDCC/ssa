import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ProfileClient from './_components/ProfileClient'

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/sign-in')

  // Figma (1440px artboard): the column is a fixed 756px centred at left 342, and
  // the card stack (Frame 845) sits on a 24px gap.
  return (
    <main className="min-h-screen bg-ssa-background px-4 pb-24 pt-[88px] sm:px-6">
      <div className="mx-auto mt-8 flex w-full max-w-[756px] flex-col gap-6">
        <ProfileClient user={user} />
      </div>
    </main>
  )
}
