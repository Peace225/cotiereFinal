import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.79.1', 'size-matador-savior.ngrok-free.dev', '*.ngrok-free.dev', '*.ngrok.io'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "*.ngrok-free.dev" },
      ...(isDev ? [{ protocol: "http" as const, hostname: "localhost" }] : []),
    ],
  },
};

export default nextConfig;
