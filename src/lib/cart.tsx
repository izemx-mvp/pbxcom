import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/data/products";
import { readStorage, writeStorage } from "./storage";

export type CartLine = { slug: string; qty: number };
export type CartItem = CartLine & { product: Product; lineTotal: number | null };

type CartState = { lines: CartLine[]; needsInstallation: boolean };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** true when at least one item has no price → the cart becomes a quote request */
  isQuote: boolean;
  needsInstallation: boolean;
  hydrated: boolean;
  setNeedsInstallation: (value: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => CartLine | undefined;
  restore: (line: CartLine, index?: number) => void;
  clear: () => void;
  getQty: (slug: string) => number;
};

const STORAGE_KEY = "pbxcom-cart-v1";
const MAX_QTY = 99;
const CartContext = createContext<CartContextValue | null>(null);

const clampQty = (qty: number) => Math.max(1, Math.min(MAX_QTY, Math.round(qty)));

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ lines: [], needsInstallation: false });
  const [hydrated, setHydrated] = useState(false);
  const skipFirstWrite = useRef(true);

  useEffect(() => {
    const saved = readStorage<CartState>(STORAGE_KEY, { lines: [], needsInstallation: false });
    const lines = Array.isArray(saved.lines)
      ? saved.lines.filter((l) => typeof l.slug === "string" && getProduct(l.slug)).map((l) => ({ slug: l.slug, qty: clampQty(l.qty) }))
      : [];
    setState({ lines, needsInstallation: Boolean(saved.needsInstallation) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipFirstWrite.current) {
      skipFirstWrite.current = false;
      return;
    }
    writeStorage(STORAGE_KEY, state);
  }, [state, hydrated]);

  // Keep several tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setState(readStorage<CartState>(STORAGE_KEY, { lines: [], needsInstallation: false }));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    if (!getProduct(slug)) return;
    setState((s) => {
      const existing = s.lines.find((l) => l.slug === slug);
      const lines = existing
        ? s.lines.map((l) => (l.slug === slug ? { ...l, qty: clampQty(l.qty + qty) } : l))
        : [...s.lines, { slug, qty: clampQty(qty) }];
      return { ...s, lines };
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setState((s) => ({ ...s, lines: s.lines.map((l) => (l.slug === slug ? { ...l, qty: clampQty(qty) } : l)) }));
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const remove = useCallback((slug: string) => {
    const line = stateRef.current.lines.find((l) => l.slug === slug);
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.slug !== slug) }));
    return line;
  }, []);

  const restore = useCallback((line: CartLine, index?: number) => {
    setState((s) => {
      if (s.lines.some((l) => l.slug === line.slug)) return s;
      const lines = [...s.lines];
      lines.splice(index ?? lines.length, 0, line);
      return { ...s, lines };
    });
  }, []);

  const clear = useCallback(() => setState({ lines: [], needsInstallation: false }), []);
  const setNeedsInstallation = useCallback((value: boolean) => setState((s) => ({ ...s, needsInstallation: value })), []);

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = state.lines.flatMap((line) => {
      const product = getProduct(line.slug);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price === null ? null : product.price * line.qty }];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + (i.lineTotal ?? 0), 0),
      isQuote: items.some((i) => i.product.price === null),
      needsInstallation: state.needsInstallation,
      hydrated,
      setNeedsInstallation,
      add,
      setQty,
      remove,
      restore,
      clear,
      getQty: (slug) => state.lines.find((l) => l.slug === slug)?.qty ?? 0,
    };
  }, [state, hydrated, add, setQty, remove, restore, clear, setNeedsInstallation]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
