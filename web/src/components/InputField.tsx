'use client'

import { useId } from 'react'

type InputFieldVariant = 'default' | 'sign-in'

type InputFieldProps = Readonly<{
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
  error?: string
  autoComplete?: string
  disabled?: boolean
  name?: string
  readOnly?: boolean
  variant?: InputFieldVariant
}>

const variantClasses: Record<
  InputFieldVariant,
  { container: string; label: string; input: string }
> = {
  default: {
    container: 'gap-1',
    label: 'text-sm font-medium text-ssa-black',
    input:
      'rounded-[26px] border border-ssa-grey/30 bg-ssa-background px-4 py-3 text-sm text-gray-900 placeholder:text-ssa-grey/50 focus:border-ssa-red',
  },
  'sign-in': {
    container: 'gap-2',
    label: 'font-inter text-base font-normal leading-6 text-ssa-grey',
    input:
      'h-11 rounded-full border-[0.8px] border-ssa-grey/30 bg-ssa-background px-5 font-inter text-base font-normal text-ssa-grey placeholder:text-ssa-muted-grey/50 focus:border-ssa-red focus:ring-1 focus:ring-ssa-red',
  },
}

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
  variant = 'default',
}: InputFieldProps) {
  const id = useId()
  const errorId = useId()
  const classes = variantClasses[variant]

  return (
    <div className={`flex flex-col ${classes.container}`}>
      <label htmlFor={id} className={classes.label}>
        {label}
        {required && <span className="ml-0.5 text-ssa-red">*</span>}
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
        className={`w-full outline-none transition-colors ${classes.input}`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
