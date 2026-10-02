import { createFileRoute } from "@tanstack/react-router";
import { LangProvider } from "@/lib/i18n";
import { GridLines } from "@/components/site/ui";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { GermanStandard } from "@/components/site/GermanStandard";
import { Work } from "@/components/site/Work";
import { Services } from "@/components/site/Services";
import { Capabilities } from "@/components/site/Capabilities";
import { Process } from "@/components/site/Process";
import { Proof } from "@/components/site/Proof";
import { Packages } from "@/components/site/Packages";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { SiteMotion } from "@/components/site/SiteMotion";

const TITLE = "Promet Digital | SaaS, e-commerce i digitalna prodaja";
const DESC =
  "Digitalni partner za SaaS sisteme, e-commerce izradu i prodaju, sajtove, SEO, automatizaciju i marketing u Srbiji i Nemačkoj. Sajtovi od 199 €.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sr_RS" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
});

function Index() {
  return (
    <LangProvider>
      <GridLines />
      <SiteMotion />
      <div className="relative min-h-screen text-foreground">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Manifesto />
          <GermanStandard />
          <Work />
          <Services />
          <Capabilities />
          <Process />
          <Proof />
          <Packages />
          <Faq />
          <Contact />
        </main>
      </div>
    </LangProvider>
  );
}
