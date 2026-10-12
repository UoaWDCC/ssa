import { Suspense } from 'react'
import HeroSplit from '@/components/HeroSplit'
import SignupForm from './_components/SignupForm'

// Render per request: the CMS isn't reachable during the Docker build.
export const dynamic = 'force-dynamic'

async function getMembershipPrice() {
  const cmsUrl = process.env.CMS_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(`${cmsUrl}/stripe/checkout`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const { amount } = (await res.json()) as { amount?: number }
    return typeof amount === 'number' ? amount : null
  } catch {
    return null
  }
}

export default async function SignupPage() {
  const price = await getMembershipPrice()

  return (
    <main className="min-h-screen bg-ssa-background">
      <HeroSplit
        title="Join SSA"
        subtitle="Become a member of the Singapore Students' Association."
      />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <SignupForm price={price} />
      </Suspense>
    </main>
  )
}
