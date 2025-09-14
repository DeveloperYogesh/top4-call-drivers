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
  // Enable for Replit environment - allow all hosts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  // Configure for Replit environment
  allowedDevOrigins: ["*.replit.dev", "127.0.0.1"],
};

export default nextConfig;
