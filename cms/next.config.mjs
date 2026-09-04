import { withPayload } from '@payloadcms/next/withPayload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Both apps serve their build output under /_next, and nginx can only give
  // that path to one of them (web). Set in the Docker build only, so the CMS
  // asks for its chunks at /cms-assets/_next/... which nginx maps back to the
  // CMS; unset in local dev, where the CMS is hit directly on :3001.
  assetPrefix: process.env.CMS_ASSET_PREFIX,
  // Pin the file-tracing root to the pnpm workspace root. Without this, Next
  // infers it from the nearest lockfile above the repo, which changes the
  // standalone output layout the Dockerfile copies from.
  outputFileTracingRoot: path.join(dirname, '..'),
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
