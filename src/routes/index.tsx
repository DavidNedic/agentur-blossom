import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/desk/Desk";
import deskCss from "@/components/desk/desk.css?url";

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
    links: [{ rel: "stylesheet", href: deskCss }],
  }),
});

function Index() {
  return <Desk />;
}
