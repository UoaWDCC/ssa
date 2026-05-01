import type { FormData } from './types'
import CardSection from './CardSection'
import SelectField from './SelectField'

export default function AdditionalInfoStep({
  data,
  onChange,
  fieldErrors,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <CardSection title="Additional Information">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Gender"
          required
          value={data.gender}
          onChange={(v) => onChange('gender', v)}
          error={fieldErrors.gender}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'non-binary', label: 'Non-binary' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ]}
        />
        <SelectField
          label="Ethnicity"
          required
          value={data.ethnicity}
          onChange={(v) => onChange('ethnicity', v)}
          error={fieldErrors.ethnicity}
          options={[
            { value: 'chinese', label: 'Chinese' },
            { value: 'malay', label: 'Malay' },
            { value: 'indian', label: 'Indian' },
            { value: 'eurasian', label: 'Eurasian' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>
      <SelectField
        label="Are you a returning SSA Member?"
        required
        value={data.returningMember}
        onChange={(v) => onChange('returningMember', v)}
        error={fieldErrors.returningMember}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />
    </CardSection>
  )
}
