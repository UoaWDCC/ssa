import type { FormData } from './types'
import CardSection from '@/components/CardSection'
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
    <CardSection title="Contact Information">
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
        label="Email Address"
        required
        name="email"
        autoComplete="email"
        placeholder="hello@gmail.com"
        type="email"
        value={data.email}
        onChange={(v) => onChange('email', v)}
        error={fieldErrors.email}
      />
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
      <InputField
        label="Password"
        required
        name="password"
        autoComplete="new-password"
        placeholder="Min. 8 characters, include a letter and number"
        type="password"
        value={data.password}
        onChange={(v) => onChange('password', v)}
        error={fieldErrors.password}
      />
      <InputField
        label="Confirm Password"
        required
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Re-enter password"
        type="password"
        value={data.confirmPassword}
        onChange={(v) => onChange('confirmPassword', v)}
        error={fieldErrors.confirmPassword}
      />
    </CardSection>
  )
}
