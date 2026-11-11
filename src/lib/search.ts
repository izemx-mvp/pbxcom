import Fuse from "fuse.js";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { sectors } from "@/data/sectors";
import { universes } from "@/data/universes";
import { formatPrice, normalizeText } from "./format";

export type SearchKind = "produit" | "categorie" | "service" | "page";

export type SearchEntry = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  slug?: string;
};

const pages: Array<Omit<SearchEntry, "id" | "kind">> = [
  { title: "Accueil", subtitle: "Sécurité, réseau et télécom à Rabat", href: "/", keywords: "accueil home pbxcom" },
  { title: "Nos solutions", subtitle: "3 univers, 12 services", href: "/solutions", keywords: "solutions services expertise" },
  { title: "Boutique", subtitle: "Tout le catalogue", href: "/boutique", keywords: "boutique shop catalogue produits acheter" },
  { title: "Secteurs d'activité", subtitle: "Entreprise, hôtel, collectivité, résidence, santé, transport", href: "/secteurs", keywords: "secteurs clients métiers" },
  { title: "Demander un devis", subtitle: "Gratuit, réponse en moins de 4h", href: "/devis", keywords: "devis gratuit estimation prix tarif" },
  { title: "Références", subtitle: "Ils nous ont fait confiance", href: "/references", keywords: "references clients projets realisations" },
  { title: "À propos", subtitle: "PBXcom depuis 2006 à Rabat", href: "/a-propos", keywords: "a propos entreprise histoire equipe 2006" },
  { title: "Contact", subtitle: "Adresse, téléphone, horaires", href: "/contact", keywords: "contact adresse telephone horaires email plan" },
  { title: "Mon panier", subtitle: "Articles sélectionnés", href: "/panier", keywords: "panier cart commande" },
  { title: "Livraison", subtitle: "Délais et zones de livraison", href: "/livraison", keywords: "livraison delai expedition maroc" },
  { title: "Conditions générales de vente", subtitle: "CGV", href: "/cgv", keywords: "cgv conditions vente garantie retour" },
  { title: "Mentions légales", subtitle: "Informations légales", href: "/mentions-legales", keywords: "mentions legales editeur" },
  { title: "Politique de confidentialité", subtitle: "Loi 09-08", href: "/confidentialite", keywords: "confidentialite donnees personnelles 09-08 rgpd" },
];

export const searchEntries: SearchEntry[] = [
  ...products.map((p) => ({
    id: `p-${p.slug}`,
    kind: "produit" as const,
    title: p.name,
    subtitle: `${p.brand} · ${p.price === null ? "Prix sur demande" : formatPrice(p.price)}`,
    href: `/produit/${p.slug}`,
    keywords: normalizeText([p.brand, p.sku, p.category, ...p.tags, ...p.shortSpecs].join(" ")),
    slug: p.slug,
  })),
  ...categories.map((c) => ({
    id: `c-${c.slug}`,
    kind: "categorie" as const,
    title: c.name,
    subtitle: c.short,
    href: `/boutique/${c.slug}`,
    keywords: normalizeText(c.description),
  })),
  ...services.map((s) => ({
    id: `s-${s.slug}`,
    kind: "service" as const,
    title: s.name,
    subtitle: s.short,
    href: `/solutions/${s.universe}#${s.slug}`,
    keywords: normalizeText([...s.useCases, ...s.specChips].join(" ")),
  })),
  ...universes.map((u) => ({
    id: `u-${u.id}`,
    kind: "service" as const,
    title: u.name,
    subtitle: u.tagline,
    href: `/solutions/${u.id}`,
    keywords: normalizeText(u.description),
  })),
  ...sectors.map((s) => ({
    id: `sec-${s.slug}`,
    kind: "page" as const,
    title: `Secteur ${s.name}`,
    subtitle: s.short,
    href: `/secteurs#${s.slug}`,
    keywords: normalizeText(s.needs.join(" ")),
  })),
  ...pages.map((p) => ({ ...p, id: `page-${p.href}`, kind: "page" as const })),
];

const fuse = new Fuse(searchEntries, {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "keywords", weight: 0.25 },
    { name: "subtitle", weight: 0.15 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
  getFn: (obj, path) => {
    const key = Array.isArray(path) ? path[0] : path;
    const value = (obj as Record<string, unknown>)[key as string];
    return typeof value === "string" ? normalizeText(value) : "";
  },
});

export function search(query: string, limit = 24): SearchEntry[] {
  const q = normalizeText(query);
  if (q.length < 2) return [];
  return fuse.search(q, { limit }).map((r) => r.item);
}

export const kindLabels: Record<SearchKind, string> = {
  produit: "Produits",
  categorie: "Catégories",
  service: "Solutions & services",
  page: "Pages",
};

/** Product slugs matching a free-text query, ordered by relevance. */
export function searchProductSlugs(query: string): string[] {
  const q = normalizeText(query);
  if (q.length < 2) return [];
  return fuse
    .search(q, { limit: 60 })
    .filter((r) => r.item.kind === "produit" && r.item.slug)
    .map((r) => r.item.slug!);
}
