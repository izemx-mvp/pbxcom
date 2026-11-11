import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Clock, Handshake, Mail, MapPin, MessageCircle, Phone, Plus, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { images } from "@/config/images";
import { sectors } from "@/data/sectors";
import { universes } from "@/data/universes";
import { getService, servicesByUniverse } from "@/data/services";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { CircuitLines, Glow, GridBackground } from "@/components/site/circuit";
import { CountUp, Reveal, EASE } from "@/components/site/motion";
import { Eyebrow, Section, SectionHeading } from "@/components/site/primitives";
import { SmartImage } from "@/components/site/smart-image";
import { QuickQuoteForm } from "@/components/forms/quick-quote-form";

/* ════════════════════ 6 ─ Sectors: interactive split with autoplay */
const SECTOR_DURATION = 6000;

export function SectorsSplit() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sector = sectors[active]!;

  useEffect(() => {
    if (reduce || paused) return;
    const t = window.setTimeout(() => setActive((v) => (v + 1) % sectors.length), SECTOR_DURATION);
    return () => window.clearTimeout(t);
  }, [active, paused, reduce]);

  return (
    <Section tone="white" aria-labelledby="sectors-title">
      <SectionHeading
        id="sectors-title"
        eyebrow="6 secteurs"
        title="Des solutions pensées pour votre métier"
        highlight="votre métier"
        subtitle="Chaque secteur a ses contraintes. Nous adaptons nos installations à vos usages, vos horaires et vos exigences réglementaires."
      />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <ul className="flex flex-col" role="tablist" aria-label="Secteurs d'activité" aria-orientation="vertical">
          {sectors.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.slug} className="relative border-b border-ink/[0.08] first:border-t">
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="sector-panel"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full cursor-pointer items-center gap-5 py-5 text-left md:py-6"
                >
                  <span className={cn("label-mono w-8 text-[11px] transition-colors", on ? "text-green-deep" : "text-mute/60")}>0{i + 1}</span>
                  <span
                    className={cn(
                      "flex-1 font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-semibold leading-none tracking-[-0.03em] transition-[color,transform] duration-300",
                      on ? "translate-x-2 text-ink" : "text-ink/25 group-hover:text-ink/50",
                    )}
                  >
                    {s.name}
                  </span>
                  <span className={cn("flex size-10 items-center justify-center rounded-full transition-all duration-300", on ? "bg-green text-ink" : "bg-transparent text-transparent")}>
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </button>
                {/* autoplay progress */}
                {on && !reduce && !paused && (
                  <motion.span
                    key={active}
                    className="absolute -bottom-px left-0 h-0.5 w-full origin-left bg-green"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SECTOR_DURATION / 1000, ease: "linear" }}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div id="sector-panel" role="tabpanel" aria-live="polite" className="relative min-h-[580px] overflow-hidden rounded-[20px] bg-ink text-white lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="sync">
            <motion.div
              key={sector.slug}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="absolute inset-0"
            >
              <SmartImage {...sector.image} fill sizes="(min-width:1024px) 55vw, 100vw" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.15)_0%,oklch(0.155_0.006_165/0.94)_62%)]" />
            </motion.div>
          </AnimatePresence>
          <span className="label-mono absolute right-6 top-6 rounded-full bg-ink/70 px-3 py-1 text-[10px] text-white/70">
            0{active + 1} / 0{sectors.length}
          </span>
          <div className="relative flex h-full min-h-[580px] flex-col justify-end p-6 md:p-9">
            <AnimatePresence mode="wait">
              <motion.div key={sector.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-green text-ink">
                    <sector.icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="label-mono text-green">{sector.short}</span>
                </div>
                <p className="mt-4 max-w-[52ch] text-white/75">{sector.description}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="label-mono mb-3 text-[11px] text-white/45">Besoins</p>
                    <ul className="flex flex-col gap-2">
                      {sector.needs.slice(0, 3).map((n, k) => (
                        <motion.li
                          key={n}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + k * 0.08 }}
                          className="flex gap-2.5 text-[14px] text-white/85"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                          {n}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="label-mono mb-3 text-[11px] text-white/45">Solutions recommandées</p>
                    <div className="flex flex-wrap gap-2">
                      {sector.solutions.slice(0, 4).map((slug) => {
                        const s = getService(slug)!;
                        return (
                          <Link
                            key={slug}
                            to="/solutions/$universe"
                            params={{ universe: s.universe }}
                            hash={s.slug}
                            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[13px] text-white/85 transition-colors hover:border-green hover:text-white"
                          >
                            {s.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/devis" search={{ secteur: sector.slug }} className={buttonVariants({ variant: "primary", size: "md" })}>
                    <ButtonContent arrow>Devis {sector.name}</ButtonContent>
                  </Link>
                  <Link to="/secteurs" hash={sector.slug} className={buttonVariants({ variant: "secondary", size: "md" })}>
                    En savoir plus
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════ 7 ─ Why PBXcom */
const lifecycle = ["Étude", "Fourniture", "Installation", "Mise en service", "Maintenance"];

function LifecycleCard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setStep((v) => (v + 1) % lifecycle.length), 1600);
    return () => window.clearInterval(t);
  }, [reduce]);
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-[18px] bg-graphite p-7 hairline-dark">
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ink text-green">
          <ShieldCheck className="size-5" strokeWidth={1.5} aria-hidden />
        </span>
        <div>
          <p className="font-display text-xl font-semibold text-white">De l'étude à la maintenance</p>
          <p className="mt-1 text-sm text-white/55">Un cycle complet, porté par la même équipe.</p>
        </div>
      </div>
      <ol className="relative grid grid-cols-5 gap-1.5" aria-label="Cycle d'intervention">
        {lifecycle.map((l, i) => {
          const done = i <= step;
          return (
            <li key={l} className="flex flex-col gap-2">
              <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <motion.span
                  className="block h-full rounded-full bg-green"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </span>
              <span className={cn("text-[11px] leading-tight transition-colors duration-300", i === step ? "text-white" : done ? "text-white/60" : "text-white/30")}>{l}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function WhyPbxcom() {
  return (
    <Section tone="dark" className="overflow-hidden bg-noise" aria-labelledby="why-title">
      <GridBackground className="-z-10" />
      <Glow className="-right-40 top-0 -z-10 size-[520px]" />
      <SectionHeading
        id="why-title"
        tone="dark"
        eyebrow="Pourquoi PBXcom"
        title="L'expérience d'un intégrateur, la réactivité d'une équipe dédiée"
        highlight="la réactivité"
      />
      <div className="grid gap-4 md:grid-cols-6 lg:gap-5">
        <Reveal className="md:col-span-4 md:row-span-2">
          <div className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[18px] bg-graphite p-8 hairline-dark md:p-10">
            <CircuitLines variant="wide" opacity={0.35} />
            {/* year ruler */}
            <div className="relative flex items-center justify-between">
              <p className="label-mono text-green">Depuis {site.foundingYear}</p>
              <div className="hidden items-end gap-[3px] sm:flex" aria-hidden>
                {Array.from({ length: site.yearsOfExperience }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={cn("w-[3px] origin-bottom rounded-full", i % 5 === 0 ? "h-5 bg-green" : "h-3 bg-white/20")}
                  />
                ))}
              </div>
            </div>
            <div className="relative">
              <p className="font-display text-[clamp(5rem,3rem+8vw,10rem)] font-bold leading-[0.85] tracking-[-0.05em] text-white">
                <CountUp to={site.yearsOfExperience} />
                <span className="text-green"> ans</span>
              </p>
              <p className="mt-4 font-display text-2xl font-semibold text-white">d'expérience</p>
              <p className="mt-3 max-w-[52ch] text-white/60">
                Fondée à Rabat en {site.foundingYear}, PBXcom installe des systèmes de sécurité et intègre des solutions informatiques et télécoms pour des clients publics
                et privés.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.06}>
          <div className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-[18px] bg-green p-7 text-ink">
            <div className="flex items-center justify-between">
              <Clock className="size-6 transition-transform duration-700 group-hover:rotate-[360deg]" strokeWidth={1.5} aria-hidden />
              <span className="label-mono text-[10px] opacity-60">Chrono</span>
            </div>
            <div>
              <p className="font-display text-5xl font-bold tracking-tight">&lt; 4h</p>
              <p className="mt-2 font-medium">pour votre devis</p>
              <p className="mt-1 text-sm text-ink/70">Gratuit et sans engagement</p>
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.12}>
          <div className="flex h-full min-h-[200px] flex-col justify-between rounded-[18px] bg-graphite p-7 hairline-dark">
            <Handshake className="size-6 text-green" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="font-display text-xl font-semibold text-white">Partenariats avec des leaders du secteur</p>
              <p className="mt-2 text-sm text-white/55">Des équipements fiables, choisis pour leur durabilité et leur support.</p>
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-3" delay={0.06}>
          <div className="flex h-full flex-col gap-4 rounded-[18px] bg-graphite p-7 hairline-dark md:flex-row md:items-center">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ink text-green">
              <Sparkles className="size-5" strokeWidth={1.5} aria-hidden />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-white">Service de premier ordre & réactivité</p>
              <p className="mt-1 text-sm text-white/55">Un interlocuteur unique qui connaît votre installation et répond vite.</p>
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-3" delay={0.12}>
          <LifecycleCard />
        </Reveal>
      </div>
    </Section>
  );
}

/* ════════════════════ 8 ─ Process */
const steps = [
  { n: "01", title: "Personnalisez votre devis", text: "Remplissez notre formulaire gratuit et sans engagement en quelques minutes.", image: images.process.devis, tag: "2 minutes" },
  { n: "02", title: "Confirmation par téléphone", text: "Un agent vous appelle pour valider les détails de votre projet et affiner l'estimation.", image: images.process.appel, tag: "< 4h" },
  { n: "03", title: "Début des travaux", text: "Une équipe dédiée intervient sur place, installe et met en service vos équipements.", image: images.process.travaux, tag: "Équipe dédiée" },
];

export function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <Section tone="light" aria-labelledby="process-title">
      <SectionHeading
        id="process-title"
        eyebrow="Comment ça marche"
        title="Votre projet en 3 étapes simples"
        highlight="3 étapes"
        align="center"
        subtitle="Un parcours clair, sans surprise, avec un interlocuteur qui vous suit du premier appel à la mise en service."
      />
      <div ref={ref} className="relative">
        <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="pointer-events-none absolute left-[12%] top-2 hidden h-10 w-[84%] lg:block" aria-hidden>
          <path d="M0 20 H230 L250 6 H480 L500 20 H730 L750 34 H1000" fill="none" stroke="var(--green-deep)" strokeOpacity="0.2" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <motion.path d="M0 20 H230 L250 6 H480 L500 20 H730 L750 34 H1000" fill="none" stroke="var(--green)" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
        </svg>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
          {steps.map((s, i) => (
            <Reveal key={s.n} as="li" delay={i * 0.08} className="relative">
              <div className="relative z-10 mb-6 flex w-fit items-center gap-3 bg-paper pr-4">
                <span className="stroke-text font-mono text-6xl font-medium leading-none text-green-deep">{s.n}</span>
                <span className="size-2.5 rounded-full bg-green shadow-[0_0_0_4px_oklch(0.775_0.215_133/0.2)]" aria-hidden />
              </div>
              <div className="group relative overflow-hidden rounded-[18px]">
                <SmartImage {...s.image} ratio="1/1" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width:768px) 33vw, 100vw" />
                <span className="label-mono absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[10px] text-green">{s.tag}</span>
              </div>
              <h3 className="type-h3 mt-6 text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[38ch] text-mute">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ════════════════════ 8b ─ Project configurator (new) */
export function ProjectConfigurator() {
  const [sectorSlug, setSectorSlug] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const sector = sectors.find((s) => s.slug === sectorSlug) ?? null;

  const chooseSector = (slug: string) => {
    setSectorSlug(slug);
    const s = sectors.find((x) => x.slug === slug);
    if (s && picked.length === 0) setPicked(s.solutions.slice(0, 3));
  };
  const toggle = (slug: string) => setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));

  const pickedServices = picked.map((slug) => getService(slug)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const coveredUniverses = new Set(pickedServices.map((s) => s.universe));
  const ready = Boolean(sector) && pickedServices.length > 0;
  const devisSearch = {
    ...(sector ? { secteur: sector.slug } : {}),
    ...(pickedServices[0] ? { service: pickedServices[0].slug } : {}),
  };


  return (
    <Section tone="dark" className="overflow-hidden bg-noise" aria-labelledby="config-title">
      <GridBackground className="-z-10" />
      <Glow className="-left-40 bottom-0 -z-10 size-[560px]" />
      <SectionHeading
        id="config-title"
        tone="dark"
        eyebrow="Configurateur express"
        title="Composez votre installation en 30 secondes"
        highlight="30 secondes"
        subtitle="Choisissez votre secteur et vos besoins : nous préparons votre demande, vous n'avez plus qu'à l'envoyer."
      />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
        {/* Builder */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="label-mono mb-4 flex items-center gap-2 text-[11px] text-white/50">
              <span className="flex size-5 items-center justify-center rounded-full bg-green text-[10px] text-ink">1</span> Votre secteur
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {sectors.map((s) => {
                const on = s.slug === sectorSlug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => chooseSector(s.slug)}
                    aria-pressed={on}
                    className={cn(
                      "group flex cursor-pointer items-center gap-3 rounded-[14px] p-3.5 text-left transition-[background-color,box-shadow] duration-200",
                      on ? "bg-green text-ink" : "bg-graphite text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.07)] hover:shadow-[inset_0_0_0_1px_oklch(0.775_0.215_133/0.5)]",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink text-green">
                      <s.icon className="size-4" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="text-sm font-medium leading-tight">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="label-mono mb-4 flex items-center gap-2 text-[11px] text-white/50">
              <span className="flex size-5 items-center justify-center rounded-full bg-green text-[10px] text-ink">2</span> Vos besoins
            </p>
            <div className="flex flex-col gap-5">
              {universes.map((u) => (
                <div key={u.id}>
                  <p className="mb-2.5 text-[13px] text-white/45">{u.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {servicesByUniverse(u.id).map((s) => {
                      const on = picked.includes(s.slug);
                      return (
                        <button
                          key={s.slug}
                          type="button"
                          onClick={() => toggle(s.slug)}
                          aria-pressed={on}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-200",
                            on ? "bg-white text-ink" : "border border-white/12 bg-white/[0.03] text-white/75 hover:border-green/60 hover:text-white",
                          )}
                        >
                          {on ? <Check className="size-3.5 text-green-deep" aria-hidden /> : <Plus className="size-3.5 text-green" aria-hidden />}
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[20px] bg-paper text-ink shadow-[0_40px_80px_-40px_oklch(0_0_0/0.8)]">
            <div className="flex items-center justify-between bg-ink px-6 py-4 text-white">
              <span className="label-mono text-[10px] text-white/60">Votre projet</span>
              <span className="label-mono text-[10px] text-green">PBX · {sector ? sector.slug.toUpperCase() : "—"}</span>
            </div>
            <div className="p-6 md:p-7">
              <p className="label-mono text-[10px] text-mute">Secteur</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={sector?.slug ?? "none"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={cn("mt-1 font-display text-2xl font-semibold", !sector && "text-ink/30")}
                >
                  {sector ? sector.name : "À choisir"}
                </motion.p>
              </AnimatePresence>

              <div className="my-5 border-t border-dashed border-ink/15" />

              <p className="label-mono text-[10px] text-mute">Besoins sélectionnés · {pickedServices.length}</p>
              <ul className="mt-3 flex min-h-[120px] flex-col gap-2">
                <AnimatePresence initial={false}>
                  {pickedServices.length === 0 && (
                    <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-mute">
                      Ajoutez un ou plusieurs besoins.
                    </motion.li>
                  )}
                  {pickedServices.map((s) => (
                    <motion.li
                      key={s.slug}
                      layout
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_oklch(0.155_0.006_165/0.07)]"
                    >
                      <s.icon className="size-4 text-green-deep" strokeWidth={1.5} aria-hidden />
                      <span className="flex-1">{s.name}</span>
                      <button type="button" onClick={() => toggle(s.slug)} className="cursor-pointer text-xs text-mute hover:text-ink" aria-label={`Retirer ${s.name}`}>
                        Retirer
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="my-5 border-t border-dashed border-ink/15" />

              <p className="label-mono text-[10px] text-mute">Univers couverts</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {universes.map((u) => {
                  const on = coveredUniverses.has(u.id);
                  return (
                    <div key={u.id} className={cn("rounded-lg px-2 py-2 text-center text-[12px] font-medium transition-colors duration-300", on ? "bg-ink text-green" : "bg-ink/[0.05] text-ink/35")}>
                      {u.name.split(" ")[0]}
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-col gap-2.5">
                <Link
                  to="/devis"
                  search={devisSearch}
                  className={cn(buttonVariants({ variant: "dark", size: "lg" }), "w-full justify-center", !ready && "pointer-events-none opacity-40")}
                  aria-disabled={!ready}
                >
                  <ButtonContent arrow>Recevoir mon devis en &lt; 4h</ButtonContent>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════ 9 ─ About teaser */
export function AboutTeaser() {
  return (
    <Section tone="white" aria-labelledby="about-title">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="grid grid-cols-[1.25fr_1fr] gap-4">
            <SmartImage {...images.about.teamInstallation} ratio="4/5" className="rounded-[18px]" sizes="(min-width:1024px) 28vw, 55vw" />
            <div className="flex flex-col gap-4 pt-16">
              <SmartImage {...images.about.warehouse} ratio="1/1" className="rounded-[18px]" sizes="(min-width:1024px) 22vw, 45vw" />
              <div className="rounded-[18px] bg-paper p-5">
                <p className="label-mono text-[10px] text-green-deep">Notre savoir-faire</p>
                <p className="mt-2 text-sm text-ink/80">Stock maîtrisé, techniciens formés et interventions planifiées.</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-2xl bg-ink px-5 py-4 text-white shadow-[0_24px_50px_-20px_oklch(0.155_0.006_165/0.6)]">
            <span className="font-display text-4xl font-bold text-green">{site.foundingYear}</span>
            <span className="text-sm leading-tight text-white/75">
              Depuis
              <br />à Rabat
            </span>
          </div>
        </Reveal>
        <div>
          <Eyebrow tone="deep">À propos de PBXcom</Eyebrow>
          <h2 id="about-title" className="type-h2 mt-5 text-ink">
            Un intégrateur de confiance, <span className="text-green-deep">depuis {site.foundingYear}</span>
          </h2>
          <p className="type-lead mt-6 text-mute">
            Spécialiste depuis {site.foundingYear} de l'installation de systèmes de sécurité et de l'intégration technologique : systèmes informatiques et réseaux
            télécom. Grâce à nos partenariats solides avec les leaders du secteur, nous proposons un service de premier ordre, adapté à des besoins très variés.
          </p>
          <div className="mt-8 flex items-center gap-4 rounded-[16px] border border-ink/[0.08] bg-paper p-4">
            <SmartImage {...images.about.ceo} ratio="1/1" className="w-16 shrink-0 rounded-xl" sizes="64px" objectPosition="50% 20%" />
            <div>
              <p className="font-display font-semibold text-ink">La Direction PBXcom</p>
              <p className="text-sm text-mute">« Une installation n'a de valeur que si elle fonctionne chaque jour. »</p>
            </div>
          </div>
          <Link to="/a-propos" className={cn(buttonVariants({ variant: "secondary-light", size: "md" }), "mt-8")}>
            <ButtonContent arrow>Découvrir notre histoire</ButtonContent>
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════ 10 ─ Quote section */
export function QuoteSection() {
  const points = [
    { icon: Zap, title: `Réponse en ${site.quoteDelay}`, text: "Un conseiller vous rappelle rapidement pour comprendre votre besoin." },
    { icon: ShieldCheck, title: "Estimation sans engagement", text: "Le devis est gratuit, vous décidez ensuite en toute liberté." },
    { icon: Check, title: "Une équipe dédiée", text: "Les mêmes interlocuteurs de l'étude à la mise en service." },
  ];
  const contacts = [
    { icon: Phone, label: "Appelez-nous", value: site.phone.display, href: site.phone.href, external: false },
    { icon: MessageCircle, label: "WhatsApp", value: site.whatsapp.display, href: buildWhatsAppUrl(defaultWhatsAppMessage), external: true },
    { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}`, external: false },
    { icon: MapPin, label: "Nos bureaux", value: `${site.address.district}, ${site.address.city}`, href: undefined, external: false },
  ];
  return (
    <Section tone="light" id="devis-express" aria-labelledby="quote-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Eyebrow tone="deep">Devis gratuit</Eyebrow>
          <h2 id="quote-title" className="type-h2 mt-5 text-ink">
            Obtenez votre devis en <span className="text-green-deep">moins de 4h</span>
          </h2>
          <ul className="mt-10 flex flex-col gap-6">
            {points.map((p, i) => (
              <Reveal key={p.title} as="li" delay={i * 0.06} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-green">
                  <p.icon className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-mute">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {contacts.map((c) => {
              const inner = (
                <>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-paper text-green-deep transition-colors group-hover:bg-ink group-hover:text-green">
                    <c.icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-mute">{c.label}</span>
                    <span className="block truncate font-medium text-ink">{c.value}</span>
                  </span>
                </>
              );
              const cls = "group flex items-center gap-3 rounded-[14px] border border-ink/[0.08] bg-white p-3.5 transition-colors hover:border-green-deep/50";
              return c.href ? (
                <a key={c.label} href={c.href} className={cls} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
        <Reveal>
          <QuickQuoteForm />
        </Reveal>
      </div>
    </Section>
  );
}