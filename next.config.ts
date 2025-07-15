import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for Vercel
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "firebasestorage.googleapis.com", // Add Firebase Storage domain
      "images.unsplash.com", // Add Unsplash domain
      "i.pinimg.com", // Add Pinterest domain
      "pinimg.com", // Add Pinterest base domain
      "www.pinimg.com", // Add Pinterest www domain
      "lh3.googleusercontent.com", // Add Google user content domain
      "storage.googleapis.com", // Add Google Cloud Storage domain
    ],
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
