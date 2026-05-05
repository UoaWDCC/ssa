import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero
        title="Singapore Students' Association"
        subtitle="A home for people from the Little Red Dot."
        mascotImage="/mascot.png"
      />
      <Footer />
    </main>
  )
}
