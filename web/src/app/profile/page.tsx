import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ProfileClient from './_components/ProfileClient'

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/sign-in')

  return (
    <main className="min-h-screen bg-ssa-yellow-light px-4 pt-[88px] pb-24">
      <div className="mx-auto mt-8 w-full max-w-2xl flex flex-col gap-6">
        <ProfileClient user={user} />
      </div>
    </main>
  )
}
