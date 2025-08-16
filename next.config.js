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
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // evita errori di lint durante la build
  },
  // experimental.appDir è abilitato di default in Next 15, non serve più
};

module.exports = nextConfig;
