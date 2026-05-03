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
  autoComplete,
  name,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  error?: string
  autoComplete?: string
  name?: string
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
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        autoComplete={autoComplete}
        className="w-full rounded-lg px-3 py-2 text-sm text-gray-900 outline-none border border-transparent focus:border-ssa-red bg-white placeholder:text-gray-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
