'use client'

import { useEffect, useState } from 'react'
import CardSection from '@/components/CardSection'
import {
  FiAlertTriangle,
  FiCheck,
  FiEdit2,
  FiSave,
  FiTrash2,
  FiX,
} from 'react-icons/fi'
import type { SessionUser } from '@/lib/session'

// ─── types ────────────────────────────────────────────────────────────────────

type ProfileForm = {
  firstName: string
  lastName: string
  phone: string
  upi: string
  studentId: string
  areaOfStudy: string
  yearOfUniversity: string
  gender: string
  ethnicity: string
  returningMember: boolean
}

type ToastState = { type: 'success' | 'error'; message: string }
type DialogKind = 'save' | 'delete'

// ─── constants ────────────────────────────────────────────────────────────────

const YEAR_OPTIONS = [
  { value: '1', label: 'Year 1' },
  { value: '2', label: 'Year 2' },
  { value: '3', label: 'Year 3' },
  { value: '4', label: 'Year 4' },
  { value: '5+', label: 'Year 5+' },
  { value: 'postgrad', label: 'Postgraduate' },
]

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

const ETHNICITY_OPTIONS = [
  { value: 'chinese', label: 'Chinese' },
  { value: 'malay', label: 'Malay' },
  { value: 'indian', label: 'Indian' },
  { value: 'eurasian', label: 'Eurasian' },
  { value: 'other', label: 'Other' },
]

const YEAR_LABELS: Record<string, string> = Object.fromEntries(
  YEAR_OPTIONS.map(({ value, label }) => [value, label]),
)
const GENDER_LABELS: Record<string, string> = Object.fromEntries(
  GENDER_OPTIONS.map(({ value, label }) => [value, label]),
)
const ETHNICITY_LABELS: Record<string, string> = Object.fromEntries(
  ETHNICITY_OPTIONS.map(({ value, label }) => [value, label]),
)

// ─── small read-only field ─────────────────────────────────────────────────────

function ViewField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-ssa-black">
        {value ?? (
          <span className="italic text-ssa-black/30">Not provided</span>
        )}
      </span>
    </div>
  )
}

// ─── inline editable field components ─────────────────────────────────────────

const inputCls =
  'w-full rounded-lg px-3 py-2 text-sm text-ssa-black bg-white border border-ssa-red/40 focus:border-ssa-red outline-none transition-colors'

function EditText({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  )
}

function EditSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} appearance-none pr-8 ${value ? 'text-ssa-black' : 'text-gray-400'}`}
        >
          <option value="">Not provided</option>
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
    </div>
  )
}

function EditToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ssa-red focus:ring-offset-1 ${
          value ? 'bg-ssa-red' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

// ─── status badge (membership — not editable) ─────────────────────────────────

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
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        (status && styles[status]) ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {(status && labels[status]) ?? status ?? 'Unknown'}
    </span>
  )
}

// ─── toast ────────────────────────────────────────────────────────────────────

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState
  onDismiss: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  const isSuccess = toast.type === 'success'
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 shadow-xl transition-all duration-300 ${
        isSuccess ? 'bg-green-600 text-white' : 'bg-ssa-red text-white'
      }`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
        {isSuccess ? (
          <FiCheck className="h-4 w-4" />
        ) : (
          <FiX className="h-4 w-4" />
        )}
      </span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-1 rounded-lg p-1 hover:bg-white/20 transition-colors"
      >
        <FiX className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── confirmation dialog ──────────────────────────────────────────────────────

