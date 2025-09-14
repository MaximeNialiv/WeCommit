const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable PWA features
  experimental: {
    webpackBuildWorker: true
  },
  // For mobile app deployment
  // output: "export", // Commented out for PWA
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = withPWA(nextConfig);