import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { sectors } from "@/data/sectors";
import { getService } from "@/data/services";
import { images } from "@/config/images";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { CTABand, PageHero, CardCircuit } from "@/components/site/blocks";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal, EASE } from "@/components/site/motion";

export const Route = createFileRoute("/secteurs")({
  head: () =>
    seo({
      title: "Secteurs — Entreprise, Hôtel, Collectivité, Résidence, Santé, Transport",
      description:
        "Des solutions de sécurité, réseau et télécom adaptées à chaque secteur : entreprises, hôtels, collectivités, résidences, établissements de santé et transport.",
      path: "/secteurs",
      breadcrumbs: [{ name: "Secteurs", path: "/secteurs" }],
    }),
  component: SecteursPage,
});

/* ───────── Overview mosaic */
function SectorMosaic() {
  return (
    <section className="bg-paper pt-12 md:pt-16" aria-label="Aperçu des secteurs">
      <div className="container-site">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {sectors.map((s, i) => (
            <motion.li
              key={s.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
            >
              <a href={`#${s.slug}`} className="group relative isolate flex h-[180px] flex-col justify-end overflow-hidden rounded-[18px] p-4 md:h-[240px] md:p-6">
                <SmartImage {...s.image} fill className="-z-10" imgClassName="transition-transform duration-700 group-hover:scale-[1.07]" sizes="(min-width:768px) 33vw, 50vw" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.05),oklch(0.155_0.006_165/0.9))]" />
                <span className="label-mono absolute left-4 top-4 text-[11px] text-white/70 md:left-6 md:top-6">0{i + 1}</span>
                <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-all duration-300 group-hover:bg-green group-hover:text-ink md:right-6 md:top-6">
                  <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
                </span>
                <span className="flex items-center gap-2">
                  <s.icon className="size-5 text-green" strokeWidth={1.5} aria-hidden />
                  <span className="font-display text-lg font-semibold text-white md:text-2xl">{s.name}</span>
                </span>
                <span className="mt-1 hidden text-[13px] text-white/60 md:block">{s.short}</span>
                <CardCircuit />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SecteursPage() {
  const [active, setActive] = useState<string>(sectors[0]!.slug);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sectors.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const activeIndex = Math.max(0, sectors.findIndex((s) => s.slug === active));

  return (
    <>
      <PageHero
        eyebrow="Secteurs d'activité"
        title="Des solutions pensées pour votre métier"
        highlight="votre métier"
        subtitle="Hôtels, collectivités, cliniques, résidences, plateformes logistiques ou bureaux : chaque secteur a ses usages et ses contraintes. Nous y adaptons nos installations."
        crumbs={[{ label: "Secteurs" }]}
        image={images.sectors.collectivite}
      />

      <SectorMosaic />

      {/* Sticky sector bar with progress */}
      <nav aria-label="Secteurs" className="sticky top-[var(--header-h)] z-30 mt-12 border-y border-ink/[0.07] bg-paper/95 md:mt-16">
        <div className="container-site flex items-center gap-4">
          <ul className="no-scrollbar flex flex-1 gap-1 overflow-x-auto py-3">
            {sectors.map((s) => {
              const on = active === s.slug;
              return (
                <li key={s.slug}>
                  <a
                    href={`#${s.slug}`}
                    aria-current={on ? "true" : undefined}
                    className={cn("relative flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors", on ? "text-white" : "text-ink/70 hover:bg-white hover:text-ink")}
                  >
                    {on && <motion.span layoutId="sector-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                    <s.icon className={cn("relative size-4", on ? "text-green" : "text-mute")} strokeWidth={1.5} aria-hidden />
                    <span className="relative">{s.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <span className="label-mono hidden shrink-0 text-[11px] text-mute md:block">
            0{activeIndex + 1} / 0{sectors.length}
          </span>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-[2px] origin-left bg-green-deep" aria-hidden />
      </nav>

      {sectors.map((s, i) => {
        const reverse = i % 2 === 1;
        const dark = i % 2 === 1;
        const firstService = s.solutions[0] ? getService(s.solutions[0]) : undefined;
        return (
          <section
            key={s.slug}
            id={s.slug}
            aria-labelledby={`${s.slug}-title`}
            className={cn("section-pad relative isolate scroll-mt-[calc(var(--header-h)+64px)] overflow-hidden", dark ? "surface-dark" : "bg-paper text-ink")}
          >
            {/* giant index number */}
            <span
              aria-hidden
              className={cn(
                "stroke-text pointer-events-none absolute -top-6 -z-10 font-mono text-[12rem] font-medium leading-none md:text-[18rem]",
                reverse ? "left-4" : "right-4",
                dark ? "text-green/20" : "text-green-deep/15",
              )}
            >
              0{i + 1}
            </span>
            <div className="container-site grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={cn("relative", reverse && "lg:order-2")}>
                <div className="group relative overflow-hidden rounded-[22px]">
                  <SmartImage {...s.image} ratio="5/4" sizes="(min-width:1024px) 50vw, 100vw" imgClassName="transition-transform duration-[1100ms] group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,oklch(0.155_0.006_165/0.75))]" />
                  {/* floating solution chips over the image */}
                  <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                    {s.solutions.slice(0, 3).map((slug, k) => {
                      const svc = getService(slug);
                      if (!svc) return null;
                      return (
                        <motion.span
                          key={slug}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + k * 0.1 }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[12px] text-white ring-1 ring-white/15"
                        >
                          <svc.icon className="size-3.5 text-green" strokeWidth={1.75} aria-hidden />
                          {svc.name}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
                <div className={cn("absolute -top-5 flex max-w-[calc(100%-2.5rem)] items-center gap-3 rounded-2xl px-4 py-3", reverse ? "left-5" : "right-5", dark ? "bg-green text-ink" : "bg-ink text-white")}>
                  <s.icon className="size-5" strokeWidth={1.5} aria-hidden />
                  <span className="font-mono text-xs uppercase tracking-wider">{s.short}</span>
                </div>
              </Reveal>
              <div>
                <p className={cn("label-mono", dark ? "text-green" : "text-green-deep")}>Secteur 0{i + 1}</p>
                <h2 id={`${s.slug}-title`} className={cn("type-h2 mt-3", dark ? "text-white" : "text-ink")}>
                  {s.name}
                </h2>
                <p className={cn("type-lead mt-5", dark ? "text-white/65" : "text-mute")}>{s.description}</p>

                <h3 className={cn("label-mono mb-4 mt-8 text-[11px]", dark ? "text-white/45" : "text-mute")}>Vos besoins</h3>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {s.needs.map((n, k) => (
                    <motion.li
                      key={n}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: k * 0.06, duration: 0.4, ease: EASE }}
                      className={cn("flex gap-3 rounded-[12px] p-3 text-[14px]", dark ? "bg-graphite text-white/85 ring-1 ring-white/[0.07]" : "bg-white text-ink/85 ring-1 ring-ink/[0.06]")}
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green text-ink">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {n}
                    </motion.li>
                  ))}
                </ul>

                <h3 className={cn("label-mono mb-4 mt-8 text-[11px]", dark ? "text-white/45" : "text-mute")}>Solutions recommandées</h3>
                <div className="flex flex-wrap gap-2">
                  {s.solutions.map((slug) => {
                    const svc = getService(slug);
                    if (!svc) return null;
                    return (
                      <Link
                        key={slug}
                        to="/solutions/$universe"
                        params={{ universe: svc.universe }}
                        hash={svc.slug}
                        className={cn(
                          "group inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[14px] transition-colors",
                          dark ? "border-white/15 bg-white/[0.04] text-white/85 hover:border-green hover:text-white" : "border-ink/10 bg-white text-ink/85 hover:border-green-deep",
                        )}
                      >
                        <svc.icon className={cn("size-3.5", dark ? "text-green" : "text-green-deep")} strokeWidth={1.75} aria-hidden />
                        {svc.name}
                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link to="/devis" search={{ secteur: s.slug }} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "h-auto min-h-14 max-w-full whitespace-normal py-3 text-left")}>
                    <ButtonContent arrow>Devis pour le secteur {s.name}</ButtonContent>
                  </Link>
                  {firstService && (
                    <Link
                      to="/solutions/$universe"
                      params={{ universe: firstService.universe }}
                      hash={firstService.slug}
                      className={buttonVariants({ variant: dark ? "secondary" : "secondary-light", size: "lg" })}
                    >
                      Voir les solutions
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <CTABand tone="green" title="Votre secteur n'est pas listé ?" text="Nous accompagnons aussi les écoles, commerces, industries et bien d'autres. Décrivez-nous votre projet." />
    </>
  );
}