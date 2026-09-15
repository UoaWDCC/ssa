/**
 * One panel of the user info page (Figma: user page, node 5457-12171).
 *
 * Deliberately not the shared `CardSection` — that one is the signup/sign-in
 * treatment (`bg-ssa-yellow`, Averia heading, red rule under the title) and is
 * used by five other callers. The user page cards are the quieter variant: cream
 * fill, muted taupe heading, no rule, and a 2px shadow that barely lifts them off
 * the background.
 */
export default function ProfileCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5 rounded-xl bg-ssa-card p-6 shadow-[0_2.67px_6.93px_0_rgba(255,255,255,0.2),0_2px_2.67px_0.67px_rgba(84,84,84,0.1)] sm:p-9">
      {/* Figma "BVP - Topic Headers" — the same 24/32/-1px style as the page title. */}
      <h2 className="font-be-vietnam-pro text-2xl font-bold leading-8 tracking-[-1px] text-ssa-muted-taupe">
        {title}
      </h2>
      {children}
    </section>
  )
}
