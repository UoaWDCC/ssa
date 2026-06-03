import type { NextConfig } from 'next'

function getCmsImageRemotePattern() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL
  if (!cmsUrl) return undefined

  try {
    const url = new URL(cmsUrl)
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: '/api/media/file/**',
    }
  } catch {
    return undefined
  }
}

const cmsImageRemotePattern = getCmsImageRemotePattern()
const allowLocalCmsImages =
  cmsImageRemotePattern?.hostname === 'localhost' ||
  cmsImageRemotePattern?.hostname === '127.0.0.1'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowLocalIP: allowLocalCmsImages,
    remotePatterns: cmsImageRemotePattern ? [cmsImageRemotePattern] : [],
  },
}

export default nextConfig
