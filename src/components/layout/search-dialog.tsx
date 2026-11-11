import { useEffect, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText, LayoutGrid, Package, Search, Sparkles, X } from "lucide-react";
import { useUI } from "@/lib/ui-state";
import { kindLabels, search, type SearchEntry, type SearchKind } from "@/lib/search";
import { readStorage, writeStorage } from "@/lib/storage";
import { splitHref } from "@/components/site/app-link";
import { categories } from "@/data/categories";
import { getProduct } from "@/data/products";
import { ProductImage } from "@/components/site/product-card";

const RECENT_KEY = "pbxcom-recent-searches";
const kindIcon: Record<SearchKind, typeof Package> = {
  produit: Package,
  categorie: LayoutGrid,
  service: Sparkles,
  page: FileText,
};
const ORDER: SearchKind[] = ["produit", "categorie", "service", "page"];
const suggestions = ["caméra", "switch PoE", "téléphone IP", "badge", "Wi-Fi", "alarme"];

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useUI();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setRecent(readStorage<string[]>(RECENT_KEY, []));
      setQuery("");
    }
  }, [searchOpen]);

  const results = useMemo(() => search(query), [query]);
  const grouped = useMemo(() => {
    const map = new Map<SearchKind, SearchEntry[]>();
    for (const r of results) map.set(r.kind, [...(map.get(r.kind) ?? []), r]);
    return ORDER.flatMap((k) => (map.get(k) ? [[k, map.get(k)!.slice(0, k === "produit" ? 6 : 4)] as const] : []));
  }, [results]);

  const go = (href: string, saveQuery = true) => {
    if (saveQuery && query.trim().length >= 2) {
      const next = [query.trim(), ...recent.filter((r) => r.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
      writeStorage(RECENT_KEY, next);
    }
    setSearchOpen(false);
    const { path, hash, search: params } = splitHref(href);
    void navigate({ to: path as never, ...(hash ? { hash } : {}), ...(params ? { search: params as never } : {}) });
  };

  const clearRecent = () => {
    writeStorage(RECENT_KEY, []);
    setRecent([]);
  };

  const itemClass =
    "group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-white/80 outline-none transition-colors data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white";

  return (
    <DialogPrimitive.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-ink/75 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-[8vh] z-[91] w-[calc(100%-24px)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-[18px] bg-graphite text-white shadow-[0_40px_120px_-30px_oklch(0_0_0/0.8)] ring-1 ring-white/10 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4">
          <DialogPrimitive.Title className="sr-only">Rechercher sur PBXcom</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Produits, catégories, services et pages du site</DialogPrimitive.Description>
          <Command shouldFilter={false} loop label="Recherche">
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-5">
              <Search className="size-5 shrink-0 text-green" aria-hidden />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Rechercher un produit, un service, une page…"
                className="h-16 w-full bg-transparent text-[17px] text-white placeholder:text-white/35 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results.length === 0 && query.trim().length >= 2) {
                    e.preventDefault();
                    go(`/boutique?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
              />
              <kbd className="hidden rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-white/50 sm:block">Échap</kbd>
              <DialogPrimitive.Close className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:text-white sm:hidden" aria-label="Fermer la recherche">
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>
            <Command.List className="max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain p-3">
              {query.trim().length < 2 ? (
                <>
                  {recent.length > 0 && (
                    <Command.Group
                      heading={
                        <span className="flex items-center justify-between">
                          Recherches récentes
                          <button type="button" onClick={clearRecent} className="cursor-pointer normal-case tracking-normal text-white/40 hover:text-green">
                            Effacer
                          </button>
                        </span>
                      }
                      className="mb-2 [&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-white/40"
                    >
                      {recent.map((r) => (
                        <Command.Item key={r} value={`recent-${r}`} onSelect={() => setQuery(r)} className={itemClass}>
                          <Clock className="size-4 text-white/40" aria-hidden />
                          {r}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}
                  <Command.Group
                    heading="Suggestions"
                    className="mb-2 [&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-white/40"
                  >
                    <div className="flex flex-wrap gap-2 px-3 pb-3">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQuery(s)}
                          className="min-h-9 cursor-pointer rounded-full border border-white/10 bg-white/[0.03] px-3 text-sm text-white/75 transition-colors hover:border-green/60 hover:text-white"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </Command.Group>
                  <Command.Group
                    heading="Catégories"
                    className="[&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-white/40"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      {categories.map((c) => (
                        <Command.Item key={c.slug} value={`cat-${c.slug}`} onSelect={() => go(`/boutique/${c.slug}`, false)} className={itemClass}>
                          <span className="flex size-8 items-center justify-center rounded-lg bg-ink text-green">
                            <c.icon className="size-4" strokeWidth={1.5} aria-hidden />
                          </span>
                          {c.name}
                        </Command.Item>
                      ))}
                    </div>
                  </Command.Group>
                </>
              ) : grouped.length === 0 ? (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <p className="font-display text-lg font-semibold">Aucun résultat pour « {query} »</p>
                  <p className="mt-2 max-w-sm text-sm text-white/55">
                    Essayez un autre terme, ou décrivez votre besoin : nos conseillers vous proposent la solution adaptée.
                  </p>
                  <button
                    type="button"
                    onClick={() => go("/devis", false)}
                    className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] bg-green px-4 text-sm font-medium text-ink hover:bg-green-bright"
                  >
                    Demander un devis <ArrowRight className="size-4" />
                  </button>
                </div>
              ) : (
                grouped.map(([kind, entries]) => {
                  const Icon = kindIcon[kind];
                  return (
                    <Command.Group
                      key={kind}
                      heading={kindLabels[kind]}
                      className="mb-2 [&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-white/40"
                    >
                      {entries.map((entry) => {
                        const product = entry.slug ? getProduct(entry.slug) : undefined;
                        return (
                          <Command.Item key={entry.id} value={entry.id} onSelect={() => go(entry.href)} className={itemClass}>
                            {product ? (
                              <span className="w-10 shrink-0 overflow-hidden rounded-lg">
                                <ProductImage product={product} sizes="40px" />
                              </span>
                            ) : (
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ink text-green">
                                <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                              </span>
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[15px] font-medium">{entry.title}</span>
                              <span className="block truncate text-[13px] text-white/45">{entry.subtitle}</span>
                            </span>
                            <ArrowRight className="size-4 shrink-0 text-green opacity-0 transition-opacity group-data-[selected=true]:opacity-100" aria-hidden />
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  );
                })
              )}
            </Command.List>
            <div className="hidden items-center gap-4 border-t border-white/[0.08] px-5 py-3 text-[12px] text-white/40 sm:flex">
              <span>
                <kbd className="font-mono">↑↓</kbd> naviguer
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> ouvrir
              </span>
              <span className="ml-auto">{results.length > 0 && `${results.length} résultat${results.length > 1 ? "s" : ""}`}</span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
