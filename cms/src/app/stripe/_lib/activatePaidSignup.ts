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
  status?: string | null
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

function buildUserData(member: MemberWithSignupPassword, stripeCustomerId?: null | string) {
  const fallbackName = splitName(member.name)
  return {
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
}

type UserData = ReturnType<typeof buildUserData>

async function updateUserByEmail(payload: Payload, email: string, data: UserData) {
  const found = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { email: { equals: email } },
  })
  if (found.docs.length > 0) {
    await payload.update({ collection: 'users', id: found.docs[0].id, overrideAccess: true, data })
  }
}

async function upsertUser(payload: Payload, member: MemberWithSignupPassword, userData: UserData) {
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { email: { equals: member.email } },
  })

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: userData,
    })
    return
  }

  if (!member.encryptedSignupPassword) {
    throw new Error('Paid member is missing encrypted signup password')
  }

  try {
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
  } catch (err: unknown) {
    const msg = (err instanceof Error ? err.message : '').toLowerCase()
    if (msg.includes('duplicate') || msg.includes('unique')) {
      await updateUserByEmail(payload, member.email, userData)
    } else {
      throw err
    }
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

  if (member.status === 'active') return

  const userData = buildUserData(member, stripeCustomerId)
  await upsertUser(payload, member, userData)

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
