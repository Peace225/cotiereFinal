import HeroSection from "@/app/(frontend)/home/HeroSection";
import ServicesGrid from "@/app/(frontend)/home/ServicesGrid";
import StatsSection from "@/frontend/home/StatsSection";
import TestimonialsSection from "@/frontend/home/TestimonialsSection";
import CtaSection from "@/frontend/home/CtaSection";

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
