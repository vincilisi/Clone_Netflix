/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
  },
  eslint: {
    // Ignora errori di lint durante la build su Netlify
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true, // App Router
  },
  output: 'standalone', // per Netlify
};

module.exports = nextConfig;
