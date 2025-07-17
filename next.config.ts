import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for Vercel
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "firebasestorage.googleapis.com", // Firebase Storage domain
      "images.unsplash.com", // Unsplash domain
      "i.pinimg.com", // Pinterest domain
      "pinimg.com", // Pinterest base domain
      "www.pinimg.com", // Pinterest www domain
      "lh3.googleusercontent.com", // Google user content domain
      "storage.googleapis.com", // Google Cloud Storage domain
      "oaiusercontent.com", // OpenAI/ChatGPT images domain
      "sdmntprukwest.oaiusercontent.com", // Specific OpenAI subdomain
      "s3.amazonaws.com", // Amazon S3
      "amazonaws.com", // AWS general
      "cloudinary.com", // Cloudinary
      "imgur.com", // Imgur
      "i.imgur.com", // Imgur images subdomain
      "picsum.photos", // Lorem Picsum
      "via.placeholder.com", // Placeholder images
      "dummyimage.com", // Dummy image generator
      "source.unsplash.com", // Unsplash source
      "unsplash.com", // Unsplash main domain
      "cdn.pixabay.com", // Pixabay CDN
      "pixabay.com", // Pixabay main domain
      "pexels.com", // Pexels
      "images.pexels.com", // Pexels images
      "static.pexels.com", // Pexels static
    ],
    // Allow external images with unoptimized fallback
    unoptimized: false,
    // Handle image loading errors gracefully
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
