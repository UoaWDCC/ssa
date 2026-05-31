const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export async function fetchFromCMS<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}
