import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
