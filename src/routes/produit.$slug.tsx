import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileDown, FileText, Headphones, Link2, ShieldCheck, ShoppingBag, Truck, Wrench, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo, absoluteUrl } from "@/lib/seo";
import { site } from "@/config/site";
import { getProduct, relatedProducts, type Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import { getService } from "@/data/services";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { useUI } from "@/lib/ui-state";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl, formatMessage } from "@/lib/whatsapp";
import { getRecentlyViewed, pushRecentlyViewed } from "@/lib/recently-viewed";
import { Button, buttonVariants, ButtonContent } from "@/components/site/button";
import { SiteTabs } from "@/components/site/blocks";
import { PageBar } from "@/components/site/page-bar";
import { Badge, PriceTag, Section, SectionHeading, StockDot } from "@/components/site/primitives";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { ProductRail } from "@/components/site/product-rail";
import { discountPercent, ProductImage } from "@/components/site/product-card";
import { WhatsAppIcon } from "@/components/site/icons";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProduct(loaderData.slug) : undefined;
    if (!p) return {};
    const category = getCategory(p.category);
    const productLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      sku: p.sku,
      description: p.description,
      brand: { "@type": "Brand", name: p.brand },
      category: category?.name,
      image: [absoluteUrl(p.images[0] ?? category?.image.src ?? "")],
      url: absoluteUrl(`/produit/${p.slug}`),
      ...(p.price !== null
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "MAD",
              price: p.price.toFixed(2),
              availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/BackOrder",
              url: absoluteUrl(`/produit/${p.slug}`),
              seller: { "@type": "Organization", name: site.name },
            },
          }
        : {}),
    };
    return seo({
      title: `${p.name} — ${p.brand}`,
      description: `${p.description.slice(0, 140)}… ${p.price === null ? "Prix sur demande" : `${formatPrice(p.price)} TTC`}, livraison partout au Maroc.`,
      path: `/produit/${p.slug}`,
      type: "product",
      breadcrumbs: [
        { name: "Boutique", path: "/boutique" },
        ...(category ? [{ name: category.name, path: `/boutique/${category.slug}` }] : []),
        { name: p.name, path: `/produit/${p.slug}` },
      ],
      jsonLd: [productLd],
    });
  },
  component: ProductPage,
});

const reassurance = [
  { icon: Truck, title: "Livraison partout au Maroc", text: "24 à 72h dans les grandes villes" },
  { icon: Wrench, title: "Installation par nos techniciens", text: "Pose, paramétrage et mise en service" },
  { icon: ShieldCheck, title: "Garantie", text: "12 à 36 mois selon le produit" },
  { icon: Headphones, title: "Conseil expert", text: "Un technicien répond à vos questions" },
];

