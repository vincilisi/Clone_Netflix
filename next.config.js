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
    // Ignora errori di lint durante la build su Vercel
    ignoreDuringBuilds: true,
  },
  // ...altri config se li hai
};

module.exports = nextConfig;
