import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { getUniverse, universes } from "@/data/universes";
import { servicesByUniverse } from "@/data/services";
import { sectors } from "@/data/sectors";
import { products } from "@/data/products";
import { universeFaq } from "@/data/faq";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { CTABand, PageHero, CardCircuit } from "@/components/site/blocks";
import { Section, SectionHeading } from "@/components/site/primitives";
import { GridBackground } from "@/components/site/circuit";
import { SmartImage } from "@/components/site/smart-image";
import { SiteAccordion } from "@/components/site/site-accordion";
import { ProductRail } from "@/components/site/product-rail";
import { Reveal, EASE } from "@/components/site/motion";

export const Route = createFileRoute("/solutions/$universe")({
  loader: ({ params }) => {
    const universe = getUniverse(params.universe);
    if (!universe) throw notFound();
    return { universeId: universe.id };
  },
  head: ({ loaderData }) => {
    const u = loaderData ? getUniverse(loaderData.universeId) : undefined;
    if (!u) return {};
    const list = servicesByUniverse(u.id)
      .map((s) => s.name.toLowerCase())
      .join(", ");
    return seo({
      title: `${u.name} — ${u.title}`,
      description: `${u.name} à Rabat et partout au Maroc : ${list}. Étude, installation et maintenance par PBXcom. Devis gratuit en moins de 4h.`,
      path: `/solutions/${u.id}`,
      image: u.image.src,
      breadcrumbs: [
        { name: "Solutions", path: "/solutions" },
        { name: u.name, path: `/solutions/${u.id}` },
      ],
    });
  },
  component: UniversePage,
});

