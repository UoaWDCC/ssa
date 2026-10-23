import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

export const mainListStatuses = ['pending', 'offered', 'paid'] as const

export function relationshipId(value: unknown): number {
  return typeof value === 'object' && value !== null && 'id' in value
    ? Number(value.id)
    : Number(value)
}

export async function lockEvent(req: PayloadRequest, eventId: number) {
  const transactionID = await req.transactionID
  const transaction =
    transactionID &&
    (req.payload.db as unknown as Pick<PostgresAdapter, 'sessions'>).sessions[transactionID]?.db
  if (!transaction) throw new Error('Event registration requires a database transaction')

  // All signups for an event share this row lock. The count and insert must use
  // the same transaction so two requests cannot both claim the final place.
  await transaction.execute(sql`SELECT id FROM events WHERE id = ${eventId} FOR UPDATE`)
}

export async function getEventAvailability(
  payload: Payload,
  eventId: number,
  capacity?: number | null,
  req?: PayloadRequest,
) {
  const { totalDocs } = await payload.count({
    collection: 'event-registrations',
    where: { and: [{ event: { equals: eventId } }, { status: { in: [...mainListStatuses] } }] },
    overrideAccess: true,
    req,
  })

  return {
    registrationCount: totalDocs,
    spotsRemaining: capacity == null ? null : Math.max(0, capacity - totalDocs),
    waitlistEnabled: capacity != null && totalDocs >= capacity,
  }
}
