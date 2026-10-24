import type { FieldAccess } from 'payload'
import { describe, expect, it } from 'vitest'

import { Users } from '@/collections/Users'

const admin = { id: 1, collection: 'users', role: 'admin' }
const member = { id: 2, collection: 'users', role: 'member' }
const req = (user: unknown) => ({ req: { user } }) as never
const field = (name: string) =>
  Users.fields.find((f) => 'name' in f && f.name === name) as { access?: { update?: FieldAccess } }

describe('Users access', () => {
  it('limits create/delete to admins', () => {
    for (const op of ['create', 'delete'] as const) {
      expect(Users.access?.[op]?.(req(admin))).toBe(true)
      expect(Users.access?.[op]?.(req(member))).toBe(false)
      expect(Users.access?.[op]?.(req(null))).toBe(false)
    }
  })

  it('lets members read/update only themselves', () => {
    for (const op of ['read', 'update'] as const) {
      expect(Users.access?.[op]?.(req(admin))).toBe(true)
      expect(Users.access?.[op]?.(req(member))).toEqual({ id: { equals: 2 } })
      expect(Users.access?.[op]?.(req(null))).toBe(false)
    }
  })

  it('stops members changing role or membership', () => {
    for (const name of ['role', 'membershipStatus', 'membershipExpiryDate']) {
      expect(field(name).access?.update?.(req(admin))).toBe(true)
      expect(field(name).access?.update?.(req(member))).toBe(false)
    }
  })

  it('keeps admin panel admin-only', () => {
    expect(Users.access?.admin?.(req(admin))).toBe(true)
    expect(Users.access?.admin?.(req(member))).toBe(false)
  })
})
