import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/call-drivers-in-:city",
        destination: "/call-drivers-in/:city"
      },
      {
        source: "/car-driver-job-in-:city",
        destination: "/car-driver-job-in/:city"
      }
    ];
  },
  // Configure for Replit environment
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://replit.com https://*.replit.com https://*.replit.dev",
          },
        ],
      },
    ];
  },
  // Standalone output for production deployments
  output: 'standalone',
};

export default nextConfig;
