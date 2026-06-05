import Navbar from "@/components/frontend/layout/Navbar";
import Footer from "@/components/frontend/layout/Footer";
import WhatsAppButton from "@/components/frontend/layout/WhatsAppButton";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
