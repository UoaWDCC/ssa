export function resolveMediaUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url

  const baseUrl =
    process.env.NEXT_PUBLIC_CMS_URL ??
    (process.env.NODE_ENV === 'production' ? null : 'http://localhost:3001')

  return baseUrl
    ? new URL(url, `${baseUrl.replace(/\/$/, '')}/`).toString()
    : url
}
