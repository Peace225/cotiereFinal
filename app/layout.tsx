import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "./Providers";

// Imports des composants globaux
import Navbar from "../frontend/components/layout/Navbar"; 
import Footer from "../frontend/components/layout/Footer"; // 👈 AJOUTE CECI

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  // ✅ CORRIGÉ : L'encodage du titre de l'onglet
  title: "CÔTIÈRE MEDIA GROUP",
  // ✅ CORRIGÉ : L'encodage de la description
  description: "Découvrez les services CÔTIÈRE.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <Navbar />
          
          <main>{children}</main>
          
          <Footer /> {/* 👈 AJOUTE CECI : Le footer sera maintenant sous ton contenu */}
          
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}