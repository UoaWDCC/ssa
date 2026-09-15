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
  disabled,
  name,
  readOnly,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  error?: string
  autoComplete?: string
  disabled?: boolean
  name?: string
  readOnly?: boolean
}) {
  const id = useId()
  const errorId = useId()
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
        aria-describedby={error ? errorId : undefined}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        className="w-full rounded-[26px] px-4 py-3 text-sm text-gray-900 outline-none border border-ssa-grey/30 focus:border-ssa-red bg-ssa-background placeholder:text-ssa-grey/50"
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
