export const TOTAL_STEPS = 5

export type FormData = {
  authProvider: 'email' | 'google'
  firstName: string
  lastName: string
  email: string
  googleSub: string
  phone: string
  password: string
  confirmPassword: string
  upi: string
  studentId: string
  areaOfStudy: string
  yearOfUniversity: string
  gender: string
  ethnicity: string
  returningMember: string
}

export const initialFormData: FormData = {
  authProvider: 'email',
  firstName: '',
  lastName: '',
  email: '',
  googleSub: '',
  phone: '',
  password: '',
  confirmPassword: '',
  upi: '',
  studentId: '',
  areaOfStudy: '',
  yearOfUniversity: '',
  gender: '',
  ethnicity: '',
  returningMember: '',
}
