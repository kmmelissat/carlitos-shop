import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for Vercel
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["firebasestorage.googleapis.com"], // Add Firebase Storage domain
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
