'use client'

import { useExecs } from '@/hooks/useExecs'

const SKELETON_KEYS = [
  'sk-1',
  'sk-2',
  'sk-3',
  'sk-4',
  'sk-5',
  'sk-6',
  'sk-7',
  'sk-8',
]
import ExecCard from './ExecCard'

export default function ExecGrid() {
  const { data: execs, isLoading, isError } = useExecs()

  return (
    <section className="px-8 sm:px-14 md:px-20 lg:px-[6.5rem] py-8 sm:py-10 md:py-12">
      <h2 className="font-averia font-bold text-ssa-red text-3xl sm:text-4xl md:text-5xl mb-10 sm:mb-12">
        Meet the SSA Team
      </h2>

      {isError && (
        <p className="text-ssa-black/50">
          Failed to load the team. Please try again later.
        </p>
      )}

      {/* Show empty card placeholders while loading */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {isLoading
          ? SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="aspect-square w-full rounded-xl bg-gray-200 animate-pulse"
              />
            ))
          : (execs ?? []).map((exec) => (
              <ExecCard
                key={exec.id}
                name={exec.name}
                role={exec.role}
                // Fall back to the mascot if no photo has been uploaded yet
                photo={exec.photo?.url ?? '/mascot.png'}
              />
            ))}
      </div>
    </section>
  )
}
