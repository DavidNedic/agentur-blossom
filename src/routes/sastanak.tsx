import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/components/desk/BookingPage";
import deskCss from "@/components/desk/desk.css?url";
import pageCss from "@/components/desk/booking-page.css?url";

const TITLE = "Zakaži besplatan sastanak | Promet Digital";
const DESC =
  "Zakaži besplatan 30-minutni sastanak sa Promet Digital. Pričamo o tvom poslu, kupcima i ciljevima, preko Zooma ili uživo. Zrenjanin · Beograd.";

export const Route = createFileRoute("/sastanak")({
  component: BookingPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://promet.digital/sastanak" },
      { property: "og:site_name", content: "Promet Digital" },
      { property: "og:locale", content: "sr_RS" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [
      { rel: "canonical", href: "https://promet.digital/sastanak" },
      { rel: "stylesheet", href: deskCss },
      { rel: "stylesheet", href: pageCss },
    ],
  }),
});
