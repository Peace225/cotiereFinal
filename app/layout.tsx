import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "./Providers";

// Imports des composants globaux
import Navbar from "../frontend/components/layout/Navbar"; 
import Footer from "../frontend/components/layout/Footer"; 

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CÔTIÈRE MEDIA GROUP",
  description: "Découvrez les services CÔTIÈRE.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <head>
        {/* 👈 AJOUTEZ CECI : Force le navigateur à lire et afficher correctement les caractères accentués français */}
        <meta charSet="UTF-8" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <Navbar />
          
          <main>{children}</main>
          
          <Footer /> 
          
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}