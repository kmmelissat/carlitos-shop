import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify-specific optimizations
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["firebasestorage.googleapis.com"], // Add Firebase Storage domain
  },
  // Ensure compatibility with Netlify
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
