import Hero from '@/components/Hero'
import InstagramFeed from '@/components/InstagramFeed'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="flex flex-col bg-ssa-yellow-light pb-16 md:pb-24">
      <Hero
        variant="fullscreen"
        title="Singapore Students' Association"
        subtitle="A home for people from the Little Red Dot."
        mascotImage="/ssa_merlion_full_body.svg"
        mascotAlt="SSA Merlion mascot"
      />
      <InstagramFeed />
      <Footer />
    </main>
  )
}