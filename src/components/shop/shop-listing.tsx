import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  List,
  MessageCircle,
  PackageSearch,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { products, priceBounds, type Product } from "@/data/products";
import { categories, type Category } from "@/data/categories";
import { searchProductSlugs } from "@/lib/search";
import { formatNumber, formatPrice } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { Breadcrumbs, CardCircuit } from "@/components/site/blocks";
import { CircuitLines, Glow, GridBackground } from "@/components/site/circuit";
import { EmptyState, Eyebrow, PriceTag } from "@/components/site/primitives";
import { ProductCard, ProductCardSkeleton, ProductImage, discountPercent } from "@/components/site/product-card";
import { SiteSheet } from "@/components/site/site-sheet";
import { SmartImage } from "@/components/site/smart-image";
import { EASE } from "@/components/site/motion";
import { Switch } from "@/components/ui/switch";

type Sort = "pertinence" | "prix-asc" | "prix-desc" | "nouveautes";
const sortLabels: Record<Sort, string> = {
  pertinence: "Pertinence",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  nouveautes: "Nouveautés",
};

type Filters = { categories: string[]; brands: string[]; price: [number, number]; inStock: boolean };

const defaultFilters = (category?: Category): Filters => ({
  categories: category ? [category.slug] : [],
  brands: [],
  price: [priceBounds.min, priceBounds.max],
  inStock: false,
});

const popularSearches = ["Caméra 4K", "Switch PoE", "Wi-Fi 6", "Kit alarme", "Pointeuse", "Téléphone IP"];

const perks = [
  { icon: Truck, label: "Livraison partout au Maroc" },
  { icon: Wrench, label: "Installation par nos techniciens" },
  { icon: CreditCard, label: "Paiement à la livraison" },
];

/* ───────── Search box */
function ShopSearch({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  const [value, setValue] = useState(query);
  useEffect(() => setValue(query), [query]);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onQuery(value.trim());
      }}
      className="relative"
    >
      <label htmlFor="shop-search" className="sr-only">
        Rechercher dans la boutique
      </label>
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-green" aria-hidden />
      <input
        id="shop-search"
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value === "") onQuery("");
        }}
        placeholder="Caméra 4K, switch PoE, téléphone IP…"
        className="h-16 w-full rounded-[14px] border border-white/10 bg-white/[0.06] pl-14 pr-32 text-[16px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-green [&::-webkit-search-cancel-button]:hidden"
      />
      <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "absolute right-2 top-1/2 -translate-y-1/2")}>
        Rechercher
      </button>
    </form>
  );
}

/* ───────── Deals carousel (real discounted products) */
function DealsCard() {
  const reduce = useReducedMotion();
  const deals = useMemo(() => products.filter((p) => discountPercent(p) !== null), []);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce || deals.length < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % deals.length), 4500);
    return () => window.clearInterval(t);
  }, [reduce, deals.length]);
  const deal = deals[i];
  if (!deal) return null;
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-graphite ring-1 ring-white/10">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
        <span className="label-mono flex items-center gap-2 text-[10px] text-green">
          <Sparkles className="size-3.5" aria-hidden /> Offres du moment
        </span>
        <div className="flex gap-1.5" aria-hidden>
          {deals.map((d, k) => (
            <span key={d.slug} className={cn("h-1 rounded-full transition-all duration-300", k === i ? "w-5 bg-green" : "w-1.5 bg-white/20")} />
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={deal.slug} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35, ease: EASE }}>
          <Link to="/produit/$slug" params={{ slug: deal.slug }} className="group grid grid-cols-[120px_1fr] items-center gap-4 p-4 sm:grid-cols-[150px_1fr]">
            <div className="relative overflow-hidden rounded-xl">
              <ProductImage product={deal} sizes="150px" className="[&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
              <span className="label-mono absolute left-2 top-2 rounded-full bg-green px-2 py-0.5 text-[10px] text-ink">-{discountPercent(deal)}%</span>
            </div>
            <div className="min-w-0">
              <p className="label-mono text-[10px] text-white/45">{deal.brand}</p>
              <p className="mt-1 line-clamp-2 font-display text-[16px] font-semibold leading-snug text-white">{deal.name}</p>
              <PriceTag price={deal.price} oldPrice={deal.oldPrice} tone="dark" className="mt-3" />
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] text-green">
                Voir l'offre <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ───────── Category stats (derived from data) */
