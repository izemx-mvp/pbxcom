import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, MessageCircle, ShieldCheck, ShoppingBag, Trash2, Truck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { PageBar } from "@/components/site/page-bar";
import { EmptyState, Section, SectionHeading } from "@/components/site/primitives";
import { ProductRail } from "@/components/site/product-rail";
import { relatedProducts, products, type Product } from "@/data/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { ProductImage } from "@/components/site/product-card";
import { useRemoveWithUndo } from "@/components/layout/cart-drawer";
import { CheckoutSteps } from "@/components/shop/checkout-steps";

export const Route = createFileRoute("/panier")({
  head: () => seo({ title: "Mon panier", description: "Votre sélection d'équipements PBXcom : vérifiez vos articles avant de commander.", path: "/panier", noindex: true }),
  component: CartPage,
});

function CartPage() {
  const { items, count, subtotal, isQuote, setQty, needsInstallation, setNeedsInstallation, hydrated } = useCart();
  const removeWithUndo = useRemoveWithUndo();
  const inCart = new Set(items.map((i) => i.slug));
  const suggestions: Product[] = (() => {
    const seen = new Set<string>();
    const out: Product[] = [];
    const source = items.length ? items.flatMap((i) => relatedProducts(i.product, 6)) : products.filter((p) => p.featured);
    for (const p of source) {
      if (inCart.has(p.slug) || seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push(p);
    }
    return out.slice(0, 8);
  })();

  return (
    <>
      <PageBar crumbs={[{ label: "Boutique", href: "/boutique" }, { label: "Panier" }]}>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h1 className="type-h1 flex items-center gap-4 text-white">
            Mon panier
            {hydrated && count > 0 && <span className="rounded-full bg-green px-3 py-1 font-mono text-base font-medium text-ink">{count}</span>}
          </h1>
          <CheckoutSteps current={0} />
        </div>
      </PageBar>
      <section className="min-h-[50vh] bg-paper pb-24 pt-10 md:pt-14">
        <div className="container-wide">
          {!hydrated ? (
            <div className="grid gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="skeleton h-32 rounded-[14px]" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Votre panier est vide"
              text="Découvrez nos caméras, équipements réseau et téléphones IP, ou décrivez votre projet pour recevoir un devis sur mesure."
              action={
                <>
                  <Link to="/boutique" className={buttonVariants({ variant: "dark", size: "lg" })}>
                    <ButtonContent arrow>Découvrir la boutique</ButtonContent>
                  </Link>
                  <Link to="/devis" className={buttonVariants({ variant: "secondary-light", size: "lg" })}>
                    Demander un devis
                  </Link>
                </>
              }
            />
          ) : (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1fr_400px]">
              <div>
                <div className="hidden grid-cols-[1fr_120px_140px_120px_44px] gap-4 border-b border-ink/[0.08] pb-3 text-[12px] md:grid">
                  <span className="label-mono text-mute">Produit</span>
                  <span className="label-mono text-mute">Prix unitaire</span>
                  <span className="label-mono text-mute">Quantité</span>
                  <span className="label-mono text-right text-mute">Total</span>
                  <span />
                </div>
                <ul className="divide-y divide-ink/[0.08]">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        layout
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-6 md:grid-cols-[1fr_120px_140px_120px_44px] md:items-center"
                      >
                        <div className="contents md:flex md:items-center md:gap-4">
                          <Link to="/produit/$slug" params={{ slug: item.slug }} className="row-span-3 w-[88px] shrink-0 overflow-hidden rounded-xl border border-ink/[0.07] md:row-span-1">
                            <ProductImage product={item.product} sizes="88px" />
                          </Link>
                          <div className="min-w-0">
                            <p className="label-mono text-[10px] text-green-deep">{item.product.brand}</p>
                            <Link to="/produit/$slug" params={{ slug: item.slug }} className="mt-1 line-clamp-2 font-medium text-ink hover:text-green-deep">
                              {item.product.name}
                            </Link>
                            <p className="mt-1 font-mono text-[11px] text-mute">{item.product.sku}</p>
                          </div>
                        </div>
                        <p className="col-start-2 text-[14px] text-ink/75 md:col-start-auto">
                          <span className="md:hidden">Prix unitaire : </span>
                          {item.product.price === null ? "Sur devis" : formatPrice(item.product.price)}
                        </p>
                        <div className="col-start-2 flex items-center justify-between gap-3 md:col-start-auto md:block">
                          <QuantityStepper value={item.qty} onChange={(v) => setQty(item.slug, v)} size="sm" label={`Quantité pour ${item.product.name}`} />
                          <span className="font-display font-semibold md:hidden">{item.lineTotal === null ? "Sur devis" : formatPrice(item.lineTotal)}</span>
                        </div>
                        <p className="hidden text-right font-display font-semibold text-ink md:block">{item.lineTotal === null ? "Sur devis" : formatPrice(item.lineTotal)}</p>
                        <button
                          type="button"
                          onClick={() => removeWithUndo(item.slug)}
                          className="col-start-2 flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg px-2 text-[13px] text-mute transition-colors hover:bg-white hover:text-[#E5484D] md:col-start-auto md:w-10 md:justify-center md:px-0"
                          aria-label={`Retirer ${item.product.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                          <span className="md:hidden">Retirer</span>
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <Link to="/boutique" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink link-underline">
                  ← Continuer mes achats
                </Link>
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Récapitulatif">
                <div className="rounded-[18px] border border-ink/[0.07] bg-white p-6 shadow-[0_30px_70px_-45px_oklch(0.155_0.006_165/0.5)]">
                  <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>
                  <dl className="mt-5 flex flex-col gap-3 text-[15px]">
                    <div className="flex justify-between">
                      <dt className="text-mute">
                        {count} article{count > 1 ? "s" : ""}
                      </dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-mute">Livraison</dt>
                      <dd className="text-right text-[14px] text-ink/75">{site.delivery.note}</dd>
                    </div>
                    {isQuote && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">Articles sur devis</dt>
                        <dd className="text-right text-[14px] text-green-deep">Prix communiqué sous 4h</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-5 flex items-baseline justify-between border-t border-ink/[0.08] pt-5">
                    <span className="font-medium">Total TTC</span>
                    <span className="font-display text-3xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                  </div>

                  <label className="mt-6 flex cursor-pointer gap-3 rounded-[12px] bg-paper p-4">
                    <input
                      type="checkbox"
                      checked={needsInstallation}
                      onChange={(e) => setNeedsInstallation(e.target.checked)}
                      className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--green-deep)]"
                    />
                    <span>
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <Wrench className="size-4 text-green-deep" aria-hidden /> J'ai besoin de l'installation
                      </span>
                      <span className="mt-1 block text-[13px] text-mute">Un technicien vous recontacte pour planifier la pose et la mise en service.</span>
                    </span>
                  </label>

                  {isQuote && (
                    <p className="mt-4 flex gap-2 rounded-[12px] border border-green-deep/25 bg-green/[0.06] p-3 text-[13px] text-ink/80">
                      <FileText className="mt-0.5 size-4 shrink-0 text-green-deep" aria-hidden />
                      Votre panier contient des articles sur devis : il sera envoyé comme une demande de devis.
                    </p>
                  )}

                  <div className="mt-6 flex flex-col gap-3">
                    <Link to="/commande" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
                      <ButtonContent arrow>{isQuote ? "Envoyer ma demande" : "Passer la commande"}</ButtonContent>
                    </Link>
                    {!isQuote && (
                      <Link to="/commande" search={{ mode: "devis" }} className={cn(buttonVariants({ variant: "secondary-light", size: "md" }), "w-full")}>
                        <ButtonContent icon={<FileText className="size-4" aria-hidden />}>Transformer en demande de devis</ButtonContent>
                      </Link>
                    )}
                  </div>
                  <a
                    href={buildWhatsAppUrl("Bonjour PBXcom, j'ai une question sur mon panier avant de commander.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 flex items-center gap-3 rounded-[12px] bg-ink p-4 text-white transition-colors hover:bg-graphite"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-ink">
                      <MessageCircle className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium">Une question avant de commander ?</span>
                      <span className="block text-[12px] text-white/55">Un conseiller vous répond sur WhatsApp</span>
                    </span>
                  </a>
                  <ul className="mt-6 flex flex-col gap-2 text-[13px] text-mute">
                    <li className="flex items-center gap-2">
                      <Truck className="size-4 text-green-deep" aria-hidden /> {site.delivery.short}
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-green-deep" aria-hidden /> Paiement à la livraison ou par virement
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      {hydrated && suggestions.length > 0 && (
        <Section tone="white" aria-labelledby="crosssell-title">
          <SectionHeading
            id="crosssell-title"
            eyebrow={items.length ? "Complétez votre installation" : "Nos incontournables"}
            title={items.length ? "Souvent ajoutés avec votre sélection" : "Commencez par ces équipements"}
            highlight={items.length ? "votre sélection" : "ces équipements"}
          />
          <ProductRail products={suggestions} label="Produits suggérés" />
        </Section>
      )}
    </>
  );
}