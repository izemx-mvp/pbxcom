import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteLayout } from "@/components/layout/site-layout";
import { NotFoundPage } from "@/components/pages/not-found";
import { localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/config/images";

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="surface-dark flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="label-mono text-green">Erreur</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Cette page n'a pas pu se charger</h1>
        <p className="mt-3 text-white/60">Un incident technique est survenu. Vous pouvez réessayer ou revenir à l'accueil.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-[10px] bg-green px-5 font-medium text-ink hover:bg-green-bright"
          >
            Réessayer
          </button>
          <a href="/" className="inline-flex h-12 items-center justify-center rounded-[10px] border border-white/15 px-5 font-medium text-white hover:border-green">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: `${site.name} — ${site.slogan}` },
      { name: "description", content: site.description },
      { name: "author", content: site.name },
      { name: "theme-color", content: "#0A0D0C" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: "fr_MA" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "512x512", href: images.chatbot.avatar.src },
      { rel: "apple-touch-icon", href: images.chatbot.avatar.src },
      { rel: "preload", as: "image", href: images.brand.logo.src },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayout>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </SiteLayout>
    </QueryClientProvider>
  );
}
