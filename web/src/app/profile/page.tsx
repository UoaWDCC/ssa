import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ProfileClient from './_components/ProfileClient'

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/sign-in')

  // Figma (1440px artboard): the column is a fixed 756px centred at left 342, and
  // Frame 851 puts a 32px gap between the header row and the card stack. The 24px
  // gap *between* cards lives on the stack itself, inside ProfileClient.
  return (
    <main className="min-h-screen bg-ssa-background px-4 pb-24 pt-[88px] sm:px-6">
      <div className="mx-auto mt-8 flex w-full max-w-[756px] flex-col gap-8">
        <ProfileClient user={user} />
      </div>
    </main>
  )
}
