import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/call-drivers-in-:city",
        destination: "/call-drivers-in/:city"
      }
    ];
  },
};

export default nextConfig;
