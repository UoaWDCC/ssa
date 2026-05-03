'use client'

import { useId } from 'react'

export default function SelectField({
  label,
  required,
  placeholder,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  const id = useId()
  const errorId = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ssa-black">
        {label}
        {required && <span className="text-ssa-red ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg px-3 py-2 pr-8 text-sm outline-none border border-transparent focus:border-ssa-red bg-white appearance-none ${value ? 'text-ssa-black' : 'text-gray-400'}`}
        >
          <option value="" disabled hidden>
            {placeholder ?? 'Select an option'}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