function CategoryStats({ category }: { category: Category }) {
  const list = products.filter((p) => p.category === category.slug);
  const priced = list.map((p) => p.price).filter((v): v is number => v !== null);
  const stats = [
    { k: "Produits", v: formatNumber(list.length) },
    { k: "En stock", v: formatNumber(list.filter((p) => p.stock > 0).length) },
    { k: "À partir de", v: priced.length ? formatPrice(Math.min(...priced)) : "Sur devis" },
  ];
  return (
    <dl className="grid grid-cols-3 overflow-hidden rounded-[16px] bg-ink/70 ring-1 ring-white/10">
      {stats.map((s, i) => (
        <div key={s.k} className={cn("px-4 py-4", i > 0 && "border-l border-white/[0.08]")}>
          <dt className="label-mono text-[10px] text-white/45">{s.k}</dt>
          <dd className="mt-1 font-display text-lg font-semibold text-white">{s.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ───────── Hero */
function ShopHero({ category, count, query, onQuery }: { category?: Category | undefined; count: number; query: string; onQuery: (q: string) => void }) {
  return (
    <section className="surface-dark relative isolate overflow-hidden bg-noise">
      {category ? (
        <div className="absolute inset-0 -z-10">
          <SmartImage {...category.image} fill priority imgClassName="opacity-55" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_25%,oklch(0.155_0.006_165/0.55))]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        </div>
      ) : (
        <>
          <GridBackground className="-z-10" />
          <CircuitLines variant="corner" className="-z-10" opacity={0.4} />
          <Glow className="-left-40 top-0 -z-10 size-[480px]" />
          <Glow className="-right-40 bottom-0 -z-10 size-[420px] opacity-60" />
        </>
      )}
      <div className="container-wide pb-12 pt-[calc(var(--header-h)+40px)] md:pb-14">
        <Breadcrumbs items={category ? [{ label: "Boutique", href: "/boutique" }, { label: category.name }] : [{ label: "Boutique" }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_minmax(0,460px)] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <Eyebrow>{category ? category.short : "Boutique en ligne"}</Eyebrow>
            <h1 className="type-h1 mt-4 text-white">
              {category ? (
                category.name
              ) : (
                <>
                  Le matériel des pros, <span className="text-green">livré chez vous</span>
                </>
              )}
            </h1>
            <p className="mt-4 max-w-[58ch] text-white/65">
              {category ? category.description : "Les équipements de sécurité, réseau et télécom que nos techniciens installent chaque jour. Prix TTC, avec ou sans installation."}
            </p>
            <div className="mt-7 max-w-xl">
              <ShopSearch query={query} onQuery={onQuery} />
              {!category && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="label-mono text-[10px] text-white/40">Populaires</span>
                  {popularSearches.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onQuery(t)}
                      className="cursor-pointer rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-green/60 hover:text-white"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="label-mono mt-6 text-white/50">
              <span className="text-green">{formatNumber(count)}</span> produit{count > 1 ? "s" : ""} disponible{count > 1 ? "s" : ""}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
            {category ? <CategoryStats category={category} /> : <DealsCard />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Sticky category bar */
function CategoryBar({ category }: { category?: Category | undefined }) {
  const chip = (on: boolean) =>
    cn(
      "flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm transition-colors",
      on ? "border-green bg-green text-ink" : "border-white/12 bg-white/[0.04] text-white/75 hover:border-green/60 hover:text-white",
    );
  return (
    <div className="surface-dark sticky top-[var(--header-h)] z-30 border-y border-white/[0.07] bg-ink">
      <ul className="no-scrollbar container-wide flex gap-2 overflow-x-auto py-3">
        <li>
          <Link to="/boutique" className={chip(!category)}>
            Tout
          </Link>
        </li>
        {categories.map((c) => {
          const on = category?.slug === c.slug;
          return (
            <li key={c.slug}>
              <Link to="/boutique/$category" params={{ category: c.slug }} className={chip(on)}>
                <c.icon className={cn("size-4", on ? "text-ink" : "text-green")} strokeWidth={1.5} aria-hidden />
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────── Category bento (index, no query) */
function CategoryBento() {
  return (
    <section className="bg-paper pt-12 md:pt-16" aria-labelledby="cat-title">
      <div className="container-wide">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="label-mono text-green-deep">8 catégories</p>
            <h2 id="cat-title" className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Explorez par univers
            </h2>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const big = i === 0 || i === 4;
            return (
              <motion.li
                key={c.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.45, ease: EASE, delay: (i % 4) * 0.05 }}
                className={cn(big && "md:col-span-2")}
              >
                <Link
                  to="/boutique/$category"
                  params={{ category: c.slug }}
                  className="group relative isolate flex h-[200px] flex-col justify-end overflow-hidden rounded-[16px] p-4 md:h-[240px] md:p-5"
                >
                  <SmartImage {...c.image} fill className="-z-10" imgClassName="transition-transform duration-700 group-hover:scale-[1.06]" sizes="(min-width:768px) 50vw, 50vw" />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.05),oklch(0.155_0.006_165/0.9))]" />
                  <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl bg-ink/80 text-green ring-1 ring-white/10 transition-colors group-hover:bg-green group-hover:text-ink md:left-5 md:top-5">
                    <c.icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white opacity-0 ring-1 ring-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100 md:right-5 md:top-5">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                  <p className="label-mono text-[10px] text-green">
                    {count} produit{count > 1 ? "s" : ""}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-white md:text-xl">{c.name}</h3>
                  {big && <p className="mt-1 hidden text-[13px] text-white/65 md:block">{c.short}</p>}
                  <CardCircuit />
                </Link>
              </motion.li>
            );
          })}
        </ul>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {perks.map((p) => (
            <li key={p.label} className="flex items-center gap-3 rounded-[14px] border border-ink/[0.07] bg-white px-4 py-3.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-green">
                <p.icon className="size-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="text-sm font-medium text-ink">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── In-grid promo card */
function InstallPromo({ view }: { view: "grid" | "list" }) {
  return (
    <div className={cn("relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[14px] bg-ink p-6 text-white", view === "grid" ? "min-h-[380px]" : "min-h-[200px]")}>
      <CircuitLines variant="corner" className="-z-10" opacity={0.35} />
      <Glow className="-bottom-20 -right-20 -z-10 size-[260px]" />
      <span className="flex size-12 items-center justify-center rounded-xl bg-green text-ink">
        <Wrench className="size-5" strokeWidth={1.5} aria-hidden />
      </span>
      <div>
        <p className="label-mono text-[10px] text-green">Service PBXcom</p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">Besoin d'une installation ?</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-white/65">Nos techniciens posent, configurent et mettent en service le matériel acheté en ligne.</p>
        <Link to="/devis" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-5")}>
          <ButtonContent arrow>Devis en &lt; 4h</ButtonContent>
        </Link>
      </div>
    </div>
  );
}

/* ───────── Filter panel */
function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/[0.08] py-5 first:pt-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full cursor-pointer items-center justify-between text-left">
        <span className="label-mono text-[11px] text-ink">{title}</span>
        <ChevronDown className={cn("size-4 text-mute transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ checked, onChange, label, count, icon }: { checked: boolean; onChange: () => void; label: string; count: number; icon?: ReactNode }) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-[14px] transition-colors hover:bg-white", count === 0 && !checked && "opacity-45")}>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-ink/25 bg-white transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green"
        aria-hidden
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="size-3 text-green">
            <path d="M2.5 6.5l2.2 2.2L9.5 3.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {icon}
      <span className="flex-1 text-ink/85">{label}</span>
      <span className="font-mono text-[11px] text-mute">{count}</span>
    </label>
  );
}

function FilterPanel({
  filters,
  setFilters,
  pool,
  category,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  pool: Product[];
  category?: Category | undefined;
  onReset: () => void;
}) {
  const toggle = (key: "categories" | "brands", value: string) =>
    setFilters({ ...filters, [key]: filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value] });
  const brandCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) if (!category || p.category === category.slug) map.set(p.brand, map.get(p.brand) ?? 0);
    for (const p of pool) map.set(p.brand, (map.get(p.brand) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [pool, category]);

  return (
    <div>
      {!category && (
        <FilterGroup title="Catégorie">
          <div className="flex flex-col">
            {categories.map((c) => (
              <CheckRow
                key={c.slug}
                checked={filters.categories.includes(c.slug)}
                onChange={() => toggle("categories", c.slug)}
                label={c.name}
                count={products.filter((p) => p.category === c.slug).length}
                icon={<c.icon className="size-4 text-green-deep" strokeWidth={1.5} aria-hidden />}
              />
            ))}
          </div>
        </FilterGroup>
      )}
      {category && (
        <FilterGroup title="Autres catégories" defaultOpen={false}>
          <div className="flex flex-col">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link key={c.slug} to="/boutique/$category" params={{ category: c.slug }} className="flex min-h-10 items-center gap-3 rounded-lg px-2 text-[14px] text-ink/80 hover:bg-white hover:text-ink">
                  <c.icon className="size-4 text-green-deep" strokeWidth={1.5} aria-hidden />
                  {c.name}
                </Link>
              ))}
          </div>
        </FilterGroup>
      )}
      <FilterGroup title="Marque">
        <div className="flex flex-col">
          {brandCounts.map(([brand, count]) => (
            <CheckRow key={brand} checked={filters.brands.includes(brand)} onChange={() => toggle("brands", brand)} label={brand} count={count} />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Prix (TTC)">
        <SliderPrimitive.Root
          min={priceBounds.min}
          max={priceBounds.max}
          step={50}
          value={filters.price}
          onValueChange={(v) => setFilters({ ...filters, price: [v[0] ?? priceBounds.min, v[1] ?? priceBounds.max] })}
          minStepsBetweenThumbs={1}
          className="relative mt-2 flex h-6 w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-ink/10">
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-green" />
          </SliderPrimitive.Track>
          {["Prix minimum", "Prix maximum"].map((l) => (
            <SliderPrimitive.Thumb
              key={l}
              aria-label={l}
              className="block size-5 cursor-grab rounded-full border-2 border-ink bg-white shadow-md transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green active:cursor-grabbing"
            />
          ))}
        </SliderPrimitive.Root>
        <div className="mt-3 flex justify-between font-mono text-[12px] text-ink/70">
          <span>{formatPrice(filters.price[0])}</span>
          <span>{formatPrice(filters.price[1])}</span>
        </div>
        <p className="mt-2 text-[12px] text-mute">Les produits sur devis restent affichés.</p>
      </FilterGroup>
      <div className="flex items-center justify-between py-5">
        <label htmlFor="in-stock" className="cursor-pointer text-[14px] text-ink/85">
          En stock uniquement
        </label>
        <Switch id="in-stock" checked={filters.inStock} onCheckedChange={(v) => setFilters({ ...filters, inStock: v })} className="data-[state=checked]:bg-green-deep" />
      </div>
      <button type="button" onClick={onReset} className={cn(buttonVariants({ variant: "secondary-light", size: "sm" }), "w-full")}>
        Réinitialiser les filtres
      </button>

      {/* Help card */}
      <div className="relative mt-6 overflow-hidden rounded-[14px] bg-ink p-5 text-white">
        <p className="font-display text-[15px] font-semibold">Un doute sur le bon modèle ?</p>
        <p className="mt-1.5 text-[13px] text-white/60">Un conseiller vous oriente gratuitement.</p>
        <a
          href={buildWhatsAppUrl("Bonjour PBXcom, j'ai besoin d'un conseil pour choisir un équipement.")}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }), "mt-4 w-full")}
        >
          <ButtonContent icon={<MessageCircle className="size-4" aria-hidden />}>Conseil WhatsApp</ButtonContent>
        </a>
      </div>
    </div>
  );
}

/* ───────── Listing */
export function ShopListing({ category, query = "" }: { category?: Category; query?: string }) {
  const navigate = useNavigate();
  const [filters, setFiltersState] = useState<Filters>(() => defaultFilters(category));
  const [sort, setSort] = useState<Sort>("pertinence");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFiltersState(defaultFilters(category));
  }, [category]);

  const pulse = () => {
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLoading(false), 280);
  };
  const setFilters = (f: Filters) => {
    setFiltersState(f);
    pulse();
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const setQuery = (q: string) => {
    pulse();
    if (category) void navigate({ to: "/boutique", search: q ? { q } : {} });
    else void navigate({ to: "/boutique", search: q ? { q } : {}, replace: true });
    if (q) window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const queryOrder = useMemo(() => (query ? searchProductSlugs(query) : null), [query]);

  const pool = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category.slug) : products;
    if (queryOrder) list = list.filter((p) => queryOrder.includes(p.slug));
    return list;
  }, [category, queryOrder]);

  const results = useMemo(() => {
    let list = pool.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.inStock && p.stock === 0) return false;
      if (p.price !== null && (p.price < filters.price[0] || p.price > filters.price[1])) return false;
      return true;
    });
    list = [...list];
    if (sort === "prix-asc") list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (sort === "prix-desc") list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    else if (sort === "nouveautes") list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    else if (queryOrder) list.sort((a, b) => queryOrder.indexOf(a.slug) - queryOrder.indexOf(b.slug));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [pool, filters, sort, queryOrder]);

  const defaults = defaultFilters(category);
  const activeChips: Array<{ label: string; clear: () => void }> = [
    ...(query ? [{ label: `« ${query} »`, clear: () => setQuery("") }] : []),
    ...(category
      ? []
      : filters.categories.map((c) => ({
          label: categories.find((x) => x.slug === c)?.name ?? c,
          clear: () => setFilters({ ...filters, categories: filters.categories.filter((v) => v !== c) }),
        }))),
    ...filters.brands.map((b) => ({ label: b, clear: () => setFilters({ ...filters, brands: filters.brands.filter((v) => v !== b) }) })),
    ...(filters.price[0] !== defaults.price[0] || filters.price[1] !== defaults.price[1]
      ? [{ label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`, clear: () => setFilters({ ...filters, price: defaults.price }) }]
      : []),
    ...(filters.inStock ? [{ label: "En stock", clear: () => setFilters({ ...filters, inStock: false }) }] : []),
  ];
  const activeCount = activeChips.length;
  const reset = () => {
    setFilters(defaults);
    if (query) setQuery("");
  };

  const PROMO_AT = 5;
  const showPromo = results.length > PROMO_AT;

  return (
    <>
      <ShopHero category={category} count={category ? products.filter((p) => p.category === category.slug).length : products.length} query={query} onQuery={setQuery} />
      <CategoryBar category={category} />
      {!category && !query && <CategoryBento />}

      <section className="bg-paper pb-24 pt-10 md:pt-14">
        <div className="container-wide grid gap-10 lg:grid-cols-[264px_1fr]">
          <aside className="hidden lg:block" aria-label="Filtres">
            <div className="sticky top-[calc(var(--header-h)+84px)] max-h-[calc(100svh-var(--header-h)-100px)] overflow-y-auto pr-2">
              <p className="mb-5 flex items-center gap-2 font-display text-lg font-semibold">
                <SlidersHorizontal className="size-4 text-green-deep" aria-hidden /> Filtres
              </p>
              <FilterPanel filters={filters} setFilters={setFilters} pool={pool} category={category} onReset={reset} />
            </div>
          </aside>

          <div ref={resultsRef} className="scroll-mt-[calc(var(--header-h)+80px)]">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/[0.08] pb-5">
              <p className="text-[15px] text-ink/80" aria-live="polite">
                <span className="font-display text-xl font-semibold text-ink">{results.length}</span> résultat{results.length > 1 ? "s" : ""}
                {query && (
                  <span className="text-mute">
                    {" "}
                    pour <span className="font-medium text-ink">« {query} »</span>
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="sr-only">
                  Trier par
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as Sort);
                      pulse();
                    }}
                    className="h-11 cursor-pointer appearance-none rounded-[10px] border border-ink/12 bg-white pl-4 pr-10 text-sm text-ink outline-none focus:border-green-deep"
                  >
                    {(Object.keys(sortLabels) as Sort[]).map((s) => (
                      <option key={s} value={s}>
                        Trier : {sortLabels[s]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-mute" aria-hidden />
                </div>
                <div className="hidden rounded-[10px] border border-ink/12 bg-white p-1 sm:flex" role="group" aria-label="Affichage">
                  {(["grid", "list"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      aria-label={v === "grid" ? "Affichage en grille" : "Affichage en liste"}
                      className={cn("relative flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors", view === v ? "text-green" : "text-mute hover:text-ink")}
                    >
                      {view === v && <motion.span layoutId="view-toggle" className="absolute inset-0 rounded-md bg-ink" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                      <span className="relative">{v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4">
                <AnimatePresence initial={false}>
                  {activeChips.map((c) => (
                    <motion.button
                      key={c.label}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      type="button"
                      onClick={c.clear}
                      className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-ink px-3 text-[13px] text-white transition-colors hover:bg-graphite"
                      aria-label={`Retirer le filtre ${c.label}`}
                    >
                      {c.label}
                      <X className="size-3.5 text-green" aria-hidden />
                    </motion.button>
                  ))}
                </AnimatePresence>
                <button type="button" onClick={reset} className="cursor-pointer px-2 text-[13px] font-medium text-ink underline-offset-2 hover:underline">
                  Tout effacer
                </button>
              </div>
            )}

            <div className="pt-6">
              {loading ? (
                <div className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
                  {Array.from({ length: Math.min(6, Math.max(3, results.length)) }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <EmptyState
                  icon={PackageSearch}
                  title="Aucun produit, demandez-nous un devis"
                  text="Aucun article ne correspond à ces critères. Nos conseillers peuvent sourcer l'équipement adapté à votre projet."
                  action={
                    <>
                      <Link to="/devis" className={buttonVariants({ variant: "primary", size: "md" })}>
                        <ButtonContent arrow>Demander un devis</ButtonContent>
                      </Link>
                      <button type="button" onClick={reset} className={buttonVariants({ variant: "secondary-light", size: "md" })}>
                        Réinitialiser les filtres
                      </button>
                    </>
                  }
                />
              ) : (
                <ul className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
                  {results.map((p, i) => (
                    <FragmentWithPromo key={p.slug} showPromo={showPromo && i === PROMO_AT} view={view}>
                      <motion.li
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
                      >
                        <ProductCard product={p} layout={view} className="h-full" />
                      </motion.li>
                    </FragmentWithPromo>
                  ))}
                </ul>
              )}
            </div>

            {/* Sourcing band */}
            {results.length > 0 && (
              <div className="relative mt-12 overflow-hidden rounded-[18px] bg-ink p-7 text-white md:p-9">
                <GridBackground className="opacity-60" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="label-mono text-[10px] text-green">Sourcing sur mesure</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">Vous ne trouvez pas votre équipement ?</h3>
                    <p className="mt-2 max-w-[52ch] text-white/60">Notre catalogue en ligne n'est qu'une partie de ce que nous fournissons. Dites-nous ce qu'il vous faut.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/devis" className={buttonVariants({ variant: "primary", size: "md" })}>
                      <ButtonContent arrow>Demander un devis</ButtonContent>
                    </Link>
                    <a
                      href={buildWhatsAppUrl("Bonjour PBXcom, je cherche un équipement qui n'est pas dans votre boutique en ligne.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "secondary", size: "md" })}
                    >
                      <ButtonContent icon={<MessageCircle className="size-4" aria-hidden />}>WhatsApp</ButtonContent>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter trigger */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-14 cursor-pointer items-center gap-2 rounded-full bg-ink px-5 font-medium text-white shadow-[0_14px_40px_-12px_oklch(0.155_0.006_165/0.7)] ring-1 ring-white/10"
        >
          <SlidersHorizontal className="size-4 text-green" aria-hidden />
          Filtrer{activeCount > 0 && ` (${activeCount})`}
        </button>
      </div>
      <SiteSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        side="bottom"
        title="Filtres"
        description={`${results.length} résultat${results.length > 1 ? "s" : ""}`}
        footer={
          <button type="button" onClick={() => setSheetOpen(false)} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
            Voir {results.length} produit{results.length > 1 ? "s" : ""}
          </button>
        }
      >
        <div className="px-6 py-5">
          <FilterPanel filters={filters} setFilters={setFilters} pool={pool} category={category} onReset={reset} />
        </div>
      </SiteSheet>
    </>
  );
}

/** Renders the promo card right before a given product in the grid. */
function FragmentWithPromo({ showPromo, view, children }: { showPromo: boolean; view: "grid" | "list"; children: ReactNode }) {
  return (
    <>
      {showPromo && (
        <motion.li initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <InstallPromo view={view} />
        </motion.li>
      )}
      {children}
    </>
  );
}