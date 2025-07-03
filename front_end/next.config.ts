import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/api/:path*',
      },
    ];
  },

  // Configuration pour le développement avec Docker
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
