// Liveness probe for the Fly health check. Deliberately skips Payload and the
// database: it only answers whether the CMS process is serving requests.
export const dynamic = 'force-dynamic'

export const GET = () => Response.json({ status: 'ok' })
