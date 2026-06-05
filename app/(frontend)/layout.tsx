import Navbar from "@/components/frontend/layout/Navbar";
import Footer from "@/components/frontend/layout/Footer";
import WhatsAppButton from "@/components/frontend/layout/WhatsAppButton";
import { CartProvider } from "@/components/frontend/CartContext";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </CartProvider>
  );
}
