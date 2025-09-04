/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@sbr/database",
    "@sbr/auth",
    "@sbr/shared",
    "@sbr/config",
    "@sbr/email",
    "@sbr/ui",
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@prisma/client': '@prisma/client',
      })
    }
    return config
  },
}

module.exports = nextConfig
