import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const prodDomain = process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "") ?? "cotiere.ci";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: prodDomain },
      { protocol: "https", hostname: `*.${prodDomain}` },
      // Ngrok et Localhost en mode Dev
      ...(isDev
        ? [
            { protocol: "http", hostname: "localhost" },
            { protocol: "https", hostname: "*.ngrok-free.dev" },
            { protocol: "https", hostname: "*.ngrok.io" },
          ]
        : []),
    ],
  },
};

export default nextConfig;