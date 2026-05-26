import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import CardSection from '@/components/CardSection'

const YEAR_LABELS: Record<string, string> = {
  '1': 'Year 1',
  '2': 'Year 2',
  '3': 'Year 3',
  '4': 'Year 4',
  '5+': 'Year 5+',
  postgrad: 'Postgraduate',
}

const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  'non-binary': 'Non-binary',
  'prefer-not-to-say': 'Prefer not to say',
}

const ETHNICITY_LABELS: Record<string, string> = {
  chinese: 'Chinese',
  malay: 'Malay',
  indian: 'Indian',
  eurasian: 'Eurasian',
  other: 'Other',
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-ssa-black">
        {value ?? (
          <span className="text-ssa-black/30 italic">Not provided</span>
        )}
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }
  const labels: Record<string, string> = {
    active: 'Active',
    expired: 'Expired',
    pending: 'Pending',
  }
  const style = (status && styles[status]) ?? 'bg-gray-100 text-gray-600'
  const label = (status && labels[status]) ?? status ?? 'Unknown'

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  )
}

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/sign-in')

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || null

  return (
    <main className="min-h-screen bg-ssa-yellow-light px-4 pt-[88px] pb-16">
      <div className="mx-auto mt-8 w-full max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="font-averia font-bold text-3xl text-ssa-black">
            {fullName ?? user.email}
          </h1>
          <p className="text-sm text-ssa-black/50 mt-1">{user.email}</p>
        </div>

        <CardSection title="Membership">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
                Status
              </span>
              <StatusBadge status={user.membershipStatus} />
            </div>
            <Field
              label="Expiry Date"
              value={
                user.membershipExpiryDate
                  ? new Date(user.membershipExpiryDate).toLocaleDateString(
                      'en-NZ',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      },
                    )
                  : null
              }
            />
            <Field
              label="Role"
              value={
                user.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : null
              }
            />
            <Field
              label="Auth Provider"
              value={
                user.authProvider === 'google'
                  ? 'Google'
                  : user.authProvider === 'email'
                    ? 'Email & Password'
                    : null
              }
            />
          </div>
        </CardSection>

        <CardSection title="Personal Details">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={user.firstName} />
            <Field label="Last Name" value={user.lastName} />
            <Field label="Phone" value={user.phone} />
          </div>
        </CardSection>

        <CardSection title="University Info">
          <div className="grid grid-cols-2 gap-4">
            <Field label="UPI" value={user.upi} />
            <Field label="Student ID" value={user.studentId} />
            <Field label="Area of Study" value={user.areaOfStudy} />
            <Field
              label="Year of Study"
              value={
                user.yearOfUniversity
                  ? (YEAR_LABELS[user.yearOfUniversity] ??
                    user.yearOfUniversity)
                  : null
              }
            />
          </div>
        </CardSection>

        <CardSection title="Additional Info">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Gender"
              value={
                user.gender ? (GENDER_LABELS[user.gender] ?? user.gender) : null
              }
            />
            <Field
              label="Ethnicity"
              value={
                user.ethnicity
                  ? (ETHNICITY_LABELS[user.ethnicity] ?? user.ethnicity)
                  : null
              }
            />
            <Field
              label="Returning Member"
              value={
                user.returningMember === true
                  ? 'Yes'
                  : user.returningMember === false
                    ? 'No'
                    : null
              }
            />
          </div>
        </CardSection>
      </div>
    </main>
  )
}
