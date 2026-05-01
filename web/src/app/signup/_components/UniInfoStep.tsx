import type { FormData } from './types'
import CardSection from './CardSection'
import InputField from './InputField'
import SelectField from './SelectField'

export default function UniInfoStep({
  data,
  onChange,
  fieldErrors,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <CardSection title="University Information">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="UPI"
          required
          placeholder="abcd123"
          value={data.upi}
          onChange={(v) => onChange('upi', v)}
          error={fieldErrors.upi}
        />
        <InputField
          label="Student ID"
          required
          placeholder="00000000"
          value={data.studentId}
          onChange={(v) => onChange('studentId', v)}
          error={fieldErrors.studentId}
        />
      </div>
      <InputField
        label="What is your Area of Study"
        required
        placeholder="Enter Degree(s) here"
        value={data.areaOfStudy}
        onChange={(v) => onChange('areaOfStudy', v)}
        error={fieldErrors.areaOfStudy}
      />
      <SelectField
        label="What Year of University are you in?"
        required
        value={data.yearOfUniversity}
        onChange={(v) => onChange('yearOfUniversity', v)}
        error={fieldErrors.yearOfUniversity}
        options={[
          { value: '1', label: 'Year 1' },
          { value: '2', label: 'Year 2' },
          { value: '3', label: 'Year 3' },
          { value: '4', label: 'Year 4' },
          { value: '5+', label: 'Year 5+' },
          { value: 'postgrad', label: 'Postgraduate' },
        ]}
      />
    </CardSection>
  )
}
