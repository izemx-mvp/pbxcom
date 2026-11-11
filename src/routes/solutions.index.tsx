import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Cctv, PhoneCall, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { universes } from "@/data/universes";
import { servicesByUniverse } from "@/data/services";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { CTABand, PageHero, CardCircuit } from "@/components/site/blocks";
import { IconTile, Section, SectionHeading } from "@/components/site/primitives";
import { GridBackground, Glow } from "@/components/site/circuit";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal, EASE } from "@/components/site/motion";
import { images } from "@/config/images";

export const Route = createFileRoute("/solutions/")({
  head: () =>
    seo({
      title: "Nos solutions — Sécurité, Infrastructure Réseau, Télécommunication",
      description:
        "Découvrez nos 3 univers et 12 services : vidéosurveillance, contrôle d'accès, anti-intrusion, incendie, Wi-Fi, câblage, fibre, téléphonie IP, visioconférence, VoIP et VPN.",
      path: "/solutions",
      breadcrumbs: [{ name: "Solutions", path: "/solutions" }],
    }),
  component: SolutionsPage,
});

/* ───────── Hero aside: hub diagram linking the 3 universes */
function HubDiagram() {
  const [hover, setHover] = useState<string | null>(null);
  const pos = [
    { x: 50, y: 12 },
    { x: 12, y: 82 },
    { x: 88, y: 82 },
  ];
  return (
    <div className="relative hidden aspect-square w-[340px] lg:block xl:w-[380px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {pos.map((p, i) => (
          <g key={i}>
            <line x1="50" y1="52" x2={p.x} y2={p.y} stroke="var(--green)" strokeOpacity={hover === universes[i]?.id ? 0.9 : 0.3} strokeWidth="0.4" />
            <motion.circle
              r="0.9"
              fill="var(--green-bright)"
              initial={{ cx: 50, cy: 52 }}
              animate={{ cx: [50, p.x], cy: [52, p.y] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
            />
          </g>
        ))}
        <circle cx="50" cy="52" r="16" fill="none" stroke="var(--green)" strokeOpacity="0.15" strokeDasharray="1 1.5" />
      </svg>
      {/* hub */}
      <div className="absolute left-1/2 top-[52%] flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-green text-ink shadow-[0_0_60px_-10px_var(--green)]">
        <span className="font-display text-sm font-bold">PBXcom</span>
        <span className="label-mono text-[8px] opacity-70">1 équipe</span>
      </div>
      {universes.map((u, i) => {
        const p = pos[i]!;
        return (
          <Link
            key={u.id}
            to="/solutions/$universe"
            params={{ universe: u.id }}
            onMouseEnter={() => setHover(u.id)}
            onMouseLeave={() => setHover(null)}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-graphite text-green ring-1 ring-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-green group-hover:text-ink">
              <u.icon className="size-6" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="whitespace-nowrap rounded-full bg-ink/80 px-3 py-1 text-[12px] font-medium text-white ring-1 ring-white/10">{u.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ───────── Synergy example (generated scenario) */
const synergy = [
  { icon: Cctv, title: "Une caméra détecte une présence", text: "La vidéosurveillance repère un mouvement sur le parking, hors horaires." },
  { icon: Wifi, title: "Le réseau transporte l'alerte", text: "Switchs PoE et liaison fibre acheminent l'image en temps réel, sans coupure." },
  { icon: PhoneCall, title: "Le bon interlocuteur est prévenu", text: "Le gardien reçoit l'alerte sur son poste IP et peut lever le doute en vidéo." },
];

function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos solutions"
        title="3 univers, 12 services, une seule équipe"
        highlight="une seule équipe"
        subtitle="Nous concevons des installations où la sécurité, le réseau et les télécommunications fonctionnent ensemble, étudiées, posées et maintenues par nos techniciens."
        crumbs={[{ label: "Solutions" }]}
        image={images.universes.reseau}
        aside={<HubDiagram />}
      >
        <div className="flex flex-wrap gap-2">
          {universes.map((u) => (
            <a key={u.id} href={`#${u.id}`} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition-colors hover:border-green hover:text-white">
              {u.number} · {u.name}
            </a>
          ))}
        </div>
      </PageHero>

      {/* Stacking universe cards */}
      <Section tone="light" aria-label="Nos trois univers">
        <div className="relative flex flex-col gap-8">
          {universes.map((u, i) => {
            const list = servicesByUniverse(u.id);
            return (
              <article
                key={u.id}
                id={u.id}
                className="sticky scroll-mt-28"
                style={{ top: `calc(var(--header-h) + 24px + ${i * 28}px)` }}
              >
                <div className="relative isolate grid overflow-hidden rounded-[24px] bg-ink text-white shadow-[0_-20px_60px_-30px_oklch(0.155_0.006_165/0.5)] lg:min-h-[560px] lg:grid-cols-[1.05fr_1fr]">
                  <GridBackground className="-z-10 opacity-60" />
                  <Glow className="-left-32 -top-32 -z-10 size-[420px]" />
                  {/* copy */}
                  <div className="flex flex-col justify-between gap-8 p-7 md:p-12">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="stroke-text font-mono text-6xl font-medium leading-none text-green/70 md:text-7xl">{u.number}</span>
                        <span className="label-mono text-green">Univers {u.number}</span>
                      </div>
                      <h2 className="type-h2 mt-6 text-white">{u.name}</h2>
                      <p className="mt-4 max-w-[52ch] text-white/65">{u.description}</p>
                    </div>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {list.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to="/solutions/$universe"
                            params={{ universe: u.id }}
                            hash={s.slug}
                            className="group flex items-center gap-3 rounded-[14px] bg-graphite p-3 ring-1 ring-white/[0.07] transition-[box-shadow,background-color] hover:ring-green/50"
                          >
                            <IconTile icon={s.icon} size="sm" />
                            <span className="flex-1 text-[14px] font-medium text-white">{s.name}</span>
                            <ArrowRight className="size-4 text-white/30 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-green" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <Link to="/solutions/$universe" params={{ universe: u.id }} className={buttonVariants({ variant: "primary", size: "md" })}>
                        <ButtonContent arrow>Découvrir {u.name}</ButtonContent>
                      </Link>
                      <Link to="/devis" search={{ besoin: u.id }} className={buttonVariants({ variant: "secondary", size: "md" })}>
                        Demander un devis
                      </Link>
                    </div>
                  </div>
                  {/* image */}
                  <Link to="/solutions/$universe" params={{ universe: u.id }} className="group relative block min-h-[280px] overflow-hidden" aria-label={`Découvrir ${u.name}`}>
                    <SmartImage {...u.image} fill imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" sizes="(min-width:1024px) 50vw, 100vw" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ink),transparent_35%)] max-lg:bg-[linear-gradient(0deg,var(--ink),transparent_40%)]" />
                    <span className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:bg-green group-hover:text-ink">
                      <ArrowUpRight className="size-5" aria-hidden />
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Synergy */}
      <Section tone="white" aria-labelledby="synergy-title">
        <SectionHeading
          id="synergy-title"
          eyebrow="Pourquoi un seul intégrateur"
          title="Des systèmes qui se parlent"
          highlight="se parlent"
          align="center"
          subtitle="Quand la sécurité, le réseau et la téléphonie sont pensés ensemble, chaque équipement renforce les autres. Exemple sur un site surveillé la nuit :"
        />
        <ol className="relative grid gap-4 md:grid-cols-3">
          <svg viewBox="0 0 1000 20" preserveAspectRatio="none" className="pointer-events-none absolute left-[16%] top-12 hidden h-5 w-[68%] md:block" aria-hidden>
            <motion.path
              d="M0 10 H1000"
              stroke="var(--green-deep)"
              strokeWidth="2"
              strokeDasharray="6 8"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE }}
            />
          </svg>
          {synergy.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 0.15}>
              <div className="group relative h-full overflow-hidden rounded-[18px] border border-ink/[0.07] bg-paper p-7 text-center transition-shadow hover:shadow-[0_30px_60px_-40px_oklch(0.155_0.006_165/0.45)]">
                <span className="relative z-10 mx-auto flex size-16 items-center justify-center rounded-2xl bg-ink text-green ring-8 ring-white transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="size-7" strokeWidth={1.5} aria-hidden />
                </span>
                <p className="label-mono mt-6 text-[10px] text-green-deep">Étape 0{i + 1}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mute">{s.text}</p>
                <CardCircuit />
              </div>
            </Reveal>
          ))}
        </ol>
        <div className={cn("mt-12 flex justify-center")}>
          <Link to="/devis" className={buttonVariants({ variant: "dark", size: "lg" })}>
            <ButtonContent arrow>Concevoir mon installation</ButtonContent>
          </Link>
        </div>
      </Section>

      <CTABand />
    </>
  );
}