import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, ShoppingBag, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui-state";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";
import { SiteSheet } from "@/components/site/site-sheet";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { ProductImage } from "@/components/site/product-card";
import { EmptyState } from "@/components/site/primitives";

export function useRemoveWithUndo() {
  const { items, remove, restore } = useCart();
  return (slug: string) => {
    const index = items.findIndex((i) => i.slug === slug);
    const item = items[index];
    const line = remove(slug);
    if (!line || !item) return;
    toast("Article retiré du panier", {
      description: item.product.name,
      action: { label: "Annuler", onClick: () => restore(line, index) },
    });
  };
}

export function CartDrawer() {
  const { items, count, subtotal, isQuote, setQty } = useCart();
  const { cartOpen, setCartOpen } = useUI();
  const removeWithUndo = useRemoveWithUndo();
  const close = () => setCartOpen(false);

  return (
    <SiteSheet
      open={cartOpen}
      onOpenChange={setCartOpen}
      title="Votre panier"
      description={count > 0 ? `${count} article${count > 1 ? "s" : ""}` : "Aucun article pour le moment"}
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-mute">Sous-total TTC</span>
              <span className="font-display text-2xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            {isQuote && (
              <p className="flex gap-2 rounded-[10px] bg-paper p-3 text-[13px] text-ink/80">
                <FileText className="mt-0.5 size-4 shrink-0 text-green-deep" aria-hidden />
                Certains articles sont sur devis : votre panier sera envoyé comme une demande de devis.
              </p>
            )}
            <p className="flex items-center gap-2 text-[13px] text-mute">
              <Truck className="size-4 text-green-deep" aria-hidden />
              {site.delivery.note}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/panier" onClick={close} className={buttonVariants({ variant: "secondary-light", size: "md" })}>
                Voir le panier
              </Link>
              <Link to="/commande" onClick={close} className={buttonVariants({ variant: "primary", size: "md" })}>
                <ButtonContent arrow>{isQuote ? "Demander" : "Commander"}</ButtonContent>
              </Link>
            </div>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={ShoppingBag}
            title="Votre panier est vide"
            text="Parcourez nos caméras, équipements réseau et téléphones IP, ou demandez-nous un devis sur mesure."
            action={
              <>
                <Link to="/boutique" onClick={close} className={buttonVariants({ variant: "dark", size: "md" })}>
                  <ButtonContent arrow>Découvrir la boutique</ButtonContent>
                </Link>
                <Link to="/devis" onClick={close} className={buttonVariants({ variant: "secondary-light", size: "md" })}>
                  Demander un devis
                </Link>
              </>
            }
          />
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-ink/[0.07] px-6">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.slug}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 py-5"
              >
                <Link
                  to="/produit/$slug"
                  params={{ slug: item.slug }}
                  onClick={close}
                  className="w-20 shrink-0 overflow-hidden rounded-xl border border-ink/[0.07]"
                >
                  <ProductImage product={item.product} sizes="80px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/produit/$slug"
                      params={{ slug: item.slug }}
                      onClick={close}
                      className="line-clamp-2 text-[15px] font-medium leading-snug hover:text-green-deep"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeWithUndo(item.slug)}
                      className="-mr-2 -mt-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-mute transition-colors hover:bg-white hover:text-[#E5484D]"
                      aria-label={`Retirer ${item.product.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <span className="label-mono text-[10px] text-mute">{item.product.sku}</span>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <QuantityStepper value={item.qty} onChange={(v) => setQty(item.slug, v)} size="sm" label={`Quantité pour ${item.product.name}`} />
                    <span className={cn("font-display font-semibold tabular-nums", item.lineTotal === null && "text-sm text-green-deep")}>
                      {item.lineTotal === null ? "Sur devis" : formatPrice(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </SiteSheet>
  );
}
