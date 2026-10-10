import assert from 'node:assert/strict'
import test from 'node:test'

import { fetchSponsors, getSponsorLogoUrl } from '../src/lib/sponsors.ts'

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

test('returns sponsor documents from the CMS response', async () => {
  const originalFetch = globalThis.fetch
  const docs = [{ id: 1, name: 'Test sponsor' }]
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ docs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  try {
    assert.deepEqual(await fetchSponsors(), docs)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('returns an empty sponsor list when the CMS request fails', async () => {
  const originalFetch = globalThis.fetch
  const originalConsoleError = console.error
  globalThis.fetch = async () => {
    throw new Error('CMS unavailable')
  }
  console.error = () => {}

  try {
    assert.deepEqual(await fetchSponsors(), [])
  } finally {
    globalThis.fetch = originalFetch
    console.error = originalConsoleError
  }
})
