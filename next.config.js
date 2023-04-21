/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@tremor/react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/leerob',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      }
    ],
  },
}

module.exports = nextConfig
