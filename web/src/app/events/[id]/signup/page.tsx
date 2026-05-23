import Hero from '@/components/Hero'
import EventSignupForm from '../signup/components/EventSignUpForm'
import { fetchPayloadForm } from '@/lib/payload-form'

interface EventSignupPageProps {
  params: { id: string }
}

export default async function EventSignupPage({
  params,
}: EventSignupPageProps) {
  const { id } = await params
  console.log('event id:', id)
  const form = await fetchPayloadForm(id)
  console.log('Fetched form:', form)

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
