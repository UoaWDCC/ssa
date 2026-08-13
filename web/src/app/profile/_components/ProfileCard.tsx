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
    <section className="flex flex-col gap-5 rounded-xl bg-ssa-card p-6 shadow-[0_1px_2px_0_rgba(140,136,128,0.2)] sm:p-8">
      <h2 className="font-be-vietnam-pro text-xl font-bold text-ssa-muted-taupe sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  )
}
