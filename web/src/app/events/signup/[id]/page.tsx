import Hero from '@/components/Hero'
import EventSignupForm from './components/EventSignUpForm'
import { fetchPayloadForm } from '@/lib/payload-form'

interface EventSignupPageProps {
  params: { id: string }
}

export default async function EventSignupPage({
  params,
}: EventSignupPageProps) {
  const form = await fetchPayloadForm(params.id)

  return (
    <main>
      <Hero
        title="Join SSA"
        subtitle="Become a member of the Singapore Students' Association."
        mascotImage="/mascot.png"
      />
      <EventSignupForm form={form} />
    </main>
  )
}
