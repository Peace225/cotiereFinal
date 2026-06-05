import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://cotiere.ci";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CÔTIÈRE MEDIA GROUP — Tourisme, Studio, Événements & Hébergement",
    template: "%s | CÔTIÈRE MEDIA GROUP",
  },
  description: "Découvrez les services CÔTIÈRE : excursions sur le littoral ivoirien, studio de production, organisation d'événements, hébergement et bien plus.",
  keywords: ["cotiere", "tourisme côte d'ivoire", "studio production", "événements", "hébergement littoral", "excursions ivoirien"],
  authors: [{ name: "CÔTIÈRE MEDIA GROUP" }],
  creator: "CÔTIÈRE MEDIA GROUP",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: BASE_URL,
    siteName: "CÔTIÈRE MEDIA GROUP",
    title: "CÔTIÈRE MEDIA GROUP — Tourisme, Studio, Événements & Hébergement",
    description: "Découvrez les services CÔTIÈRE : excursions, studio, événements, hébergement sur le littoral ivoirien.",
    images: [{ url: "/Images/cotiere-media-group.png", width: 1200, height: 630, alt: "CÔTIÈRE MEDIA GROUP" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CÔTIÈRE MEDIA GROUP",
    description: "Tourisme, Studio, Événements & Hébergement sur le littoral ivoirien.",
    images: ["/Images/og-default.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
