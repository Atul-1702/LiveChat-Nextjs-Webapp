import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ ignores TS errors during build
  },
};

export default nextConfig;
