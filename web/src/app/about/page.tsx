import Hero from '@/components/Hero'
import ExecGrid from './_components/ExecGrid'

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="About Us"
        subtitle="Learn more about our mission and team"
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />
      <ExecGrid />
    </main>
  )
}
