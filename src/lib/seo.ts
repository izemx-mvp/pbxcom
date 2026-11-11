import { images } from "@/config/images";
import { site } from "@/config/site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; path: string }>;
  jsonLd?: Record<string, unknown>[];
};

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: "PBXCOM Informatique et Télécom",
    slogan: site.slogan,
    description: site.description,
    url: site.url,
    logo: absoluteUrl(images.brand.logo.src),
    image: absoluteUrl(images.misc.og.src),
    email: site.email,
    telephone: site.phone.display.replace(/\s/g, ""),
    foundingDate: String(site.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: `${site.address.district}, ${site.address.city}`,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    areaServed: { "@type": "Country", name: "Maroc" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "18:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
    ],
    sameAs: [site.socials.facebook.url, site.socials.instagram.url],
  };
}

export function seo({ title, description, path, image, type = "website", noindex, breadcrumbs, jsonLd = [] }: SeoInput) {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? title : `${title} | PBXcom`;
  const ogImage = absoluteUrl(image ?? images.misc.og.src);
  const scripts = [...(breadcrumbs ? [breadcrumbJsonLd(breadcrumbs)] : []), ...jsonLd].map((data) => ({
    type: "application/ld+json",
    children: JSON.stringify(data),
  }));

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: images.misc.og.alt },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
