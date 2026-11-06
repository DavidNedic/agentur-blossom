import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/desk/Desk";
import deskCss from "@/components/desk/desk.css?url";

const TITLE = "Promet Digital | Sajtovi, prodavnice i sistemi po meri";
const DESC =
  "Sajtovi, online prodavnice i sistemi po meri za magacin, kasu i rezervacije. Prvi sastanak je besplatan. Zrenjanin · Beograd.";
const SOCIAL_IMAGE = "https://promet.digital/og-image.png";
const ORG_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://promet.digital/#org",
      name: "Promet Digital",
      url: "https://promet.digital/",
      logo: "https://promet.digital/icon-512.png",
      image: SOCIAL_IMAGE,
      description: DESC,
      telephone: "+381621015707",
      email: "davidnedic@web.de",
      priceRange: "po dogovoru",
      address: { "@type": "PostalAddress", addressLocality: "Zrenjanin", addressCountry: "RS" },
      areaServed: [
        { "@type": "City", name: "Zrenjanin" },
        { "@type": "City", name: "Beograd" },
        { "@type": "Country", name: "Srbija" },
        { "@type": "Country", name: "Deutschland" },
      ],
      founder: { "@id": "https://promet.digital/#david" },
      knowsLanguage: ["sr", "de"],
      makesOffer: ["Izrada sajtova", "Online prodavnice", "Sistemi za magacin", "Kasa sistemi", "Online rezervacije", "SEO"].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
    {
      "@type": "Person",
      "@id": "https://promet.digital/#david",
      name: "David Nedić",
      jobTitle: "Kaufmann für E-Commerce",
      worksFor: { "@id": "https://promet.digital/#org" },
    },
    { "@type": "WebSite", "@id": "https://promet.digital/#site", url: "https://promet.digital/", name: "Promet Digital", inLanguage: ["sr", "de"], publisher: { "@id": "https://promet.digital/#org" } },
  ],
});
const BLUEPRINT_BOOT =
  'try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&(/[?&]blueprint/.test(location.search)||sessionStorage.getItem("promet-blueprint-seen")!=="1")){d.classList.add("bp-boot");setTimeout(function(){d.classList.remove("bp-boot")},8000)}}catch(e){}';

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://promet.digital/" },
      { property: "og:site_name", content: "Promet Digital" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:secure_url", content: SOCIAL_IMAGE },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Promet Digital" },
      { property: "og:locale", content: "sr_RS" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [
      { rel: "canonical", href: "https://promet.digital/" },
      { rel: "stylesheet", href: deskCss },
    ],
    // Before first paint: if the blueprint intro will run, cover the desk with the blueprint
    // paper right away so the half-loaded desk never flashes. blueprint.ts takes over from it.
    scripts: [{ children: BLUEPRINT_BOOT }, { type: "application/ld+json", children: ORG_LD }],
  }),
});

function Index() {
  return <Desk />;
}
