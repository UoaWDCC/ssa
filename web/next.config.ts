import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: 'standalone',
  // Pin the file-tracing root to the pnpm workspace root. Without this, Next
  // infers it from the nearest lockfile above the repo, which changes the
  // standalone output layout the Dockerfile copies from.
  outputFileTracingRoot: path.join(dirname, '..'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vgawopvizgrohsthvauh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
