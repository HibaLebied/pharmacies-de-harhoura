/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/pharmaciesDeGarde",
        destination: "/pharmacies-de-garde",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
