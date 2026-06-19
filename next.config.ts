import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const prodDomain = process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "") ?? "cotiere.ci";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: "images.unsplash.com" },
      { protocol: "https" as const, hostname: "res.cloudinary.com" },
      { protocol: "https" as const, hostname: prodDomain },
      { protocol: "https" as const, hostname: `*.${prodDomain}` },
      // Ngrok et Localhost en mode Dev
      ...(isDev
        ? [
            { protocol: "http" as const, hostname: "localhost" },
            { protocol: "https" as const, hostname: "*.ngrok-free.dev" },
            { protocol: "https" as const, hostname: "*.ngrok.io" },
          ]
        : []),
    ],
  },
};

export default nextConfig;