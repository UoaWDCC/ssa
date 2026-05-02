'use client'

import { useId } from 'react'

export default function InputField({
  label,
  required,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  error?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ssa-black">
        {label}
        {required && <span className="text-ssa-red ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        className="w-full rounded-lg px-3 py-2 text-sm text-gray-900 outline-none border border-transparent focus:border-ssa-red bg-white placeholder:text-gray-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
