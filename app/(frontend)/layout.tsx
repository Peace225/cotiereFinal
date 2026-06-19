import Navbar from "@/components/frontend/layout/Navbar";
import WhatsAppButton from "@/components/frontend/layout/WhatsAppButton";
import { CartProvider } from "@/components/frontend/CartContext";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      
      <main>{children}</main>
   
      <WhatsAppButton />
    </CartProvider>
  );
}

