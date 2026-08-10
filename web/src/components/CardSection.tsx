export default function CardSection({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" bg-ssa-yellow-light rounded-2xl p-6 md:p-8 flex flex-col gap-5 shadow-md">
      <div></div>
      {children}
    </div>
  )
}
