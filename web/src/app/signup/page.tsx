import { Suspense } from 'react'
import HeroSplit from '@/components/HeroSplit'
import SignupForm from './_components/SignupForm'

export default function SignupPage() {
  return (
    <main>
      <HeroSplit
        title="Join SSA"
        subtitle="Become a member of the Singapore Students' Association."
      />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-ssa-background">
            Loading...
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </main>
  )
}
