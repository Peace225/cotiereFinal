
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "./Providers";

// ======================================================
// POLICE PRINCIPALE : MONTSERRAT
// ======================================================

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

// ======================================================
// SEO - CÔTIÈRE MEDIA GROUP
// ======================================================

export const metadata: Metadata = {
  title: {
    default: "CÔTIÈRE MEDIA GROUP",
    template: "%s | CÔTIÈRE MEDIA GROUP",
  },

  description:
    "Découvrez Côtière Media Group : séjours, hébergements, tourisme, transport, services audiovisuels, marketplace et opportunités en Côte d'Ivoire.",

  applicationName: "Côtière Media Group",

  keywords: [
    "Côtière Media Group",
    "Côte d'Ivoire",
    "Abidjan",
    "Hébergement",
    "Réservation",
    "Tourisme",
    "Transport",
    "HBL Studio+",
    "Marketplace",
  ],

  robots: {
    index: true,
    follow: true,
  },
};

// ======================================================
// ROOT LAYOUT
// ======================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        suppressHydrationWarning
      >
        <Providers>
          {children}

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
