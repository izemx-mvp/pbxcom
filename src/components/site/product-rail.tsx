import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { buttonVariants } from "./button";
import { ProductCard } from "./product-card";

/** Horizontal snap carousel with arrows (desktop) and native drag/swipe (mobile). */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.min(ref.current.clientWidth * 0.8, 640), behavior: "smooth" });
  if (products.length === 0) return null;
  return (
    <div className="relative">
      <div className="absolute -top-16 right-0 hidden gap-2 md:flex">
        <button type="button" onClick={() => scroll(-1)} className={buttonVariants({ variant: "icon-light", size: "icon" })} aria-label="Produits précédents">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => scroll(1)} className={buttonVariants({ variant: "icon-light", size: "icon" })} aria-label="Produits suivants">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div ref={ref} role="region" aria-label={label} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        {products.map((p) => (
          <div key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc(25%-12px)]">
            <ProductCard product={p} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
