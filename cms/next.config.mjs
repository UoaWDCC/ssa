import { withPayload } from '@payloadcms/next/withPayload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // nginx can only give /_next to one app, and web has it. Set in the Docker
  // build only; unset in dev, where the CMS is hit directly on :3001.
  assetPrefix: process.env.CMS_ASSET_PREFIX,
  // Otherwise Next infers it from the nearest lockfile above the repo, which
  // moves the standalone output the Dockerfile copies from.
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
