import Button from '@/components/Button'

// TEMPORARY preview route for verifying the Button component — delete before finishing.
export default function ButtonPreviewPage() {
  return (
    <main className="min-h-screen space-y-12 p-12">
      <section className="space-y-6 rounded-3xl bg-ssa-red p-10">
        <h2 className="font-averia text-2xl font-bold text-ssa-white">
          On red background — light variant (hover: fills red, text white, arrow
          swaps)
        </h2>
        <div className="flex flex-wrap items-center gap-8">
          <Button variant="light">JOIN SSA!</Button>
          <Button variant="light" arrowSide="left">
            Arrow starts left
          </Button>
        </div>
        <div className="max-w-md">
          <Button href="/" variant="light" size="long">
            Long light CTA
          </Button>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl bg-ssa-yellow-light p-10">
        <h2 className="font-averia text-2xl font-bold text-ssa-red">
          On light background — filled / outline
        </h2>
        <div className="flex flex-wrap items-center gap-8">
          <Button variant="filled" color="red">
            JOIN SSA!
          </Button>
          <Button variant="filled" color="yellow">
            Yellow
          </Button>
          <Button variant="filled" color="skin">
            Skin
          </Button>
          <Button variant="outline" color="red">
            Outline
          </Button>
        </div>
        <div className="max-w-md space-y-5">
          <Button variant="filled" color="red" size="long">
            Long filled CTA
          </Button>
          <Button variant="filled" color="red" size="long" arrow={false}>
            No arrow
          </Button>
        </div>
      </section>
    </main>
  )
}