function ConfirmDialog({
  kind,
  loading,
  onConfirm,
  onCancel,
}: {
  kind: DialogKind
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const isSave = kind === 'save'
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        aria-label="Close dialog"
        onClick={onCancel}
        tabIndex={-1}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* icon */}
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isSave ? 'bg-ssa-red/10' : 'bg-red-100'
          }`}
        >
          {isSave ? (
            <FiSave className="h-7 w-7 text-ssa-red" />
          ) : (
            <FiAlertTriangle className="h-7 w-7 text-red-600" />
          )}
        </div>

        <h2 className="text-center font-averia font-bold text-xl text-ssa-black">
          {isSave ? 'Save Changes' : 'Delete Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-ssa-black/60">
          {isSave
            ? 'Are you sure you want to save these changes to your profile?'
            : 'This will permanently delete your account and all associated data. This action cannot be undone.'}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60 ${
              isSave
                ? 'bg-ssa-red hover:opacity-90'
                : 'bg-red-600 hover:opacity-90'
            }`}
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading
              ? 'Please wait…'
              : isSave
                ? 'Save Changes'
                : 'Delete Account'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-full border-2 border-ssa-black/20 py-2.5 text-sm font-semibold text-ssa-black transition-colors hover:border-ssa-black/40 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

function userToForm(user: SessionUser): ProfileForm {
  return {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phone: user.phone ?? '',
    upi: user.upi ?? '',
    studentId: user.studentId ?? '',
    areaOfStudy: user.areaOfStudy ?? '',
    yearOfUniversity: user.yearOfUniversity ?? '',
    gender: user.gender ?? '',
    ethnicity: user.ethnicity ?? '',
    returningMember: user.returningMember ?? false,
  }
}

