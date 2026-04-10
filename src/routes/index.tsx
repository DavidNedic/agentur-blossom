import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";
import { NetworkBackground } from "@/components/NetworkBackground";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { FunnelSection } from "@/components/FunnelSection";
import { ProblemsSection } from "@/components/ProblemsSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Radenon Digital – Vaš Pouzdan Digitalni Partner" },
      {
        name: "description",
        content:
          "Profesionalna izrada sajtova, SEO optimizacija i digitalni marketing. Radenon Digital — sve iz jednog mesta.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <NetworkBackground />
      <Navigation />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <PortfolioSection />
      <FunnelSection />
      <ProblemsSection />
      
      <ComparisonSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
