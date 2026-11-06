import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/desk/Desk";
import deskCss from "@/components/desk/desk.css?url";

const TITLE = "Promet Digital | Sajtovi, prodavnice i sistemi po meri";
const DESC =
  "Sajtovi, online prodavnice i sistemi po meri za magacin, kasu i rezervacije. Prvi sastanak je besplatan. Zrenjanin · Beograd.";
const SOCIAL_IMAGE = "https://promet.digital/og-image.png";
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
    links: [{ rel: "stylesheet", href: deskCss }],
    // Before first paint: if the blueprint intro will run, cover the desk with the blueprint
    // paper right away so the half-loaded desk never flashes. blueprint.ts takes over from it.
    scripts: [{ children: BLUEPRINT_BOOT }],
  }),
});

function Index() {
  return <Desk />;
}
