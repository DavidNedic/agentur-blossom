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
import { ScrollCrossfade } from "@/components/ScrollCrossfade";

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
  const layers = [
    <div key="hero" className="min-h-screen bg-background text-foreground">
      <NetworkBackground />
      <HeroSection />
    </div>,
    <div key="stats-services" className="min-h-screen bg-background text-foreground">
      <StatsSection />
      <ServicesSection />
    </div>,
    <div key="portfolio" className="min-h-screen bg-background text-foreground">
      <PortfolioSection />
    </div>,
    <div key="kontakt" className="min-h-screen bg-background text-foreground">
      <CTASection />
    </div>,
  ];

  return (
    <div className="relative bg-background text-foreground">
      <Navigation />
      <ScrollCrossfade layers={layers} />
      {/* Normal scrolling sections after crossfade */}
      <FunnelSection />
      <ProblemsSection />
      <ComparisonSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
