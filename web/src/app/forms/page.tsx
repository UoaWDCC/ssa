import { Suspense } from 'react'
import Hero from '@/components/Hero'
import EventSignupForm from './components/EventSignUpForm'

export default function SignupPage() {
  return (
    <main>
      <Hero
        title="Join SSA"
        subtitle="Become a member of the Singapore Students' Association."
        mascotImage="/mascot.png"
      />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <EventSignupForm />
      </Suspense>
    </main>
  )
}
