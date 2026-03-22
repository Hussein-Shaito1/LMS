import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    additionalData: `
      @import "base/variables";
      @import "base/mixins";
      @import "base/animations";
    `,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
