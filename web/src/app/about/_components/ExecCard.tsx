'use client'

import { useState } from 'react'
import Image from 'next/image'

// TODO: Confirm with design whether tapping a tile on mobile should trigger the hover overlay.

interface ExecCardProps {
  name: string
  role: string
  photo: string
}

export default function ExecCard({
  name,
  role,
  photo,
}: Readonly<ExecCardProps>) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div
      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group select-none transition-all duration-300 ring-[3px] hover:ring-4 hover:ring-ssa-red focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ssa-red ${
        isActive ? 'ring-4 ring-ssa-red' : 'ring-ssa-red-lighter'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`${name}, ${role}`}
      aria-pressed={isActive}
      onClick={() => setIsActive((v) => !v)}
      onMouseLeave={() => setIsActive(false)}
      onKeyDown={(e) => {
        if (e.repeat) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsActive((v) => !v)
        }
      }}
    >
      <Image
        src={photo}
        alt={`${name}, ${role}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-black/60 flex flex-col justify-end pb-6 pl-5 pr-3 pt-3 sm:pb-8 sm:pl-6 transition-opacity duration-500 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <p className="font-averia font-bold text-lg sm:text-xl md:text-2xl text-ssa-red leading-snug">
          {name}
        </p>
        <p className="font-averia font-bold text-lg sm:text-xl md:text-2xl text-white uppercase leading-snug tracking-wide">
          {role}
        </p>
      </div>
    </div>
  )
}
