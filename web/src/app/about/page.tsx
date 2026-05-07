import Hero from '@/components/Hero'

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="About Us"
        subtitle="Learn more about our mission and team"
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />
      <div className="p-8">{/* Content coming soon */}</div>
    </main>
  )
}
