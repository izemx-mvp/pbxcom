import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { ShopListing } from "@/components/shop/shop-listing";

type BoutiqueSearch = { q?: string };

export const Route = createFileRoute("/boutique/")({
  validateSearch: (search: Record<string, unknown>): BoutiqueSearch =>
    typeof search["q"] === "string" && search["q"].trim() ? { q: search["q"].trim().slice(0, 80) } : {},
  head: () =>
    seo({
      title: "Boutique — Caméras, contrôle d'accès, réseau, téléphonie IP",
      description:
        "Achetez en ligne caméras IP, kits d'alarme, lecteurs de badges, switchs PoE, points d'accès Wi-Fi, téléphones IP et équipements de visioconférence. Livraison partout au Maroc.",
      path: "/boutique",
      breadcrumbs: [{ name: "Boutique", path: "/boutique" }],
    }),
  component: BoutiquePage,
});

function BoutiquePage() {
  const { q } = Route.useSearch();
  return <ShopListing query={q ?? ""} />;
}
