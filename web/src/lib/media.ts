const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ?? ''

export function getCmsMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  if (!url.startsWith('/api/media/')) return url
  if (!cmsUrl) return url

  return `${cmsUrl}${url}`
}
