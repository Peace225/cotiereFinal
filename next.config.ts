import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const prodDomain = process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "") ?? "cotiere.ci";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: "images.unsplash.com" },
      { protocol: "https" as const, hostname: "res.cloudinary.com" },
      { protocol: "https" as const, hostname: "jseelotxxaoygmaajrdt.supabase.co" },
      { protocol: "https" as const, hostname: prodDomain },
      { protocol: "https" as const, hostname: `*.${prodDomain}` },
      ...(isDev
        ? [
            { protocol: "http" as const, hostname: "localhost" },
            { protocol: "http" as const, hostname: "127.0.0.1" },
            { protocol: "https" as const, hostname: "*.ngrok-free.dev" },
            { protocol: "https" as const, hostname: "*.ngrok.io" },
          ]
        : []),
    ],
  },
};

export default nextConfig;