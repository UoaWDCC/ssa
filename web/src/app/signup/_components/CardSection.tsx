export default function CardSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: '#ffe6b6' }}
    >
      <div>
        <h2 className="font-[family-name:var(--font-averia)] font-bold text-xl text-ssa-black">
          {title}
        </h2>
        <hr className="mt-2 border-ssa-red" />
      </div>
      {children}
    </div>
  )
}
