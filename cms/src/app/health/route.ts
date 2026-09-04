// Liveness probe for the Fly health check. Deliberately does NOT initialise
// Payload or touch the database — it answers the question "is the CMS process
// serving requests?", which is what distinguishes a booted container from the
// nginx 502 you get when the CMS process is dead. Database problems should
// surface as failing requests, not as a rolled-back deploy.
export const dynamic = 'force-dynamic'

export const GET = () => Response.json({ status: 'ok' })
