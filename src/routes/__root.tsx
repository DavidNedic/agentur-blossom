import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import geologicaLatin from "@fontsource/geologica/files/geologica-latin-800-normal.woff2?url";
import geologicaLatinExt from "@fontsource/geologica/files/geologica-latin-ext-800-normal.woff2?url";
import onestLatin from "@fontsource/onest/files/onest-latin-400-normal.woff2?url";
import onestLatinExt from "@fontsource/onest/files/onest-latin-ext-400-normal.woff2?url";
import jetbrainsLatin from "../assets/fonts/jetbrains-mono-latin.woff2?url";

const TITLE = "Promet Digital | Sajtovi, prodavnice i sistemi po meri";
const DESC =
  "Sajtovi, online prodavnice i sistemi po meri za magacin, kasu i kamere. Prvi sastanak je besplatan. Zrenjanin · Beograd.";
const SOCIAL_IMAGE = "https://promet.digital/og-image.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "author", content: "Promet Digital" },
      { name: "theme-color", content: "#17181C" },
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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [
      { rel: "preload", href: geologicaLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: geologicaLatinExt, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: onestLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: onestLatinExt, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: jetbrainsLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