export default function ProfileClient({
  user,
}: Readonly<{ user: SessionUser }>) {
  const [baseUser, setBaseUser] = useState<SessionUser>(user)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<ProfileForm>(() => userToForm(user))
  const [dialog, setDialog] = useState<DialogKind | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const showToast = (type: ToastState['type'], message: string) =>
    setToast({ type, message })

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  function cancelEdit() {
    setForm(userToForm(baseUser))
    setIsEditing(false)
  }

  async function confirmSave() {
    setDialogLoading(true)
    try {
      const patch: Record<string, unknown> = {}
      const stringFields = [
        'firstName',
        'lastName',
        'phone',
        'upi',
        'studentId',
        'areaOfStudy',
        'yearOfUniversity',
        'gender',
        'ethnicity',
      ] as const
      for (const key of stringFields) {
        const next = form[key] || null
        const prev = baseUser[key] ?? null
        if (next !== prev) patch[key] = next
      }
      const prevReturning = baseUser.returningMember ?? false
      if (form.returningMember !== prevReturning)
        patch.returningMember = form.returningMember

      if (Object.keys(patch).length === 0) {
        setDialog(null)
        setIsEditing(false)
        return
      }

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error('Failed')
      const { user: saved } = (await res.json()) as { user: SessionUser }
      setBaseUser(saved)
      setForm(userToForm(saved))
      setDialog(null)
      setIsEditing(false)
      showToast('success', 'Your profile has been updated.')
    } catch {
      setDialog(null)
      showToast('error', 'Something went wrong. Please try again.')
    } finally {
      setDialogLoading(false)
    }
  }

  async function confirmDelete() {
    setDialogLoading(true)
    try {
      const res = await fetch('/api/auth/me', { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      globalThis.location.href = '/'
    } catch {
      setDialog(null)
      showToast('error', 'Something went wrong. Please try again.')
      setDialogLoading(false)
    }
  }

  const displayName =
    [form.firstName, form.lastName].filter(Boolean).join(' ') || user.email

  const E = isEditing

  return (
    <>
      {/* ── toast ── */}
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}

      {/* ── confirmation dialog ── */}
      {dialog && (
        <ConfirmDialog
          kind={dialog}
          loading={dialogLoading}
          onConfirm={dialog === 'save' ? confirmSave : confirmDelete}
          onCancel={() => setDialog(null)}
        />
      )}

      {/* ── header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-averia font-bold text-3xl text-ssa-black">
              {displayName}
            </h1>
            <button
              onClick={handleLogout}
              className="rounded border border-red-600 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Log out
            </button>
          </div>
          <p className="mt-1 text-sm text-ssa-black/50">{user.email}</p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => (isEditing ? cancelEdit() : setIsEditing(true))}
            aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isEditing
                ? 'bg-ssa-black text-white hover:bg-ssa-black/80'
                : 'bg-ssa-yellow hover:bg-ssa-yellow/70 text-ssa-black'
            }`}
          >
            {isEditing ? (
              <FiX className="h-4 w-4" />
            ) : (
              <FiEdit2 className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => setDialog('delete')}
            aria-label="Delete account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── membership (read-only) ── */}
      <CardSection title="Membership">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-ssa-black/50 uppercase tracking-wide">
              Status
            </span>
            <StatusBadge status={user.membershipStatus} />
          </div>
          <ViewField
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
          <ViewField
            label="Role"
            value={
              user.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : null
            }
          />
          <ViewField
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

      {/* ── personal details ── */}
      <CardSection title="Personal Details">
        <div className="grid grid-cols-2 gap-4">
          {E ? (
            <>
              <EditText
                label="First Name"
                value={form.firstName}
                onChange={(v) => set('firstName', v)}
              />
              <EditText
                label="Last Name"
                value={form.lastName}
                onChange={(v) => set('lastName', v)}
              />
              <EditText
                label="Phone"
                value={form.phone}
                onChange={(v) => set('phone', v)}
                type="tel"
              />
            </>
          ) : (
            <>
              <ViewField label="First Name" value={form.firstName} />
              <ViewField label="Last Name" value={form.lastName} />
              <ViewField label="Phone" value={form.phone} />
            </>
          )}
        </div>
      </CardSection>

      {/* ── university info ── */}
      <CardSection title="University Info">
        <div className="grid grid-cols-2 gap-4">
          {E ? (
            <>
              <EditText
                label="UPI"
                value={form.upi}
                onChange={(v) => set('upi', v)}
              />
              <EditText
                label="Student ID"
                value={form.studentId}
                onChange={(v) => set('studentId', v)}
              />
              <EditText
                label="Area of Study"
                value={form.areaOfStudy}
                onChange={(v) => set('areaOfStudy', v)}
              />
              <EditSelect
                label="Year of Study"
                value={form.yearOfUniversity}
                onChange={(v) => set('yearOfUniversity', v)}
                options={YEAR_OPTIONS}
              />
            </>
          ) : (
            <>
              <ViewField label="UPI" value={form.upi} />
              <ViewField label="Student ID" value={form.studentId} />
              <ViewField label="Area of Study" value={form.areaOfStudy} />
              <ViewField
                label="Year of Study"
                value={
                  form.yearOfUniversity
                    ? (YEAR_LABELS[form.yearOfUniversity] ??
                      form.yearOfUniversity)
                    : null
                }
              />
            </>
          )}
        </div>
      </CardSection>

      {/* ── additional info ── */}
      <CardSection title="Additional Info">
        <div className="grid grid-cols-2 gap-4">
          {E ? (
            <>
              <EditSelect
                label="Gender"
                value={form.gender}
                onChange={(v) => set('gender', v)}
                options={GENDER_OPTIONS}
              />
              <EditSelect
                label="Ethnicity"
                value={form.ethnicity}
                onChange={(v) => set('ethnicity', v)}
                options={ETHNICITY_OPTIONS}
              />
              <EditToggle
                label="Returning Member"
                value={form.returningMember}
                onChange={(v) => set('returningMember', v)}
              />
            </>
          ) : (
            <>
              <ViewField
                label="Gender"
                value={
                  form.gender
                    ? (GENDER_LABELS[form.gender] ?? form.gender)
                    : null
                }
              />
              <ViewField
                label="Ethnicity"
                value={
                  form.ethnicity
                    ? (ETHNICITY_LABELS[form.ethnicity] ?? form.ethnicity)
                    : null
                }
              />
              <ViewField
                label="Returning Member"
                value={
                  form.returningMember === true
                    ? 'Yes'
                    : form.returningMember === false
                      ? 'No'
                      : null
                }
              />
            </>
          )}
        </div>
      </CardSection>

      {/* ── save changes button ── */}
      {isEditing && (
        <div className="sticky bottom-6">
          <button
            onClick={() => setDialog('save')}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ssa-red py-3 text-base font-semibold text-white shadow-lg shadow-ssa-red/30 transition-opacity hover:opacity-90"
          >
            <FiSave className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      )}
    </>
  )
}
