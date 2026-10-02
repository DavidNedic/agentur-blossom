import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/desk/Desk";
import deskCss from "@/components/desk/desk.css?url";

const TITLE = "Promet Digital | Sajtovi, prodavnice i sistemi po meri";
const DESC =
  "Sajtovi, online prodavnice i sistemi po meri za magacin, kasu i kamere. Prvi sastanak je besplatan. Zrenjanin · Beograd.";
const SOCIAL_IMAGE = "https://promet.digital/og-image.png";

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
  }),
});

function Index() {
  return <Desk />;
}
