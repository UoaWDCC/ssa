export default function CardSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-ssa-yellow rounded-2xl p-6 md:p-8 flex flex-col gap-5">
      <div>
        <h2 className="font-averia font-bold text-xl md:text-2xl lg:text-3xl text-ssa-black">
          {title}
        </h2>
        <hr className="mt-2 border-ssa-red" />
      </div>
      {children}
    </div>
  )
}
