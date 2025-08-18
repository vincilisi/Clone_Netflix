/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // mantiene build standalone per Netlify
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/6.x/avataaars/**', // o '/6.x/**' se vuoi tutti i tipi di avatar
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // evita errori di lint durante la build
  },
};

module.exports = nextConfig;
