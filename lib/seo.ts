import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://cotiere.ci";

export function buildMeta(opts: {
  title: string;
  description: string;
  image?: string;
  path?: string;
}): Metadata {
  const url = `${BASE_URL}${opts.path ?? ""}`;
  const image = opts.image ?? "/Images/og-default.jpg";

  return {
    title: opts.title,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
      locale: "fr_CI",
      siteName: "COTIERE MEDIA GROUP",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}
