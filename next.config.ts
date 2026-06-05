import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const prodDomain = process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "") ?? "cotiere.ci";

const nextConfig: NextConfig = {
  // Origines autorisées en développement uniquement
  ...(isDev && {
    allowedDevOrigins: [
      "192.168.79.1",
      "size-matador-savior.ngrok-free.dev",
      "*.ngrok-free.dev",
      "*.ngrok.io",
    ],
  }),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: prodDomain },
      { protocol: "https", hostname: `*.${prodDomain}` },
      ...(isDev
        ? [
            { protocol: "http" as const, hostname: "localhost" },
            { protocol: "https" as const, hostname: "*.ngrok-free.dev" },
          ]
        : []),
    ],
  },
};

export default nextConfig;
