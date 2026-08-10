type PayloadMedia = {
  url?: string | null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cmsUrl = process.env.CMS_URL?.replace(/\/$/, '')

  if (!cmsUrl) {
    return Response.json({ error: 'CMS_URL not configured' }, { status: 500 })
  }

  const { id: versionedId } = await params
  const id = /^(\d+)(?:-\d+)?$/.exec(versionedId)?.[1]
  if (!id) {
    return Response.json({ error: 'Invalid media ID' }, { status: 400 })
  }

  try {
    const mediaResponse = await fetch(`${cmsUrl}/api/media/${id}`, {
      cache: 'no-store',
    })

    if (!mediaResponse.ok) {
      return Response.json(
        { error: 'CMS image not found' },
        { status: mediaResponse.status },
      )
    }

    const media = (await mediaResponse.json()) as PayloadMedia
    if (!media.url) {
      return Response.json({ error: 'CMS image has no URL' }, { status: 404 })
    }

    const imageUrl = new URL(media.url, `${cmsUrl}/`)
    const imageResponse = await fetch(imageUrl, { cache: 'no-store' })

    if (!imageResponse.ok || !imageResponse.body) {
      return Response.json(
        { error: 'Failed to fetch CMS image' },
        { status: imageResponse.status || 502 },
      )
    }

    const headers = new Headers()
    const contentType = imageResponse.headers.get('content-type')
    const contentLength = imageResponse.headers.get('content-length')

    if (contentType) headers.set('Content-Type', contentType)
    if (contentLength) headers.set('Content-Length', contentLength)
    headers.set('Cache-Control', 'public, max-age=3600')

    return new Response(imageResponse.body, { headers })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to reach CMS'
    return Response.json({ error: message }, { status: 502 })
  }
}
