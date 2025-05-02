import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['build-better.s3.ap-southeast-2.amazonaws.com'],
  },
};

export default nextConfig;