type Tab = "description" | "fiche" | "documents";

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const product = getProduct(slug)!;
  const category = getCategory(product.category);
  const service = getService(product.service);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [recent, setRecent] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    try {
      void navigator.clipboard.writeText(absoluteUrl(`/produit/${product.slug}`));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  const savings = product.oldPrice && product.price !== null && product.oldPrice > product.price ? product.oldPrice - product.price : null;
  const addToCart = useAddToCart();
  const { setStickyBarVisible, stickyBarVisible } = useUI();
  const addRef = useRef<HTMLButtonElement>(null);
  const stickyAddRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const discount = discountPercent(product);
  const isQuote = product.price === null;

  useEffect(() => {
    setQty(1);
    pushRecentlyViewed(product.slug);
    setRecent(
      getRecentlyViewed(product.slug)
        .map((s) => getProduct(s))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    );
  }, [product.slug]);

  // Mobile sticky bar appears once the main CTA scrolls out of view
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const obs = new IntersectionObserver(([entry]) => setStickyBarVisible(mq.matches && !entry!.isIntersecting && entry!.boundingClientRect.top < 0), {
      threshold: 0,
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      setStickyBarVisible(false);
    };
  }, [product.slug, setStickyBarVisible]);

  const waMessage = formatMessage(
    isQuote ? "Demande de prix — boutique PBXcom" : "Commande WhatsApp — boutique PBXcom",
    [
      ["Produit", product.name],
      ["Référence", product.sku],
      ["Quantité", String(qty)],
      ["Prix unitaire", product.price === null ? "sur demande" : `${formatPrice(product.price)} TTC`],
      ["Total", product.price === null ? undefined : `${formatPrice(product.price * qty)} TTC`],
      ["Lien", absoluteUrl(`/produit/${product.slug}`)],
    ],
    "Merci de me confirmer la disponibilité et les frais de livraison.",
  );

  const specs = Object.entries(product.specs);

  return (
    <>
      <PageBar
        crumbs={[{ label: "Boutique", href: "/boutique" }, ...(category ? [{ label: category.name, href: `/boutique/${category.slug}` }] : []), { label: product.name }]}
      />
      <section className="bg-paper pb-20 pt-8 md:pt-12">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductVisual
            src={product.images[0] ?? category?.image.src ?? ""}
            {...(category ? { fallbackSrc: category.image.src } : {})}
            alt={product.name}
            brand={product.brand}
            sku={product.sku}
            badge={
              <>
                {discount && <Badge tone="green">-{discount}%</Badge>}
                {isQuote && <Badge tone="ink">Sur devis</Badge>}
              </>
            }
          />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center justify-between gap-3">
              <Link to="/boutique/$category" params={{ category: product.category }} className="label-mono inline-flex items-center gap-2 text-green-deep hover:underline">
                {category && <category.icon className="size-3.5" strokeWidth={1.75} aria-hidden />}
                {product.brand} · {category?.name}
              </Link>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 text-[12px] text-ink/70 transition-colors hover:border-green-deep hover:text-ink"
              >
                {copied ? <Check className="size-3.5 text-green-deep" aria-hidden /> : <Link2 className="size-3.5" aria-hidden />}
                {copied ? "Lien copié" : "Copier le lien"}
              </button>
            </div>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">{product.name}</h1>
            <p className="mt-3 font-mono text-[13px] text-mute">
              Réf. <span className="text-ink/80">{product.sku}</span>
            </p>
            <div className="relative mt-6 overflow-hidden rounded-[18px] bg-white p-5 ring-1 ring-ink/[0.07]">
              <span className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,var(--green),var(--green-deep))]" aria-hidden />
              <div className="flex flex-wrap items-end justify-between gap-4">
                <PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" />
                <StockDot stock={product.stock} />
              </div>
              {savings !== null && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-green/15 px-3 py-1 text-[13px] font-medium text-green-deep">
                  Vous économisez {formatPrice(savings)}
                </p>
              )}
              {!isQuote && qty > 1 && product.price !== null && (
                <p className="mt-3 text-[14px] text-mute">
                  Total pour {qty} : <span className="font-display font-semibold text-ink">{formatPrice(product.price * qty)}</span> TTC
                </p>
              )}
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {product.shortSpecs.map((s) => (
                <li key={s} className="rounded-md bg-white px-2.5 py-1.5 font-mono text-[12px] text-ink/80 ring-1 ring-ink/[0.07]">
                  {s}
                </li>
              ))}
            </ul>

            <div ref={ctaRef} className="mt-6 flex flex-col gap-3">
              {!isQuote ? (
                <div className="flex gap-3">
                  <QuantityStepper value={qty} onChange={setQty} />
                  <Button ref={addRef} size="md" className="flex-1" icon={<ShoppingBag className="size-4" aria-hidden />} onClick={() => addToCart(product.slug, qty, addRef.current)}>
                    Ajouter au panier
                  </Button>
                </div>
              ) : (
                <p className="rounded-[12px] bg-white p-4 text-[14px] text-ink/80 ring-1 ring-ink/[0.07]">
                  Ce produit est dimensionné selon votre site. Demandez un devis : nous vous répondons en moins de 4h avec un prix installé.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/devis" search={{ service: product.service }} className={buttonVariants({ variant: isQuote ? "primary" : "dark", size: "md" })}>
                  <ButtonContent icon={<FileText className="size-4" aria-hidden />}>Demander un devis</ButtonContent>
                </Link>
                <a href={buildWhatsAppUrl(waMessage)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", size: "md" })}>
                  <ButtonContent icon={<WhatsAppIcon className="size-4" />}>Commander via WhatsApp</ButtonContent>
                </a>
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3">
              {reassurance.map((r) => (
                <li key={r.title} className="flex gap-3 rounded-[12px] bg-white p-3.5 ring-1 ring-ink/[0.06]">
                  <r.icon className="mt-0.5 size-5 shrink-0 text-green-deep" strokeWidth={1.5} aria-hidden />
                  <span>
                    <span className="block text-[13px] font-semibold leading-snug text-ink">{r.title}</span>
                    <span className="block text-[12px] text-mute">{r.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative mt-6 overflow-hidden rounded-[16px] bg-ink p-5 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-green/20 blur-2xl" aria-hidden />
              <div className="relative flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green text-ink">
                  <Wrench className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">Installation professionnelle disponible</p>
                  <p className="mt-1 text-sm text-white/60">
                    Nos techniciens posent, paramètrent et mettent en service ce produit{service ? ` dans le cadre de notre service ${service.name.toLowerCase()}` : ""}.
                  </p>
                  <ol className="mt-4 flex flex-wrap items-center gap-1.5 text-[12px] text-white/70">
                    {["Pose", "Paramétrage", "Mise en service", "Formation"].map((st, k, arr) => (
                      <li key={st} className="flex items-center gap-1.5">
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1">{st}</span>
                        {k < arr.length - 1 && <span className="h-px w-2 bg-green/50" aria-hidden />}
                      </li>
                    ))}
                  </ol>
                  <Link to="/devis" search={{ service: product.service }} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green hover:text-green-bright">
                    Obtenir un prix installé <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container-wide mt-16 md:mt-24">
          <SiteTabs
            label="Informations produit"
            variant="underline"
            layoutId="product-tabs"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "description", label: "Description" },
              { value: "fiche", label: "Fiche technique" },
              { value: "documents", label: "Documents" },
            ]}
          />
          <div role="tabpanel" className="pt-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {tab === "description" && (
                  <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                    <div className="max-w-[65ch] text-[17px] leading-relaxed text-ink/80">
                      <p>{product.description}</p>
                      {service && (
                        <p className="mt-5">
                          Ce produit fait partie de notre offre{" "}
                          <Link to="/solutions/$universe" params={{ universe: service.universe }} hash={service.slug} className="font-medium text-green-deep underline-offset-2 hover:underline">
                            {service.name.toLowerCase()}
                          </Link>
                          . {service.short}
                        </p>
                      )}
                    </div>
                    <ul className="flex flex-col gap-3">
                      {specs.slice(0, 4).map(([k, v]) => (
                        <li key={k} className="flex gap-3 text-[15px]">
                          <Check className="mt-1 size-4 shrink-0 text-green-deep" aria-hidden />
                          <span>
                            <span className="font-medium text-ink">{k} :</span> <span className="text-ink/75">{v}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tab === "fiche" && (
                  <table className="w-full max-w-3xl overflow-hidden rounded-[14px] text-left text-[15px] ring-1 ring-ink/[0.08]">
                    <caption className="sr-only">Fiche technique {product.name}</caption>
                    <tbody>
                      {[["Marque", product.brand], ["Référence", product.sku], ...specs].map(([k, v], i) => (
                        <tr key={k} className={i % 2 === 0 ? "bg-white" : "bg-paper"}>
                          <th scope="row" className="w-2/5 px-5 py-3.5 font-medium text-mute">
                            {k}
                          </th>
                          <td className="px-5 py-3.5 text-ink">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {tab === "documents" && (
                  <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
                    {[
                      { title: "Fiche technique constructeur", meta: `PDF · ${product.sku}` },
                      { title: "Guide d'installation", meta: "PDF · Français" },
                    ].map((d) => (
                      <li key={d.title}>
                        <a
                          href={buildWhatsAppUrl(`Bonjour, pouvez-vous m'envoyer le document « ${d.title} » du produit ${product.name} (${product.sku}) ?`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-4 rounded-[14px] bg-white p-4 ring-1 ring-ink/[0.07] transition-shadow hover:ring-green-deep/40"
                        >
                          <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-green">
                            <FileDown className="size-5" strokeWidth={1.5} aria-hidden />
                          </span>
                          <span className="flex-1">
                            <span className="block font-medium text-ink">{d.title}</span>
                            <span className="block font-mono text-[12px] text-mute">{d.meta} · envoyé sur demande</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {category && (
        <section className="bg-paper pb-16" aria-label={`Tous les produits ${category.name}`}>
          <div className="container-wide">
            <Link to="/boutique/$category" params={{ category: category.slug }} className="group relative isolate flex min-h-[180px] items-center justify-between gap-6 overflow-hidden rounded-[20px] px-6 py-8 md:px-10">
              <ProductImageBanner src={category.image.src} alt={category.name} />
              <div>
                <p className="label-mono text-[10px] text-green">Toute la gamme</p>
                <p className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">{category.name}</p>
                <p className="mt-1 max-w-[50ch] text-[14px] text-white/60">{category.short}</p>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green text-ink transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="size-5" aria-hidden />
              </span>
            </Link>
          </div>
        </section>
      )}

      <Section tone="white" aria-labelledby="related-title">
        <SectionHeading id="related-title" eyebrow="Vous aimerez aussi" title="Produits associés" />
        <ProductRail products={relatedProducts(product, 8)} label="Produits associés" />
      </Section>

      {recent.length > 0 && (
        <Section tone="light" className="!pt-0" aria-labelledby="recent-title">
          <div className="pt-16">
            <SectionHeading id="recent-title" eyebrow="Historique" title="Récemment consultés" className="!mb-10" />
            <ProductRail products={recent} label="Produits récemment consultés" />
          </div>
        </Section>
      )}

      {/* Mobile sticky bottom bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_-20px_oklch(0.155_0.006_165/0.4)] transition-transform duration-300 lg:hidden",
          stickyBarVisible ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!stickyBarVisible}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 shrink-0 overflow-hidden rounded-lg">
            <ProductImage product={product} sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-ink">{product.name}</p>
            <p className="font-display text-[15px] font-semibold text-ink">{product.price === null ? "Prix sur demande" : formatPrice(product.price)}</p>
          </div>
          {isQuote ? (
            <Link to="/devis" search={{ service: product.service }} tabIndex={stickyBarVisible ? 0 : -1} className={buttonVariants({ variant: "primary", size: "sm" })}>
              Devis
            </Link>
          ) : (
            <Button ref={stickyAddRef} size="sm" tabIndex={stickyBarVisible ? 0 : -1} icon={<ShoppingBag className="size-4" aria-hidden />} onClick={() => addToCart(product.slug, qty, stickyAddRef.current)}>
              Ajouter
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

/** Category banner background (image + ink gradient). */
function ProductImageBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img src={src} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" title={alt} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--ink)_30%,oklch(0.155_0.006_165/0.55))]" />
    </>
  );
}

/** Single product image — no gallery, one clean packshot. */
function ProductVisual({
  src,
  fallbackSrc,
  alt,
  brand,
  sku,
  badge,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  brand: string;
  sku: string;
  badge?: ReactNode;
}) {
  const [current, setCurrent] = useState(src);
  const [zoom, setZoom] = useState({ x: 50, y: 50, active: false });

  useEffect(() => setCurrent(src), [src]);

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div
        className="group relative isolate aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_30px_80px_-40px_rgba(10,13,12,0.35)]"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, active: true });
        }}
        onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
      >
        {/* soft grid + green glow behind the product */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#67D202]/10 blur-3xl" />

        <motion.img
          key={current}
          src={current}
          alt={alt}
          width={1200}
          height={1200}
          fetchPriority="high"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onError={() => {
            if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
          }}
          style={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
          className={cn(
            "h-full w-full object-contain p-6 transition-transform duration-300 ease-out md:p-10",
            zoom.active ? "md:scale-[1.6] md:cursor-zoom-in" : "scale-100",
          )}
        />

        {/* frame corners */}
        {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
          <span key={c} aria-hidden className={cn("pointer-events-none absolute size-5 rounded-[3px] border-[#67D202]/60", c)} />
        ))}

        {badge && <div className="absolute left-6 top-6 flex flex-wrap gap-2">{badge}</div>}

        <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-black/45">
          <span>{brand}</span>
          <span className="hidden transition-opacity group-hover:opacity-0 md:inline">Survoler pour zoomer</span>
          <span>{sku}</span>
        </div>
      </div>
    </div>
  );
}