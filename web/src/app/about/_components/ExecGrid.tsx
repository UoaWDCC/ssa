import { execMembers } from './execData'
import ExecCard from './ExecCard'

export default function ExecGrid() {
  return (
    <section className="px-8 sm:px-14 md:px-20 lg:px-[6.5rem] py-8 sm:py-10 md:py-12">
      <h2 className="font-averia font-bold text-ssa-black text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
        Meet the SSA Team
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {execMembers.map((exec) => (
          <ExecCard
            key={exec.name}
            name={exec.name}
            role={exec.role}
            photo={exec.photo}
          />
        ))}
      </div>
    </section>
  )
}
