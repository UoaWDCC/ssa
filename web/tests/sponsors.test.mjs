import assert from 'node:assert/strict'
import test from 'node:test'

import { getSponsorLogoUrl } from '../src/lib/sponsors.ts'

test('uses the CMS url when a sponsor logo is an uploaded media record', () => {
  assert.equal(
    getSponsorLogoUrl({
      id: 42,
      alt: 'A sponsor logo',
      url: 'https://cdn.example.com/logo.png',
      width: 400,
      height: 400,
    }),
    'https://cdn.example.com/logo.png',
  )
})

test('falls back to the local placeholder when the sponsor has no media url', () => {
  assert.equal(getSponsorLogoUrl(12), '/sponsors/sponsorcard.png')
})
