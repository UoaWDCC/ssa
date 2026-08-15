import { describe, expect, it } from 'vitest'

import { Sponsors } from '@/collections/Sponsors'

describe('Sponsors collection', () => {
  it('allows public read access', () => {
    expect(Sponsors.access?.read?.({ req: {} as never })).toBe(true)
  })
})
