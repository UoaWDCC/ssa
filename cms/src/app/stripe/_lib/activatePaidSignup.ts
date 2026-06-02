import type { Payload } from 'payload'

import { decryptSignupPassword } from './signupPassword'

type ActivatePaidSignupArgs = {
  memberId: number
  payload: Payload
  stripeCustomerId?: null | string
}

type MemberWithSignupPassword = {
  areaOfStudy?: null | string
  authProvider?: 'email' | 'google' | null
  email: string
  encryptedSignupPassword?: null | string
  ethnicity?: 'chinese' | 'eurasian' | 'indian' | 'malay' | 'other' | null
  firstName?: null | string
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | null
  googleSub?: null | string
  id: number
  lastName?: null | string
  membershipExpiryDate?: null | string
  name: string
  phone: string
  returningMember?: boolean | null
  studentId?: null | string
  upi?: null | string
  yearOfUniversity?: '1' | '2' | '3' | '4' | '5+' | 'postgrad' | null
}

function splitName(name: string) {
  const [firstName, ...rest] = name.trim().split(/\s+/)

  return {
    firstName: firstName || undefined,
    lastName: rest.join(' ') || undefined,
  }
}

export async function activatePaidSignup({
  memberId,
  payload,
  stripeCustomerId,
}: ActivatePaidSignupArgs) {
  const member = (await payload.findByID({
    collection: 'members',
    id: memberId,
    overrideAccess: true,
    showHiddenFields: true,
  })) as MemberWithSignupPassword

  if ((member as { status?: string }).status === 'active') return

  const existingUser = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      email: {
        equals: member.email,
      },
    },
  })

  const fallbackName = splitName(member.name)
  const userData = {
    name: member.name,
    authProvider: member.authProvider || 'email',
    googleSub: member.googleSub,
    firstName: member.firstName || fallbackName.firstName,
    lastName: member.lastName || fallbackName.lastName,
    phone: member.phone,
    membershipStatus: 'active' as const,
    membershipExpiryDate: member.membershipExpiryDate,
    stripeCustomerId,
    upi: member.upi,
    studentId: member.studentId,
    areaOfStudy: member.areaOfStudy,
    yearOfUniversity: member.yearOfUniversity,
    gender: member.gender,
    ethnicity: member.ethnicity,
    returningMember: member.returningMember ?? false,
  }

  if (existingUser.docs.length === 0) {
    if (!member.encryptedSignupPassword) {
      throw new Error('Paid member is missing encrypted signup password')
    }

    await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email: member.email,
        password: decryptSignupPassword(member.encryptedSignupPassword),
        role: 'member',
        ...userData,
      },
    })
  } else {
    await payload.update({
      collection: 'users',
      id: existingUser.docs[0].id,
      overrideAccess: true,
      data: userData,
    })
  }

  await payload.update({
    collection: 'members',
    id: memberId,
    overrideAccess: true,
    data: {
      status: 'active',
      encryptedSignupPassword: null,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    },
  })
}
