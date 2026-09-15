import type { FormData } from './types'
import InputField from '@/components/InputField'

export default function ContactStep({
  data,
  onChange,
  fieldErrors,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="First Name"
          required
          name="firstName"
          autoComplete="given-name"
          placeholder="Enter Name here"
          value={data.firstName}
          onChange={(v) => onChange('firstName', v)}
          error={fieldErrors.firstName}
        />
        <InputField
          label="Last Name"
          required
          name="lastName"
          autoComplete="family-name"
          placeholder="Enter Last Name here"
          value={data.lastName}
          onChange={(v) => onChange('lastName', v)}
          error={fieldErrors.lastName}
        />
      </div>
      <InputField
        label="Phone Number"
        required
        name="phone"
        autoComplete="tel"
        placeholder="+64 21 000 0000"
        type="tel"
        value={data.phone}
        onChange={(v) => onChange('phone', v)}
        error={fieldErrors.phone}
      />
    </div>
  )
}
