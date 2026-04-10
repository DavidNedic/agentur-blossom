import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { FunnelSection } from "@/components/FunnelSection";
import { ProblemsSection } from "@/components/ProblemsSection";

import { ComparisonSection } from "@/components/ComparisonSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Web Studio – Vaš Pouzdan Digitalni Partner" },
      {
        name: "description",
        content:
          "Profesionalna izrada sajtova, SEO optimizacija i digitalni marketing. 5+ paketa, 100% podrška.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FunnelSection />
      <ProblemsSection />
      
      <ComparisonSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
