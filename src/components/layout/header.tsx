import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Mail, MapPin, Menu, Phone, Search, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { mainNav, type MegaId } from "@/config/nav";
import { universes } from "@/data/universes";
import { servicesByUniverse } from "@/data/services";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui-state";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { FacebookIcon, InstagramIcon, Logo } from "@/components/site/icons";
import { IconTile } from "@/components/site/primitives";
import { SmartImage } from "@/components/site/smart-image";
import { EASE } from "@/components/site/motion";
import { MobileMenu } from "./mobile-menu";

/* ───────── Rotating top-bar message */
const topMessages = [`Devis gratuit en ${site.quoteDelay}`, "Livraison partout au Maroc", "Installation par nos techniciens", "Paiement à la livraison"];

function RotatingMessage() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % topMessages.length), 3500);
    return () => window.clearInterval(t);
  }, [reduce]);
  return (
    <span className="relative inline-flex h-5 min-w-[230px] items-center overflow-hidden text-white/85">
      <span className="mr-2 size-1.5 shrink-0 rounded-full bg-green animate-pulse-dot" aria-hidden />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={topMessages[i]}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="whitespace-nowrap"
        >
          {topMessages[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TopBar({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={cn(
        "hidden overflow-hidden border-b border-white/[0.06] bg-ink text-white/70 transition-[height,opacity] duration-300 lg:block",
        hidden ? "h-0 opacity-0" : "h-9 opacity-100",
      )}
    >
      <div className="container-wide flex h-9 items-center justify-between text-[13px]">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-3.5 text-green" aria-hidden />
            {site.address.district}, {site.address.city}
          </span>
          <a href={site.phone.href} className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <Phone className="size-3.5 text-green" aria-hidden />
            {site.phone.display}
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <Mail className="size-3.5 text-green" aria-hidden />
            {site.email}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <RotatingMessage />
          <span className="h-4 w-px bg-white/15" aria-hidden />
          <a href={site.socials.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="PBXcom sur Facebook" className="transition-colors hover:text-green">
            <FacebookIcon className="size-4" />
          </a>
          <a href={site.socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="PBXcom sur Instagram" className="transition-colors hover:text-green">
            <InstagramIcon className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ───────── Solutions mega: preview card follows the hovered service */
function SolutionsMega({ onNavigate }: { onNavigate: () => void }) {
  const all = universes.flatMap((u) => servicesByUniverse(u.id).map((s) => ({ ...s, universeName: u.name })));
  const [hovered, setHovered] = useState<string | null>(null);
  const preview = all.find((s) => s.slug === hovered);
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_300px] gap-8">
      {universes.map((u, ui) => (
        <motion.div key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE, delay: ui * 0.05 }}>
          <Link
            to="/solutions/$universe"
            params={{ universe: u.id }}
            onClick={onNavigate}
            className="label-mono mb-4 flex items-center gap-2 text-green transition-colors hover:text-green-bright"
          >
            {u.number} · {u.name}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
          <ul className="flex flex-col gap-1">
            {servicesByUniverse(u.id).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/solutions/$universe"
                  params={{ universe: u.id }}
                  hash={s.slug}
                  onClick={onNavigate}
                  onMouseEnter={() => setHovered(s.slug)}
                  onFocus={() => setHovered(s.slug)}
                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04]"
                >
                  <IconTile icon={s.icon} size="sm" />
                  <span>
                    <span className="block text-[15px] font-medium text-white">{s.name}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-white/50">{s.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
      <Link to="/solutions" onClick={onNavigate} className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[16px] p-5 hairline-dark">
        <AnimatePresence mode="sync">
          <motion.div key={preview?.slug ?? "default"} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="absolute inset-0 -z-10">
            <SmartImage {...(preview?.image ?? universes[0]!.image)} fill sizes="300px" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <span className="label-mono text-green">{preview ? preview.universeName : "3 univers · 12 services"}</span>
        <span className="mt-2 font-display text-xl font-semibold text-white">{preview ? preview.name : "Toutes nos solutions"}</span>
        <span className="mt-3 inline-flex items-center gap-2 text-sm text-white/80">
          {preview ? "Voir le service" : "Découvrir"} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}

/* ───────── Boutique mega: category image preview + product counts */
function BoutiqueMega({ onNavigate }: { onNavigate: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const preview = categories.find((c) => c.slug === hovered);
  return (
    <div className="grid grid-cols-[1fr_300px] gap-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="label-mono text-green">Catégories</span>
          <Link to="/boutique" onClick={onNavigate} className="link-underline text-sm text-white/70 hover:text-white">
            Tout le catalogue ({products.length})
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-1 xl:grid-cols-4">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <motion.li key={c.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.03 }}>
                <Link
                  to="/boutique/$category"
                  params={{ category: c.slug }}
                  onClick={onNavigate}
                  onMouseEnter={() => setHovered(c.slug)}
                  onFocus={() => setHovered(c.slug)}
                  className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04]"
                >
                  <IconTile icon={c.icon} size="sm" />
                  <span>
                    <span className="block text-[15px] font-medium text-white">{c.name}</span>
                    <span className="mt-0.5 block text-[13px] text-white/50">{c.short}</span>
                    <span className="label-mono mt-1 block text-[10px] text-green/70">{count} produit{count > 1 ? "s" : ""}</span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {preview ? (
          <motion.div key={preview.slug} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
            <Link
              to="/boutique/$category"
              params={{ category: preview.slug }}
              onClick={onNavigate}
              className="group relative isolate flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-[16px] p-6 hairline-dark"
            >
              <SmartImage {...preview.image} fill className="-z-10" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="300px" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              <span className="label-mono text-green">{preview.short}</span>
              <span className="mt-2 font-display text-xl font-semibold text-white">{preview.name}</span>
              <span className="mt-3 inline-flex items-center gap-2 text-sm text-white/80">
                Voir la catégorie <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ) : (
          <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex flex-col justify-between overflow-hidden rounded-[16px] bg-green p-6 text-ink">
            <svg viewBox="0 0 300 200" className="pointer-events-none absolute -right-10 -top-6 h-48 w-72 opacity-15" aria-hidden>
              <path d="M0 60 H90 L110 80 H180 L200 60 H300 M60 200 V150 L80 130 V100 M240 0 V40 L220 60" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="110" cy="80" r="5" fill="currentColor" />
              <circle cx="200" cy="60" r="5" fill="currentColor" />
              <circle cx="80" cy="130" r="5" fill="currentColor" />
            </svg>
            <div>
              <span className="label-mono">Installation</span>
              <p className="mt-3 font-display text-2xl font-semibold leading-tight">Besoin d'une installation ? Devis en 4h.</p>
              <p className="mt-2 text-sm text-ink/70">Nos techniciens posent, paramètrent et mettent en service vos équipements.</p>
            </div>
            <Link to="/devis" onClick={onNavigate} className={cn(buttonVariants({ variant: "dark", size: "sm" }), "mt-6 self-start")}>
              <ButtonContent arrow>Demander un devis</ButtonContent>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<MegaId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverNav, setHoverNav] = useState<string | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const { count, hydrated } = useCart();
  const { setCartOpen, setSearchOpen } = useUI();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMac, setIsMac] = useState(true);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const scheduleOpen = (id: MegaId) => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setMega(id), mega ? 0 : 90);
  };
  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 160);
  };

  const solid = scrolled || mega !== null;
  const activeTo = mainNav.find((item) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)))?.to ?? null;
  const pillTarget = hoverNav ?? activeTo;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50"
        onMouseLeave={() => {
          scheduleClose();
          setHoverNav(null);
        }}
      >
        <TopBar hidden={scrolled} />
        <div className={cn("relative transition-[background-color,box-shadow,backdrop-filter] duration-300", solid ? "glass shadow-[0_1px_0_oklch(1_0_0/0.07)]" : "bg-transparent")}>
          <div className={cn("container-wide flex items-center gap-6 transition-[height] duration-300", scrolled ? "h-16" : "h-16 lg:h-20")}>
            <Logo className={cn("transition-[height] duration-300", scrolled ? "h-7" : "h-7 lg:h-9")} />

            <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {mainNav.map((item) => {
                  const active = item.to === activeTo;
                  return (
                    <li
                      key={item.to}
                      className="relative isolate"
                      onMouseEnter={() => {
                        setHoverNav(item.to);
                        if (item.mega) scheduleOpen(item.mega);
                        else scheduleClose();
                      }}
                    >
                      {pillTarget === item.to && (
                        <motion.span
                          layoutId="nav-pill"
                          className={cn("absolute inset-y-1 inset-x-0 -z-10 rounded-full", active && !hoverNav ? "bg-white/[0.07]" : "bg-white/[0.05]")}
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          aria-hidden
                        />
                      )}
                      <div className="flex items-center">
                        <Link
                          to={item.to}
                          data-active={active}
                          aria-current={active ? "page" : undefined}
                          className={cn("px-3 py-2 text-[15px] font-medium transition-colors xl:px-3.5", active ? "text-white" : "text-white/70 hover:text-white")}
                        >
                          {item.label}
                        </Link>
                        {item.mega && (
                          <button
                            type="button"
                            aria-expanded={mega === item.mega}
                            aria-controls={`mega-${item.mega}`}
                            aria-label={`Ouvrir le menu ${item.label}`}
                            onClick={() => setMega((m) => (m === item.mega ? null : item.mega))}
                            className="-ml-2 mr-1 flex size-7 cursor-pointer items-center justify-center rounded-md text-white/60 transition-colors hover:text-green"
                          >
                            <ChevronDown className={cn("size-4 transition-transform duration-200", mega === item.mega && "rotate-180 text-green")} />
                          </button>
                        )}
                      </div>
                      {active && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-green" aria-hidden />}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-4">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden h-11 cursor-pointer items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] pl-3 pr-2 text-sm text-white/60 transition-colors hover:border-green/50 hover:text-white xl:flex"
                aria-label="Rechercher"
              >
                <Search className="size-4" aria-hidden />
                <span>Rechercher</span>
                <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-white/60">{isMac ? "⌘" : "Ctrl"} K</kbd>
              </button>
              <button type="button" onClick={() => setSearchOpen(true)} className={cn(buttonVariants({ variant: "icon", size: "icon" }), "xl:hidden")} aria-label="Rechercher">
                <Search className="size-5" />
              </button>
              <button
                type="button"
                data-cart-target
                onClick={() => setCartOpen(true)}
                className={cn(buttonVariants({ variant: "icon", size: "icon" }), "relative")}
                aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
              >
                <ShoppingBag className="size-5" />
                <AnimatePresence>
                  {hydrated && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1 font-mono text-[11px] font-medium text-ink"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <Link to="/devis" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden h-11 sm:inline-flex")}>
                <ButtonContent arrow>Devis Gratuit</ButtonContent>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={cn(buttonVariants({ variant: "icon", size: "icon" }), "lg:hidden")}
                aria-label="Ouvrir le menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>

          {/* Scroll progress line (visible once scrolled) */}
          <motion.div
            style={{ scaleX: progress }}
            className={cn("absolute inset-x-0 bottom-0 h-[2px] origin-left bg-green transition-opacity duration-300", scrolled && !mega ? "opacity-100" : "opacity-0")}
            aria-hidden
          />

          <AnimatePresence>
            {mega && (
              <motion.div
                key={mega}
                id={`mega-${mega}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE }}
                onMouseEnter={() => window.clearTimeout(closeTimer.current)}
                className="absolute inset-x-0 top-full hidden border-t border-white/[0.06] bg-ink/[0.97] shadow-[0_40px_80px_-30px_oklch(0_0_0/0.7)] backdrop-blur-xl lg:block"
              >
                <div className="container-wide py-8">{mega === "solutions" ? <SolutionsMega onNavigate={() => setMega(null)} /> : <BoutiqueMega onNavigate={() => setMega(null)} />}</div>
                <div className="border-t border-white/[0.06]">
                  <div className="container-wide flex items-center justify-between py-3 text-[13px] text-white/50">
                    <span>Un conseiller vous répond : <a href={site.phone.href} className="font-medium text-white hover:text-green">{site.phone.display}</a></span>
                    <span className="label-mono text-[10px] text-green">Devis gratuit en {site.quoteDelay}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}