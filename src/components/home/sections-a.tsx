import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, CreditCard, Truck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { universes } from "@/data/universes";
import { services, servicesByUniverse, type UniverseId } from "@/data/services";
import { products } from "@/data/products";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { CardCircuit, Marquee, SiteTabs } from "@/components/site/blocks";
import { IconTile, Section, SectionHeading } from "@/components/site/primitives";
import { SmartImage } from "@/components/site/smart-image";
import { ProductCard } from "@/components/site/product-card";
import { EASE, Reveal } from "@/components/site/motion";
import { GridBackground } from "@/components/site/circuit";

/* ════════════════════ 2 ─ References band */
export function ReferencesMarquee() {
  const refs = [...site.references, ...site.references];
  return (
    <section id="references" className="relative border-b border-ink/[0.06] bg-paper py-14 md:py-16" aria-labelledby="refs-title">
      <div className="container-wide grid items-center gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
        <div>
          <p className="label-mono text-green-deep">De solides références</p>
          <h2 id="refs-title" className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
            Ils nous ont fait confiance
          </h2>
          <Link to="/references" className="link-underline mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink">
            Voir nos références <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Marquee duration={32}>
          {refs.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="group flex h-24 w-[230px] shrink-0 flex-col items-center justify-center rounded-[14px] border border-ink/[0.07] bg-white px-6 transition-[border-color,box-shadow] duration-300 hover:border-green-deep/40 hover:shadow-[0_16px_40px_-24px_oklch(0.155_0.006_165/0.4)] md:w-[260px]"
              title={r.fullName}
            >
              {r.logo ? (
                <img src={r.logo} alt={r.fullName} width={640} height={320} className="h-16 w-auto object-contain" loading="lazy" />
              ) : (
                <>
                  <span className="font-display text-[24px] font-bold tracking-tight text-ink/45 transition-colors duration-300 group-hover:text-ink">{r.name}</span>
                  <span className="label-mono mt-1 text-[10px] text-mute/70 transition-colors duration-300 group-hover:text-green-deep">{r.sector}</span>
                </>
              )}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ════════════════════ 3 ─ Universes: expanding panels */
export function UniversesBento() {
  const [active, setActive] = useState(0);
  return (
    <Section tone="light" aria-labelledby="universes-title">
      <SectionHeading
        id="universes-title"
        eyebrow="3 univers d'expertise"
        title="Une couverture complète, un seul interlocuteur"
        highlight="un seul interlocuteur"
        subtitle="Sécurité, infrastructure réseau et télécommunication : nous concevons, installons et maintenons des systèmes qui fonctionnent ensemble."
        action={
          <Link to="/solutions" className={buttonVariants({ variant: "secondary-light", size: "md" })}>
            <ButtonContent arrow>Toutes nos solutions</ButtonContent>
          </Link>
        }
      />
      <Reveal>
        <div className="flex flex-col gap-3 lg:h-[620px] lg:flex-row lg:gap-4">
          {universes.map((u, i) => {
            const on = i === active;
            const list = servicesByUniverse(u.id);
            return (
              <div
                key={u.id}
                onMouseEnter={() => setActive(i)}
                onFocusCapture={() => setActive(i)}
                className={cn(
                  "group relative isolate min-h-[440px] overflow-hidden rounded-[20px] bg-ink lg:min-h-0 lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)]",
                  on ? "lg:flex-[2.6]" : "lg:flex-[0.7]",
                )}
              >
                <Link to="/solutions/$universe" params={{ universe: u.id }} className="absolute inset-0 flex flex-col justify-end p-6 md:p-9">
                  <SmartImage
                    {...u.image}
                    fill
                    className="-z-10"
                    imgClassName={cn("transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]", on ? "scale-100 opacity-100" : "scale-110 lg:opacity-50")}
                    sizes="(min-width:1024px) 60vw, 100vw"
                  />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.05)_10%,oklch(0.155_0.006_165/0.95))]" />

                  {/* Collapsed vertical label (desktop) */}
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 hidden items-end justify-center pb-10 transition-opacity duration-300 lg:flex",
                      on ? "opacity-0" : "opacity-100 delay-200",
                    )}
                    aria-hidden
                  >
                    <span className="font-display text-3xl font-semibold tracking-tight text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                      {u.name}
                    </span>
                  </div>

                  {/* Number + arrow */}
                  <span className="label-mono absolute left-6 top-6 text-green md:left-9 md:top-8">{u.number}</span>
                  <span
                    className={cn(
                      "absolute right-6 top-6 flex size-12 items-center justify-center rounded-full ring-1 transition-[background-color,color,transform] duration-300 md:right-8 md:top-8",
                      on ? "rotate-45 bg-green text-ink ring-green" : "bg-white/10 text-white ring-white/20",
                    )}
                  >
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>

                  {/* Expanded content */}
                  <div className={cn("transition-[opacity,transform] duration-500", on ? "translate-y-0 opacity-100 delay-150" : "lg:pointer-events-none lg:translate-y-6 lg:opacity-0")}>
                    <h3 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">{u.name}</h3>
                    <p className="mt-3 max-w-[52ch] text-white/70">{u.description}</p>
                    <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:max-w-[560px]">
                      {list.map((s, k) => (
                        <li key={s.slug} className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink/50 px-3 py-2.5 text-[14px] text-white/85">
                          <span className="label-mono text-[10px] text-green/80">0{k + 1}</span>
                          <s.icon className="size-4 text-green" strokeWidth={1.5} aria-hidden />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <CardCircuit />
                </Link>
              </div>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}

/* ════════════════════ 4 ─ Services: "patch panel" */
type Filter = "tous" | UniverseId;

export function ServicesGrid() {
  const [filter, setFilter] = useState<Filter>("tous");
  const [activeSlug, setActiveSlug] = useState(services[0]!.slug);
  const active = services.find((s) => s.slug === activeSlug) ?? services[0]!;
  const activeUniverse = universes.find((u) => u.id === active.universe);
  const inFilter = (u: UniverseId) => filter === "tous" || filter === u;

  const changeFilter = (f: Filter) => {
    setFilter(f);
    if (f !== "tous" && active.universe !== f) {
      const first = services.find((s) => s.universe === f);
      if (first) setActiveSlug(first.slug);
    }
  };

  return (
    <Section tone="dark" divider className="overflow-hidden bg-noise" aria-labelledby="services-title">
      <GridBackground className="-z-10" />
      <SectionHeading
        id="services-title"
        tone="dark"
        eyebrow="12 services · 1 seul intégrateur"
        title="De la caméra à la fibre, tout est maîtrisé"
        highlight="tout est maîtrisé"
        subtitle="Branchez-vous sur un service : chaque port est réalisé par nos équipes, de l'étude à la maintenance."
      />
      <SiteTabs
        label="Filtrer les services"
        tone="dark"
        layoutId="services-filter"
        value={filter}
        onChange={changeFilter}
        className="mb-8 w-fit"
        tabs={[
          { value: "tous", label: "Tous", count: services.length },
          { value: "securite", label: "Sécurité", count: 4 },
          { value: "reseau", label: "Réseau", count: 4 },
          { value: "telecom", label: "Télécom", count: 4 },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
        {/* Rack */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#1b211f,#121715)] p-4 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_40px_80px_-40px_oklch(0_0_0/0.8)] ring-1 ring-white/[0.07] md:p-6">
            {/* rack header */}
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <span className="size-2.5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#5b6460,#2a302d)] ring-1 ring-black/40" aria-hidden />
                <span className="label-mono text-[10px] text-white/45">PBX-RACK · 12 PORTS</span>
              </div>
              <div className="flex items-center gap-4" aria-hidden>
                {["PWR", "SYS", "LINK"].map((l) => (
                  <span key={l} className="label-mono flex items-center gap-1.5 text-[9px] text-white/35">
                    <span className="size-1.5 rounded-full bg-green shadow-[0_0_6px_var(--green)]" />
                    {l}
                  </span>
                ))}
                <span className="size-2.5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#5b6460,#2a302d)] ring-1 ring-black/40" />
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
              {services.map((s, i) => {
                const on = s.slug === active.slug;
                const lit = inFilter(s.universe);
                return (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => lit && setActiveSlug(s.slug)}
                      onFocus={() => setActiveSlug(s.slug)}
                      onClick={() => setActiveSlug(s.slug)}
                      aria-pressed={on}
                      className={cn(
                        "group relative flex w-full cursor-pointer flex-col gap-3 rounded-[12px] p-3 text-left transition-[background-color,box-shadow,opacity] duration-300 md:p-3.5",
                        on ? "bg-green/[0.09] shadow-[inset_0_0_0_1px_oklch(0.775_0.215_133/0.55)]" : "bg-white/[0.025] shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)] hover:bg-white/[0.05]",
                        !lit && "opacity-30",
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <span className="label-mono text-[10px] text-white/40">P{String(i + 1).padStart(2, "0")}</span>
                        <span
                          className={cn(
                            "size-1.5 rounded-full transition-all duration-300",
                            on ? "bg-green shadow-[0_0_8px_var(--green)]" : lit ? "bg-green/45" : "bg-white/15",
                          )}
                          aria-hidden
                        />
                      </span>
                      {/* RJ45-style socket */}
                      <span className="relative mx-auto flex h-9 w-12 items-start justify-center rounded-[5px] bg-ink ring-1 ring-white/10" aria-hidden>
                        <span className="mt-1.5 h-2.5 w-8 rounded-[2px] bg-[repeating-linear-gradient(90deg,oklch(0.8_0.12_85/0.55)_0_1.5px,transparent_1.5px_4px)]" />
                        <span className="absolute bottom-0 h-1.5 w-4 rounded-t-[2px] bg-[#121715]" />
                        <s.icon
                          className={cn("absolute -bottom-2 -right-2 size-5 rounded-md p-1 transition-colors", on ? "bg-green text-ink" : "bg-graphite text-green")}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className={cn("text-[13px] font-medium leading-tight transition-colors", on ? "text-white" : "text-white/70")}>{s.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative overflow-hidden rounded-[20px] bg-graphite p-7 hairline-dark md:p-9"
              aria-live="polite"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-green/15 blur-3xl" aria-hidden />
              <div className="flex items-center justify-between">
                <IconTile icon={active.icon} />
                <span className="label-mono text-[10px] text-green">{activeUniverse?.name}</span>
              </div>
              <h3 className="mt-7 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">{active.name}</h3>
              <p className="mt-3 text-white/65">{active.short}</p>

              <p className="label-mono mt-8 text-[10px] text-white/40">Notre intervention</p>
              <ol className="mt-3 flex flex-wrap items-center gap-1.5">
                {["Étude", "Fourniture", "Installation", "Mise en service", "Maintenance"].map((step, k, arr) => (
                  <li key={step} className="flex items-center gap-1.5">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + k * 0.07 }}
                      className="rounded-full border border-white/10 bg-ink/60 px-3 py-1 text-[12px] text-white/80"
                    >
                      {step}
                    </motion.span>
                    {k < arr.length - 1 && <span className="h-px w-3 bg-green/50" aria-hidden />}
                  </li>
                ))}
              </ol>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/devis" search={{ service: active.slug }} className={buttonVariants({ variant: "primary", size: "md" })}>
                  <ButtonContent arrow>Devis pour ce service</ButtonContent>
                </Link>
                <Link to="/solutions/$universe" params={{ universe: active.universe }} hash={active.slug} className={buttonVariants({ variant: "secondary", size: "md" })}>
                  En savoir plus
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════ 5 ─ Featured products */
const perks = [
  { icon: Truck, label: "Livraison partout au Maroc" },
  { icon: Wrench, label: "Installation par nos techniciens" },
  { icon: CreditCard, label: "Paiement à la livraison" },
];

export function FeaturedProducts() {
  const [tab, setTab] = useState<Filter>("tous");
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scroller });
  const featured = products.filter((p) => p.featured);
  const list = (tab === "tous" ? featured : products.filter((p) => p.universe === tab)).slice(0, 8);
  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };
  const changeTab = (t: Filter) => {
    setTab(t);
    scroller.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <Section tone="light" aria-labelledby="featured-title">
      <SectionHeading
        id="featured-title"
        eyebrow="Boutique en ligne"
        title="Le matériel des pros, livré partout au Maroc"
        highlight="livré partout au Maroc"
        subtitle="Une sélection d'équipements testés et utilisés par nos techniciens. Commandez en ligne, avec ou sans installation."
        action={
          <Link to="/boutique" className={buttonVariants({ variant: "dark", size: "md" })}>
            <ButtonContent arrow>Voir toute la boutique</ButtonContent>
          </Link>
        }
      />

      {/* Perks strip */}
      <ul className="mb-8 grid gap-3 sm:grid-cols-3">
        {perks.map((p, i) => (
          <Reveal key={p.label} as="li" delay={i * 0.06}>
            <div className="flex items-center gap-3 rounded-[14px] border border-ink/[0.07] bg-white px-4 py-3.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-green">
                <p.icon className="size-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="text-sm font-medium text-ink">{p.label}</span>
            </div>
          </Reveal>
        ))}
      </ul>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <SiteTabs
          label="Filtrer les produits par univers"
          layoutId="featured-tabs"
          value={tab}
          onChange={changeTab}
          tabs={[
            { value: "tous", label: "Sélection" },
            { value: "securite", label: "Sécurité" },
            { value: "reseau", label: "Réseau" },
            { value: "telecom", label: "Télécom" },
          ]}
        />
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => scroll(-1)} className={buttonVariants({ variant: "icon-light", size: "icon" })} aria-label="Produits précédents">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => scroll(1)} className={buttonVariants({ variant: "icon-light", size: "icon" })} aria-label="Produits suivants">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <div ref={scroller} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.div
              key={`${tab}-${p.slug}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc(25%-12px)]"
            >
              <ProductCard product={p} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* scroll progress */}
      <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-ink/[0.07]">
        <motion.div style={{ scaleX: scrollXProgress }} className="h-full origin-left rounded-full bg-green-deep" />
      </div>
    </Section>
  );
}