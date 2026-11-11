import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, ShoppingBag, X } from "lucide-react";
import { useUI } from "@/lib/ui-state";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { getProduct } from "@/data/products";
import { buttonVariants, ButtonContent, Button } from "@/components/site/button";
import { PriceTag, StockDot } from "@/components/site/primitives";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { ProductImage } from "@/components/site/product-card";

export function QuickView() {
  const { quickView, setQuickView } = useUI();
  const product = quickView ? getProduct(quickView) : undefined;
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart();
  const addRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setQty(1), [quickView]);

  return (
    <DialogPrimitive.Root open={Boolean(product)} onOpenChange={(o) => !o && setQuickView(null)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-ink/70 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[81] grid max-h-[90svh] w-[calc(100%-32px)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 md:grid-cols-2 md:overflow-hidden">
          {product && (
            <>
              <div className="relative bg-paper">
                <ProductImage product={product} className="h-full md:min-h-full" sizes="(min-width: 768px) 450px, 100vw" />
              </div>
              <div className="flex flex-col gap-5 p-6 md:overflow-y-auto md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="label-mono text-green-deep">{product.brand}</span>
                  <DialogPrimitive.Close className="-mr-2 -mt-2 flex size-11 cursor-pointer items-center justify-center rounded-[10px] hover:bg-paper" aria-label="Fermer l'aperçu">
                    <X className="size-5" />
                  </DialogPrimitive.Close>
                </div>
                <DialogPrimitive.Title className="-mt-3 font-display text-2xl font-semibold leading-tight">{product.name}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-[15px] leading-relaxed text-mute">{product.description}</DialogPrimitive.Description>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <PriceTag price={product.price} oldPrice={product.oldPrice} size="md" />
                  <StockDot stock={product.stock} />
                </div>
                <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink/[0.07] bg-ink/[0.07] text-sm">
                  {Object.entries(product.specs)
                    .slice(0, 4)
                    .map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[120px_1fr] gap-3 bg-white px-4 py-2.5">
                        <dt className="text-mute">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                </dl>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  {product.price !== null ? (
                    <>
                      <QuantityStepper value={qty} onChange={setQty} />
                      <Button
                        ref={addRef}
                        onClick={() => {
                          addToCart(product.slug, qty, addRef.current);
                          setQuickView(null);
                        }}
                        className="flex-1"
                        icon={<ShoppingBag className="size-4" aria-hidden />}
                      >
                        Ajouter au panier
                      </Button>
                    </>
                  ) : (
                    <Link to="/devis" search={{ service: product.service }} onClick={() => setQuickView(null)} className={buttonVariants({ variant: "primary", size: "md" }) + " flex-1"}>
                      <ButtonContent icon={<FileText className="size-4" aria-hidden />} arrow>
                        Demander un devis
                      </ButtonContent>
                    </Link>
                  )}
                </div>
                <Link
                  to="/produit/$slug"
                  params={{ slug: product.slug }}
                  onClick={() => setQuickView(null)}
                  className="inline-flex items-center gap-2 self-start text-sm font-medium text-ink link-underline"
                >
                  Voir la fiche complète <ArrowRight className="size-4" />
                </Link>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
