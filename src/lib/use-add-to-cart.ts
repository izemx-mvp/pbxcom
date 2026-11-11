import { useCallback } from "react";
import { toast } from "sonner";
import { useCart } from "./cart";
import { flyToCart } from "./fly-to-cart";
import { useUI } from "./ui-state";
import { getProduct } from "@/data/products";

/** Add to cart + fly animation + toast with a shortcut to the cart. */
export function useAddToCart() {
  const { add } = useCart();
  const { setCartOpen } = useUI();
  return useCallback(
    (slug: string, qty = 1, source?: HTMLElement | null) => {
      const product = getProduct(slug);
      if (!product) return;
      add(slug, qty);
      flyToCart(source ?? null);
      toast.success("Ajouté au panier", {
        description: `${qty > 1 ? `${qty} × ` : ""}${product.name}`,
        action: { label: "Voir le panier", onClick: () => setCartOpen(true) },
      });
    },
    [add, setCartOpen],
  );
}
