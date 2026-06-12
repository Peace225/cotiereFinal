"use client";

import { CartProvider } from "@/components/frontend/CartContext"; // Ajustez le chemin si nécessaire

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}