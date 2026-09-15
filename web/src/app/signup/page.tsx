import { Suspense } from 'react'
import HeroSplit from '@/components/HeroSplit'
import SignupForm from './_components/SignupForm'

export default function SignupPage() {
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
        <SignupForm />
      </Suspense>
    </main>
  )
}
