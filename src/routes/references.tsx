import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/config/images";
import { projects } from "@/data/projects";
import { sectors, getSector } from "@/data/sectors";
import { getService } from "@/data/services";
import { PageHero, CTABand, SiteTabs, CardCircuit, Marquee, SpotlightCard } from "@/components/site/blocks";
import { Section, SectionHeading, Chip } from "@/components/site/primitives";
import { GridBackground } from "@/components/site/circuit";
import { SmartImage } from "@/components/site/smart-image";
import { CountUp, EASE, Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/references")({
  head: () =>
    seo({
      title: "Références et réalisations",
      description: `Ils font confiance à PBXcom depuis ${site.foundingYear} : grands comptes, administrations, hôtels, résidences et établissements de santé partout au Maroc.`,
      path: "/references",
      breadcrumbs: [{ name: "Références", path: "/references" }],
    }),
  component: ReferencesPage,
});

type Filter = "tous" | (typeof sectors)[number]["slug"];

function ReferencesPage() {
  const [filter, setFilter] = useState<Filter>("tous");
  const tabs = useMemo(
    () => [
      { value: "tous" as Filter, label: "Tous", count: projects.length },
      ...sectors.map((s) => ({ value: s.slug as Filter, label: s.name, count: projects.filter((p) => p.sector === s.slug).length })).filter((t) => t.count > 0),
    ],
    [],
  );
  const shown = filter === "tous" ? projects : projects.filter((p) => p.sector === filter);
  const sectorsCovered = new Set(projects.map((p) => p.sector)).size;
  const refsLoop = [...site.references, ...site.references, ...site.references];

  return (
    <>
      <PageHero
        eyebrow="Références"
        title="Ils nous font confiance"
        highlight="confiance"
        subtitle={`Depuis ${site.foundingYear}, nous accompagnons des organisations exigeantes, des grands comptes aux PME, dans la sécurisation et la connexion de leurs sites.`}
        crumbs={[{ label: "Références" }]}
        image={images.about.teamInstallation}
      />

      {/* Stats band (derived from real data) */}
      <section className="surface-dark relative isolate overflow-hidden border-t border-white/[0.07] bg-ink" aria-label="PBXcom en chiffres">
        <GridBackground className="-z-10 opacity-50" />
        <div className="container-site grid grid-cols-2 divide-white/[0.08] md:grid-cols-4 md:divide-x">
          {[
            { v: <CountUp to={site.yearsOfExperience} suffix=" ans" />, k: "d'expérience" },
            { v: <CountUp to={site.references.length} />, k: "organisations de référence" },
            { v: <CountUp to={sectorsCovered} />, k: "secteurs accompagnés" },
            { v: <CountUp to={3} />, k: "univers d'expertise" },
          ].map((s) => (
            <div key={s.k} className="px-4 py-8 md:px-8 md:py-10">
              <p className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">{s.v}</p>
              <p className="label-mono mt-2 text-[10px] text-green">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <Section tone="white" aria-labelledby="clients-title">
        <SectionHeading id="clients-title" eyebrow="Clients" title="Des organisations de référence" highlight="référence" subtitle="Quelques-unes des organisations qui nous ont confié leurs projets." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.references.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.07} className="h-full">
              <SpotlightCard className="h-full">
                <article className="group relative flex h-full min-h-[240px] flex-col justify-between p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="label-mono text-[10px] text-green">{r.sector}</span>
                    <span className="label-mono text-[10px] text-white/30">0{i + 1}</span>
                  </div>
                  <div>
                    {r.logo ? (
                      <div className="inline-flex h-20 w-44 items-center justify-center rounded-xl bg-white px-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]">
                        <img src={r.logo} alt={r.fullName} width={640} height={320} className="h-16 w-auto object-contain" loading="lazy" />
                      </div>
                    ) : (
                      <p className="font-display text-4xl font-semibold tracking-tight">{r.name}</p>
                    )}
                    <p className="mt-3 text-[13px] leading-snug text-white/50">{r.fullName}</p>
                  </div>
                  <CardCircuit />
                </article>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Marquee duration={40}>
            {refsLoop.map((r, i) => (
              <span key={`${r.name}-${i}`} className="flex shrink-0 items-center gap-4 pr-4 font-display text-2xl font-semibold text-ink/15">
                {r.name}
                <span className="size-1.5 rounded-full bg-green-deep/40" aria-hidden />
              </span>
            ))}
          </Marquee>
        </div>
      </Section>

      {/* Projects */}
      <Section tone="light" divider aria-labelledby="projects-title">
        <SectionHeading
          id="projects-title"
          eyebrow="Réalisations"
          title="Des projets par secteur"
          highlight="par secteur"
          subtitle="Exemples représentatifs de projets que nous menons, de l'étude à la mise en service."
        />
        <SiteTabs tabs={tabs} value={filter} onChange={setFilter} layoutId="ref-filter" label="Filtrer par secteur" className="mb-10" />
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => {
              const sector = getSector(p.sector);
              const featured = i === 0 && shown.length > 2;
              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_oklch(0.155_0.006_165/0.5)]",
                    featured && "md:col-span-2 lg:grid lg:grid-cols-[1.2fr_1fr]",
                  )}
                >
                  <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[420px]" : "aspect-[16/10]")}>
                    <SmartImage {...p.image} fill sizes="(min-width:1024px) 50vw, (min-width:768px) 50vw, 100vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,oklch(0.155_0.006_165/0.6))]" />
                    <span className="label-mono absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[10px] text-green">
                      {sector && <sector.icon className="size-3" strokeWidth={2} aria-hidden />}
                      {sector?.name}
                    </span>
                    {featured && <span className="label-mono absolute right-4 top-4 rounded-full bg-green px-3 py-1.5 text-[10px] text-ink">Projet à la une</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <h3 className={cn("font-display font-semibold leading-snug text-ink", featured ? "text-2xl" : "text-lg")}>{p.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-mute">{p.scope}</p>
                    <ul className="mt-5 flex flex-col gap-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-[14px] text-ink/80">
                          <Check className="mt-0.5 size-4 shrink-0 text-green-deep" aria-hidden />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      {p.solutions.map((s) => {
                        const svc = getService(s);
                        return svc ? (
                          <Link key={s} to="/solutions/$universe" params={{ universe: svc.universe }} hash={svc.slug} className="relative z-10">
                            <Chip className="transition-colors hover:border-green-deep" icon={<svc.icon className="size-3.5 text-green-deep" strokeWidth={1.75} aria-hidden />}>
                              {svc.name}
                            </Chip>
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <CardCircuit />
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
        <p className="mt-10 text-center text-[14px] text-mute">
          Votre secteur n'apparaît pas ?{" "}
          <Link to="/secteurs" className="inline-flex items-center gap-1 font-medium text-green-deep hover:underline">
            Voir tous nos secteurs <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </p>
      </Section>

      <CTABand title="Votre projet sera notre prochaine référence." />
    </>
  );
}