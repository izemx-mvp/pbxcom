import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, FileText, ShoppingBag, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import { images } from "@/config/images";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { useUI } from "@/lib/ui-state";
import { Badge, PriceTag, StockDot } from "./primitives";
import { SmartImage } from "./smart-image";

export function ProductImage({
  product,
  index = 0,
  className,
  ratio = "1/1",
  priority,
  sizes,
}: {
  product: Product;
  index?: number;
  className?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const category = getCategory(product.category);
  const fallback = category?.image ?? images.misc.ctaBackground;
  return (
    <SmartImage
      src={product.images[index] ?? product.images[0] ?? fallback.src}
      fallbackSrc={fallback.src}
      alt={product.name}
      width={1200}
      height={1200}
      ratio={ratio}
      label={product.brand}
      className={className}
      priority={priority ?? false}
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
      objectPosition={`${30 + ((product.sku.length * 7) % 40)}% 50%`}
    />
  );
}

export function discountPercent(product: Product) {
  if (!product.oldPrice || product.price === null || product.oldPrice <= product.price) return null;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export function ProductCard({ product, layout = "grid", className }: { product: Product; layout?: "grid" | "list"; className?: string }) {
  const addToCart = useAddToCart();
  const { setQuickView } = useUI();
  const addRef = useRef<HTMLButtonElement>(null);
  const discount = discountPercent(product);
  const isList = layout === "list";
  const category = getCategory(product.category);
  const CatIcon = category?.icon;

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-[16px] border border-ink/[0.07] bg-white transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-green-deep/35 hover:shadow-[0_28px_56px_-30px_oklch(0.155_0.006_165/0.5)] focus-within:border-green-deep/50",
        isList ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      {/* Image */}
      <div className={cn("relative overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#ffffff,var(--paper))]", isList ? "sm:w-64 sm:shrink-0" : "")}>
        <ProductImage product={product} className="bg-paper [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.07]" />
        {/* soft bottom shade so the action bar stays readable */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100" aria-hidden />

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount && <Badge tone="green">-{discount}%</Badge>}
          {product.price === null && <Badge tone="ink">Sur devis</Badge>}
          {product.featured && !discount && product.price !== null && <Badge tone="outline">Sélection</Badge>}
        </div>
        {CatIcon && (
          <span
            className="pointer-events-none absolute right-3 top-3 flex size-9 items-center justify-center rounded-xl bg-white/90 text-green-deep shadow-[inset_0_0_0_1px_oklch(0.155_0.006_165/0.08)] transition-colors duration-300 group-hover:bg-ink group-hover:text-green"
            title={category?.name}
            aria-hidden
          >
            <CatIcon className="size-4" strokeWidth={1.5} />
          </span>
        )}

        {/* Action bar */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-0 gap-2 opacity-100 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-[calc(100%+16px)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          {product.price !== null ? (
            <button
              ref={addRef}
              type="button"
              onClick={() => addToCart(product.slug, 1, addRef.current)}
              className="relative z-10 flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-green text-sm font-medium text-ink transition-colors hover:bg-green-bright"
            >
              <ShoppingBag className="size-4" aria-hidden />
              Ajouter
            </button>
          ) : (
            <Link
              to="/devis"
              search={{ service: product.service }}
              className="relative z-10 flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink text-sm font-medium text-white transition-colors hover:bg-graphite"
            >
              <FileText className="size-4" aria-hidden />
              Demander un devis
            </Link>
          )}
          <button
            type="button"
            onClick={() => setQuickView(product.slug)}
            aria-label={`Aperçu rapide : ${product.name}`}
            className="relative z-10 flex size-10 cursor-pointer items-center justify-center rounded-[10px] bg-white text-ink shadow-[inset_0_0_0_1px_oklch(0.155_0.006_165/0.1)] transition-colors hover:text-green-deep"
          >
            <Eye className="size-4" aria-hidden />
          </button>
          {product.price !== null && (
            <Link
              to="/devis"
              search={{ service: product.service }}
              aria-label={`Demander un devis : ${product.name}`}
              className="relative z-10 flex size-10 items-center justify-center rounded-[10px] bg-white text-ink shadow-[inset_0_0_0_1px_oklch(0.155_0.006_165/0.1)] transition-colors hover:text-green-deep"
            >
              <FileText className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono text-[11px] text-green-deep">{product.brand}</span>
          <StockDot stock={product.stock} className="text-[12px] text-mute" />
        </div>
        <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-[17px] font-semibold leading-snug text-ink">
          <Link to="/produit/$slug" params={{ slug: product.slug }} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        {isList && <p className="line-clamp-2 text-sm text-mute">{product.description}</p>}
        <div className="flex flex-wrap gap-1.5">
          {product.shortSpecs.slice(0, isList ? 4 : 2).map((s) => (
            <span key={s} className="rounded-md bg-paper px-2 py-1 font-mono text-[11px] text-ink/75 transition-colors duration-300 group-hover:bg-ink/[0.06]">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-ink/10 pt-4">
          <PriceTag price={product.price} oldPrice={product.oldPrice} />
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-mute" title="Installation possible par nos techniciens">
            <Wrench className="size-3.5 text-green-deep" aria-hidden />
            <span className="hidden sm:inline">Pose possible</span>
          </span>
        </div>
        {/* circuit underline */}
        <svg viewBox="0 0 300 8" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2 w-full">
          <path
            d="M0 6 H120 L126 2 H174 L180 6 H300"
            fill="none"
            stroke="var(--green)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[stroke-dashoffset:0]"
          />
        </svg>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-ink/[0.07] bg-white">
      <div className="skeleton aspect-square" />
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="skeleton mt-4 h-6 w-28 rounded" />
      </div>
    </div>
  );
}