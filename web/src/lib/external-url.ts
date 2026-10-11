export function toExternalHref(url?: string | null) {
  const trimmedUrl = url?.trim()

  if (!trimmedUrl) return undefined

  return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`
}
