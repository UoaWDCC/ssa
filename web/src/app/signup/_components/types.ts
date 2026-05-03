export const TOTAL_STEPS = 4

export type FormData = {
  firstName: string
  lastName: string
  email: string
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
  firstName: '',
  lastName: '',
  email: '',
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
