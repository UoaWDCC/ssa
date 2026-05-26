import Hero from '@/components/Hero'
import EventSignupForm from '../signup/components/EventSignUpForm'
import { fetchPayloadForm } from '@/lib/payload-form'
import { fetchEvent } from '@/lib/events'

interface EventSignupPageProps {
  params: { id: string }
}

export default async function EventSignupPage({
  params,
}: EventSignupPageProps) {
  const { id } = await params
  const form = await fetchPayloadForm(id)
  const event = await fetchEvent(id)
  console.log('Fetched event:', event)

  if (!event) {
    return
  }

  return (
    <main>
      <Hero
        title="Join SSA"
        subtitle="Become a member of the Singapore Students' Association."
        mascotImage="/mascot.png"
      />
      <EventSignupForm form={form} event={event} />
    </main>
  )
}