const timeline = [
  { t: "Étude", d: "Visite du site et analyse des besoins" },
  { t: "Fourniture", d: "Matériel professionnel sélectionné" },
  { t: "Installation", d: "Pose propre, câblage repéré" },
  { t: "Mise en service", d: "Tests, paramétrage et formation" },
  { t: "Maintenance", d: "Suivi et assistance dans le temps" },
];

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* Steps that light up one after another when scrolled into view */
function InterventionSteps() {
  return (
    <ol className="relative mt-5 flex flex-col gap-4">
      <span className="absolute bottom-2 left-[7px] top-2 w-px bg-green-deep/20" aria-hidden />
      <motion.span
        className="absolute left-[7px] top-2 w-px origin-top bg-green-deep"
        style={{ bottom: 8 }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.2, ease: EASE }}
        aria-hidden
      />
      {timeline.map((t, j) => (
        <motion.li
          key={t.t}
          initial={{ opacity: 0.35 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ delay: j * 0.22, duration: 0.4 }}
          className="relative flex items-start gap-4"
        >
          <span className="relative z-10 mt-0.5 flex size-[15px] shrink-0 items-center justify-center rounded-full border-2 border-green-deep bg-white" aria-hidden>
            <motion.span
              className="size-[7px] rounded-full bg-green-deep"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ delay: j * 0.22 + 0.1, type: "spring", stiffness: 400, damping: 20 }}
            />
          </span>
          <span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-mute">0{j + 1}</span>
              <span className="text-[15px] font-medium text-ink">{t.t}</span>
            </span>
            <span className="mt-0.5 block text-[13px] text-mute">{t.d}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
}

function UniversePage() {
  const { universeId } = Route.useLoaderData();
  const universe = getUniverse(universeId)!;
  const list = servicesByUniverse(universe.id);
  const ids = useMemo(() => list.map((s) => s.slug), [universe.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = useScrollSpy(ids);
  const activeIndex = Math.max(0, ids.findIndex((id) => id === active));
  const related = products.filter((p) => p.universe === universe.id);
  const servedSectors = sectors.filter((sec) => sec.solutions.some((slug) => ids.includes(slug)));
  const others = universes.filter((u) => u.id !== universe.id);
  const firstCategory = universe.categories[0];

  const servicesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: servicesRef, offset: ["start 30%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <PageHero
        eyebrow={`Univers ${universe.number}`}
        title={universe.title}
        highlight={universe.highlight}
        subtitle={universe.description}
        crumbs={[{ label: "Solutions", href: "/solutions" }, { label: universe.name }]}
        image={universe.image}
        aside={
          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="hidden w-[300px] flex-col gap-2 lg:flex"
            aria-label="Services de cet univers"
          >
            {list.map((s, i) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="group flex items-center gap-3 rounded-[14px] bg-graphite/90 p-3 ring-1 ring-white/10 transition-[box-shadow] hover:ring-green/60">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-green">
                    <s.icon className="size-4" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="flex-1 text-[14px] font-medium text-white">{s.name}</span>
                  <span className="label-mono text-[10px] text-white/35">0{i + 1}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/devis" search={{ besoin: universe.id }} className={buttonVariants({ variant: "primary", size: "lg" })}>
            <ButtonContent arrow>Devis {universe.name}</ButtonContent>
          </Link>
          {firstCategory && (
            <Link to="/boutique/$category" params={{ category: firstCategory }} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Voir les produits
            </Link>
          )}
        </div>
      </PageHero>

      {/* Mobile sticky chips */}
      <nav aria-label="Services de cet univers" className="sticky top-[var(--header-h)] z-30 border-b border-ink/[0.07] bg-paper/95 lg:hidden">
        <ul className="no-scrollbar container-site flex gap-2 overflow-x-auto py-3">
          {list.map((s) => (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                className={cn(
                  "flex min-h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
                  active === s.slug ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/75",
                )}
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section tone="light" className="!pt-14 lg:!pt-24">
        <div ref={servicesRef} className="grid gap-12 lg:grid-cols-[250px_1fr] lg:gap-16">
          {/* Sticky sub-nav with scroll-spy + progress */}
          <aside className="hidden lg:block">
            <nav aria-label="Services de cet univers" className="sticky top-[calc(var(--header-h)+40px)]">
              <div className="mb-5 flex items-center justify-between">
                <p className="label-mono text-green-deep">{universe.name}</p>
                <span className="label-mono text-[10px] text-mute">
                  0{activeIndex + 1}/0{list.length}
                </span>
              </div>
              <div className="relative">
                <span className="absolute bottom-0 left-0 top-0 w-px bg-ink/10" aria-hidden />
                <motion.span className="absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-green" style={{ scaleY: progress }} aria-hidden />
                <ul className="flex flex-col">
                  {list.map((s) => {
                    const on = active === s.slug;
                    return (
                      <li key={s.slug}>
                        <a
                          href={`#${s.slug}`}
                          aria-current={on ? "true" : undefined}
                          className={cn("flex items-center gap-3 py-3 pl-5 text-[15px] transition-colors", on ? "font-medium text-ink" : "text-mute hover:text-ink")}
                        >
                          <span className={cn("flex size-8 items-center justify-center rounded-lg transition-colors", on ? "bg-ink text-green" : "bg-white text-mute")}>
                            <s.icon className="size-4" strokeWidth={1.5} aria-hidden />
                          </span>
                          {s.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="relative mt-8 overflow-hidden rounded-[16px] bg-ink p-5 text-white">
                <GridBackground className="opacity-50" />
                <p className="relative font-display text-lg font-semibold">Un projet ?</p>
                <p className="relative mt-1 text-sm text-white/60">Devis gratuit en moins de 4h.</p>
                <Link to="/devis" search={{ besoin: universe.id }} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "relative mt-4 w-full")}>
                  <ButtonContent arrow>Demander</ButtonContent>
                </Link>
              </div>
            </nav>
          </aside>

          <div className="flex flex-col gap-20 md:gap-28">
            {list.map((s, i) => (
              <article key={s.slug} id={s.slug} className="scroll-mt-36 lg:scroll-mt-32" aria-labelledby={`${s.slug}-title`}>
                <Reveal className="group relative overflow-hidden rounded-[22px]">
                  <SmartImage {...s.image} ratio="16/9" sizes="(min-width:1024px) 900px, 100vw" imgClassName="transition-transform duration-[1100ms] group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.25),transparent_30%,transparent_60%,oklch(0.155_0.006_165/0.7))]" />
                  <span className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-xl bg-green text-ink">
                    <s.icon className="size-6" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="stroke-text absolute right-5 top-2 font-mono text-7xl font-medium leading-none text-white/40 md:text-8xl" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                    {s.specChips.map((c) => (
                      <span key={c} className="rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[12px] text-white ring-1 ring-white/15">
                        {c}
                      </span>
                    ))}
                  </div>
                </Reveal>
                <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
                  <div>
                    <p className="label-mono text-green-deep">
                      Service {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                    </p>
                    <h2 id={`${s.slug}-title`} className="type-h2 mt-3 text-ink">
                      {s.name}
                    </h2>
                    <p className="mt-5 max-w-[65ch] text-[17px] leading-relaxed text-ink/75">{s.description}</p>
                    <p className="label-mono mb-3 mt-8 text-[11px] text-mute">Cas d'usage</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {s.useCases.map((u, k) => (
                        <motion.li
                          key={u}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: k * 0.06 }}
                          className="flex items-center gap-2 rounded-[12px] border border-ink/[0.08] bg-white px-3 py-2.5 text-[14px] text-ink/80"
                        >
                          <Check className="size-4 shrink-0 text-green-deep" aria-hidden />
                          {u}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="h-fit rounded-[18px] border border-ink/[0.07] bg-white p-6 shadow-[0_24px_50px_-40px_oklch(0.155_0.006_165/0.5)]">
                    <p className="label-mono text-[11px] text-mute">Notre intervention</p>
                    <InterventionSteps />
                    <Link to="/devis" search={{ service: s.slug }} className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-6 w-full")}>
                      <ButtonContent arrow>Devis pour ce service</ButtonContent>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="white" aria-labelledby="related-title">
          <SectionHeading id="related-title" eyebrow="Boutique" title={`Le matériel ${universe.name.toLowerCase()}`} highlight={universe.name.toLowerCase()} />
          <ProductRail products={related} label={`Produits ${universe.name}`} />
        </Section>
      )}

      <Section tone="dark" className="overflow-hidden" aria-labelledby="sectors-served-title">
        <GridBackground className="-z-10" />
        <SectionHeading id="sectors-served-title" tone="dark" eyebrow="Secteurs servis" title="Ils s'appuient sur cette expertise" highlight="cette expertise" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servedSectors.map((sec, i) => (
            <Reveal key={sec.slug} delay={i * 0.06}>
              <Link to="/secteurs" hash={sec.slug} className="group relative isolate flex h-[220px] flex-col justify-end overflow-hidden rounded-[18px] p-5">
                <SmartImage {...sec.image} fill className="-z-10" imgClassName="transition-transform duration-700 group-hover:scale-[1.06]" sizes="(min-width:1024px) 33vw, 50vw" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.1),oklch(0.155_0.006_165/0.92))]" />
                <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:bg-green group-hover:text-ink">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
                <span className="flex items-center gap-2">
                  <sec.icon className="size-5 text-green" strokeWidth={1.5} aria-hidden />
                  <span className="font-display text-lg font-semibold text-white">{sec.name}</span>
                </span>
                <span className="mt-1 text-sm text-white/60">{sec.short}</span>
                <CardCircuit />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light" aria-labelledby="faq-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <SectionHeading id="faq-title" eyebrow="Questions fréquentes" title={`Tout savoir sur ${universe.name.toLowerCase()}`} className="!mb-8" />
            <p className="text-mute">Une autre question ? Nos conseillers vous répondent par téléphone ou sur WhatsApp.</p>
            <p className="label-mono mb-3 mt-10 text-[11px] text-mute">Univers complémentaires</p>
            <div className="flex flex-col gap-3">
              {others.map((o) => (
                <Link key={o.id} to="/solutions/$universe" params={{ universe: o.id }} className="group relative isolate flex h-24 items-center justify-between overflow-hidden rounded-[16px] px-5">
                  <SmartImage {...o.image} fill className="-z-10" imgClassName="transition-transform duration-700 group-hover:scale-110" sizes="400px" />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--ink)_35%,oklch(0.155_0.006_165/0.5))]" />
                  <span>
                    <span className="label-mono block text-[10px] text-green">Univers {o.number}</span>
                    <span className="font-display text-lg font-semibold text-white">{o.name}</span>
                  </span>
                  <ArrowRight className="size-5 text-green transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
          <SiteAccordion items={universeFaq[universe.id]} />
        </div>
      </Section>
      <CTABand />
    </>
  );
}