import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowLocalIP: true, // Turn off once payload server is deployed and we don't have to use local ip
    remotePatterns: [{ protocol: 'http', hostname: 'localhost', port: '3001' }],
  },
}

export default nextConfig
