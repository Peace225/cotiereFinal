import HeroSection from "@/components/frontend/home/HeroSection";
import ServicesGrid from "@/components/frontend/home/ServicesGrid";
import StatsSection from "@/components/frontend/home/StatsSection";
import TestimonialsSection from "@/components/frontend/home/TestimonialsSection";
import CtaSection from "@/components/frontend/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
