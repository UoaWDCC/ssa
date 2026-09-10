import assert from 'node:assert/strict'
import test from 'node:test'
import {
  eventDateTime,
  formatDate,
  formatEventDate,
} from '../src/lib/eventDate.ts'

test('combines the Auckland day and separately stored clock time', () => {
  const date = '2026-04-01T11:00:00.000Z'
  const time = '1970-01-01T06:00:00.000Z'
  assert.equal(formatEventDate(date, time), '2 April 2026 – 6:00 pm')
  assert.equal(eventDateTime(date, time), '2026-04-02T18:00')
})

test('uses Auckland time consistently through summer and winter', () => {
  assert.equal(
    formatEventDate('2026-01-14T11:00:00Z', '2026-01-01T05:30:00Z'),
    '15 January 2026 – 6:30 pm',
  )
  assert.equal(
    formatEventDate('2026-07-14T12:00:00Z', '2026-07-01T06:30:00Z'),
    '15 July 2026 – 6:30 pm',
  )
})

test('supports date-only events and omits missing or invalid times', () => {
  for (const time of [undefined, null, '', 'invalid']) {
    assert.equal(formatEventDate('2026-04-02', time), '2 April 2026')
    assert.equal(eventDateTime('2026-04-02', time), '2026-04-02')
  }
})

test('does not expose invalid dates or fabricate a datetime', () => {
  for (const date of [undefined, null, '', 'invalid']) {
    assert.equal(formatDate(date), 'Date to be confirmed')
    assert.equal(
      formatEventDate(date, '1970-01-01T06:00:00Z'),
      'Date to be confirmed',
    )
    assert.equal(eventDateTime(date), undefined)
  }
})

test('renders midnight as 00:00 in machine-readable markup', () => {
  assert.equal(
    eventDateTime('2026-04-02', '2026-04-01T11:00:00Z'),
    '2026-04-02T00:00',
  )
})
