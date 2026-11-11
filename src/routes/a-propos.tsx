import { useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
  ClipboardList,
  Ear,
  Handshake,
  Headset,
  Layers,
  MapPinned,
  PackageCheck,
  Power,
  Quote,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { images } from "@/config/images";
import { universes } from "@/data/universes";
import { servicesByUniverse } from "@/data/services";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { PageHero, CTABand, Marquee, SpotlightCard, CardCircuit } from "@/components/site/blocks";
import { Section, SectionHeading } from "@/components/site/primitives";
import { CircuitLines, Glow, GridBackground } from "@/components/site/circuit";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal, CountUp, EASE } from "@/components/site/motion";

export const Route = createFileRoute("/a-propos")({
  head: () =>
    seo({
      title: "À propos de PBXcom",
      description: `Intégrateur sécurité, réseau et télécom basé à Rabat depuis ${site.foundingYear}. Découvrez notre histoire, nos valeurs et notre façon de travailler.`,
      path: "/a-propos",
      breadcrumbs: [{ name: "À propos", path: "/a-propos" }],
    }),
  component: AboutPage,
});

/* ───────────────────────── content (generated) */

const manifesto =
  "Une installation n'a de valeur que si elle fonctionne chaque jour. Nous concevons des systèmes simples à utiliser, solides dans le temps et pensés ensemble : sécurité, réseau et télécom, pour connecter et protéger ce qui compte.";
const manifestoHighlights = ["fonctionne", "chaque", "jour.", "connecter", "protéger"];

const values = [
  { n: "01", icon: ShieldCheck, title: "Fiabilité", text: "Du matériel professionnel éprouvé, installé dans les règles de l'art et testé avant chaque mise en service." },
  { n: "02", icon: Handshake, title: "Proximité", text: "Un interlocuteur unique qui connaît votre site, de la première visite au contrat de maintenance." },
  { n: "03", icon: Layers, title: "Vision globale", text: "Sécurité, réseau et télécom pensés ensemble pour des systèmes qui communiquent entre eux." },
  { n: "04", icon: Headset, title: "Réactivité", text: `Un devis en ${site.quoteDelay} et une équipe joignable pour vos interventions.` },
];

const method = [
  { icon: Ear, title: "Écoute & visite", text: "Nous venons sur place comprendre vos locaux, vos usages et vos contraintes avant de proposer quoi que ce soit." },
  { icon: ClipboardList, title: "Étude & devis", text: "Une solution dimensionnée au plus juste, expliquée clairement, avec un devis détaillé et sans engagement." },
  { icon: PackageCheck, title: "Fourniture", text: "Des équipements professionnels sélectionnés auprès de partenaires reconnus, disponibles depuis notre stock." },
  { icon: Wrench, title: "Installation", text: "Une équipe dédiée, un chantier propre, un câblage repéré et documenté." },
  { icon: Power, title: "Mise en service & suivi", text: "Tests, formation de vos équipes, puis maintenance et assistance pour que tout continue de fonctionner." },
];

const timeline = [
  { tag: String(site.foundingYear), title: "Fondation à Rabat", text: "PBXcom naît à Rabat avec une spécialité : la téléphonie d'entreprise et les standards PBX, qui donnent son nom à la société." },
  { tag: "Phase 2", title: "Le réseau au cœur des projets", text: "Câblage structuré, fibre optique et Wi-Fi professionnel rejoignent notre offre : la téléphonie IP impose des réseaux solides." },
  { tag: "Phase 3", title: "La sécurité électronique", text: "Vidéosurveillance IP, contrôle d'accès, alarme et détection incendie complètent nos trois univers d'expertise." },
  { tag: "Phase 4", title: "Grands comptes et multi-sites", text: "Nous accompagnons des organisations exigeantes sur des projets multi-sites, de l'étude à la maintenance." },
  { tag: "Aujourd'hui", title: "La boutique en ligne", text: "Notre sélection d'équipements professionnels devient accessible en ligne, avec la même expertise et livraison partout au Maroc." },
];

/* ───────────────────────── Hero aside */
function HeroFacts() {
  const facts = [
    { k: "Fondée en", v: String(site.foundingYear) },
    { k: "Basée à", v: `${site.address.district}, Rabat` },
    { k: "Univers", v: "Sécurité · Réseau · Télécom" },
  ];
  return (
    <motion.dl
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
      className="hidden w-[300px] flex-col overflow-hidden rounded-[18px] bg-graphite/90 ring-1 ring-white/10 lg:flex"
    >
      {facts.map((f, i) => (
        <div key={f.k} className={cn("px-6 py-4", i > 0 && "border-t border-white/[0.07]")}>
          <dt className="label-mono text-[10px] text-white/45">{f.k}</dt>
          <dd className="mt-1 font-display text-lg font-semibold text-white">{f.v}</dd>
        </div>
      ))}
    </motion.dl>
  );
}

/* ───────────────────────── Manifesto: words light up on scroll */
function ManifestoWord({ children, progress, range, highlight }: { children: ReactNode; progress: MotionValue<number>; range: [number, number]; highlight: boolean }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("mr-[0.25em] inline-block", highlight && "text-green")}>
      {children}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = manifesto.split(" ");
  return (
    <section className="surface-dark relative isolate overflow-hidden bg-ink py-24 md:py-36" aria-label="Notre manifeste">
      <GridBackground className="-z-10" />
      <Glow className="-left-40 top-0 -z-10 size-[520px]" />
      <div className="container-site">
        <p className="label-mono mb-8 text-green">Notre conviction</p>
        <p ref={ref} className="max-w-5xl font-display text-[clamp(1.75rem,1rem+3vw,3.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
          {words.map((w, i) =>
            reduce ? (
              <span key={i} className={cn("mr-[0.25em] inline-block", manifestoHighlights.includes(w) && "text-green")}>
                {w}
              </span>
            ) : (
              <ManifestoWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} highlight={manifestoHighlights.includes(w)}>
                {w}
              </ManifestoWord>
            ),
          )}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Name breakdown: PBX + COM */
function NameBreakdown() {
  const [open, setOpen] = useState<"pbx" | "com">("pbx");
  const parts = {
    pbx: {
      label: "PBX",
      title: "Private Branch eXchange",
      text: "Le standard téléphonique d'entreprise : notre métier d'origine. Il relie les postes, gère les appels et a fait de nous des spécialistes de la communication professionnelle.",
    },
    com: {
      label: "COM",
      title: "Communication",
      text: "Tout ce qui relie vos équipes et protège vos sites : réseaux, fibre, Wi-Fi, téléphonie IP, visioconférence, vidéosurveillance et contrôle d'accès.",
    },
  } as const;
  const current = parts[open];
  return (
    <Section tone="light" aria-labelledby="name-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading id="name-title" eyebrow="Notre nom" title="Ce que veut dire PBXcom" highlight="PBXcom" className="mb-8 md:mb-8" />
          <div className="flex items-baseline gap-1 font-display text-[clamp(4rem,2rem+8vw,9rem)] font-bold leading-none tracking-[-0.05em]">
            {(["pbx", "com"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onMouseEnter={() => setOpen(k)}
                onFocus={() => setOpen(k)}
                onClick={() => setOpen(k)}
                aria-pressed={open === k}
                className={cn(
                  "relative cursor-pointer transition-colors duration-300",
                  open === k ? (k === "pbx" ? "text-ink" : "text-green-deep") : "text-ink/15 hover:text-ink/35",
                )}
              >
                {parts[k].label}
                {open === k && <motion.span layoutId="name-underline" className="absolute -bottom-2 left-0 h-1.5 w-full rounded-full bg-green" />}
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm text-mute">Survolez chaque partie du nom.</p>
        </div>
        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={open}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative overflow-hidden rounded-[20px] bg-ink p-8 text-white md:p-10"
            >
              <CircuitLines variant="corner" opacity={0.3} />
              <p className="label-mono relative text-green">{current.label}</p>
              <h3 className="relative mt-3 font-display text-3xl font-semibold tracking-tight">{current.title}</h3>
              <p className="relative mt-4 max-w-[50ch] leading-relaxed text-white/70">{current.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── Method: sticky title + steps lighting up */
function Method() {
  const [active, setActive] = useState(0);
  return (
    <Section tone="white" aria-labelledby="method-title">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="method-title"
            eyebrow="Notre méthode"
            title="Cinq étapes, une seule équipe"
            highlight="une seule équipe"
            subtitle="La même méthode pour une résidence ou un grand compte : comprendre, proposer juste, installer proprement et rester disponibles."
            className="mb-8 md:mb-8"
          />
          <div className="hidden items-center gap-2 lg:flex" aria-hidden>
            {method.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-10 bg-green" : i < active ? "w-4 bg-green-deep/50" : "w-4 bg-ink/10")} />
            ))}
            <span className="label-mono ml-3 text-[11px] text-mute">
              0{active + 1} / 0{method.length}
            </span>
          </div>
          <Link to="/devis" className={cn(buttonVariants({ variant: "dark", size: "md" }), "mt-10")}>
            <ButtonContent arrow>Démarrer un projet</ButtonContent>
          </Link>
        </div>
        <ol className="flex flex-col gap-4">
          {method.map((m, i) => {
            const on = i === active;
            return (
              <motion.li
                key={m.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className={cn(
                  "relative flex gap-5 overflow-hidden rounded-[18px] p-6 transition-[background-color,box-shadow] duration-500 md:p-8",
                  on ? "bg-ink text-white shadow-[0_30px_60px_-30px_oklch(0.155_0.006_165/0.6)]" : "bg-paper text-ink",
                )}
              >
                <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-500", on ? "bg-green text-ink" : "bg-white text-green-deep")}>
                  <m.icon className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className={cn("label-mono text-[10px] transition-colors", on ? "text-green" : "text-mute")}>Étape 0{i + 1}</p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold">{m.title}</h3>
                  <p className={cn("mt-2 max-w-[52ch] text-[15px] leading-relaxed transition-colors", on ? "text-white/65" : "text-mute")}>{m.text}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/* ───────────────────────── Timeline */
function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <span className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 md:left-1/2" aria-hidden />
      <motion.span className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-green md:left-1/2" style={{ scaleY: reduce ? 1 : scaleY }} aria-hidden />
      {timeline.map((t, i) => {
        const left = i % 2 === 0;
        const last = i === timeline.length - 1;
        return (
          <li key={t.title} className={cn("relative flex gap-6 pb-12 last:pb-0 md:w-1/2", left ? "md:pr-14" : "md:ml-auto md:pl-14")}>
            <span
              className={cn(
                "relative z-10 mt-5 flex size-10 shrink-0 items-center justify-center rounded-full border bg-ink md:absolute",
                last ? "border-green" : "border-green/40",
                left ? "md:-right-5" : "md:-left-5",
              )}
              aria-hidden
            >
              <span className={cn("rounded-full bg-green", last ? "size-3 shadow-[0_0_12px_var(--green)]" : "size-2.5")} />
            </span>
            <Reveal className="w-full">
              <div className={cn("group relative overflow-hidden rounded-[16px] bg-graphite p-6 hairline-dark transition-transform duration-300 hover:-translate-y-1", left && "md:text-right")}>
                <p className="label-mono text-[11px] text-green">{t.tag}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">{t.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{t.text}</p>
                <CardCircuit />
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────────────────── Page */
function AboutPage() {
  const gallery = [images.about.teamInstallation, images.about.teamOffice, images.process.travaux, images.about.warehouse, images.process.appel];
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title={`Connecter et protéger depuis ${site.foundingYear}`}
        highlight="protéger"
        subtitle="PBXcom est un intégrateur marocain spécialisé en sécurité électronique, infrastructures réseau et télécommunications. Nous concevons, installons et maintenons des systèmes qui fonctionnent, tout simplement."
        crumbs={[{ label: "À propos" }]}
        image={images.about.teamOffice}
        aside={<HeroFacts />}
      />

      {/* Story */}
      <Section tone="white" aria-labelledby="story-title">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading id="story-title" eyebrow="Notre histoire" title="Une équipe d'intégrateurs, pas de simples revendeurs" highlight="intégrateurs" className="mb-8 md:mb-8" />
            <div className="flex flex-col gap-5 text-[16px] leading-relaxed text-ink/75">
              <p>
                Tout a commencé à Rabat, en {site.foundingYear}, autour de la téléphonie d'entreprise. Au fil des projets, nos clients nous ont confié leur réseau, puis la
                sécurité de leurs locaux : nous sommes devenus leur partenaire technique unique.
              </p>
              <p>
                Notre méthode n'a pas changé : comprendre le site et les usages, proposer la solution juste, l'installer proprement et rester disponibles ensuite. C'est ce
                qui nous permet de travailler aussi bien pour une résidence que pour un grand compte.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/[0.08] pt-8">
              <div>
                <dt className="label-mono text-[10px] text-mute">Années d'expérience</dt>
                <dd className="mt-2 font-display text-4xl font-semibold text-ink">
                  <CountUp to={site.yearsOfExperience} suffix="+" />
                </dd>
              </div>
              <div>
                <dt className="label-mono text-[10px] text-mute">Univers d'expertise</dt>
                <dd className="mt-2 font-display text-4xl font-semibold text-ink">
                  <CountUp to={3} />
                </dd>
              </div>
              <div>
                <dt className="label-mono text-[10px] text-mute">Devis</dt>
                <dd className="mt-2 font-display text-4xl font-semibold text-ink">
                  &lt;<CountUp to={4} suffix="h" />
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="grid grid-cols-[1.3fr_1fr] gap-4">
              <div className="overflow-hidden rounded-[20px]">
                <SmartImage {...images.about.teamInstallation} ratio="3/4" sizes="(min-width:1024px) 28vw, 60vw" objectPosition="center" />
              </div>
              <div className="flex flex-col gap-4 pt-14">
                <div className="overflow-hidden rounded-[20px]">
                  <SmartImage {...images.about.warehouse} ratio="1/1" sizes="(min-width:1024px) 20vw, 40vw" />
                </div>
                <div className="rounded-[18px] bg-green p-5 text-ink">
                  <p className="font-display text-3xl font-bold">3 en 1</p>
                  <p className="mt-1 text-sm text-ink/75">Sécurité, réseau et télécom chez le même intégrateur.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-[14px] bg-ink px-5 py-4 text-white shadow-xl md:-left-8">
              <MapPinned className="size-5 text-green" aria-hidden />
              <div>
                <p className="text-[14px] font-medium">Basés à {site.address.district}, Rabat</p>
                <p className="text-[12px] text-white/50">Interventions partout au Maroc</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Manifesto />

      <NameBreakdown />

      {/* Values: dark spotlight bento */}
      <Section tone="dark" className="overflow-hidden bg-noise" aria-labelledby="values-title">
        <GridBackground className="-z-10" />
        <SectionHeading id="values-title" tone="dark" eyebrow="Nos valeurs" title="Ce qui guide chaque installation" highlight="chaque installation" align="center" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07} className="h-full">
              <SpotlightCard tone="dark" className="h-full">
                <div className="group relative flex h-full min-h-[300px] flex-col justify-between p-7">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-green ring-1 ring-white/10">
                      <v.icon className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="stroke-text font-mono text-5xl font-medium leading-none text-green/60">{v.n}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">{v.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/60">{v.text}</p>
                  </div>
                  <CardCircuit />
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Method />

      {/* Timeline */}
      <Section tone="dark" className="overflow-hidden" aria-labelledby="timeline-title">
        <Glow className="-right-40 top-1/3 -z-10 size-[520px]" />
        <SectionHeading id="timeline-title" eyebrow="Parcours" title="Une expertise construite pas à pas" highlight="pas à pas" tone="dark" align="center" />
        <Timeline />
      </Section>

      {/* What we cover */}
      <Section tone="light" aria-labelledby="cover-title">
        <SectionHeading id="cover-title" eyebrow="Notre périmètre" title="Trois univers, douze services" highlight="douze services" />
        <div className="grid gap-4 md:grid-cols-3">
          {universes.map((u, i) => (
            <Reveal key={u.id} delay={i * 0.08} className="h-full">
              <Link to="/solutions/$universe" params={{ universe: u.id }} className="group relative isolate flex h-full min-h-[360px] flex-col justify-end overflow-hidden rounded-[18px] p-6">
                <SmartImage {...u.image} fill className="-z-10" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width:768px) 33vw, 100vw" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.155_0.006_165/0.1),oklch(0.155_0.006_165/0.95)_70%)]" />
                <span className="label-mono text-green">{u.number}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">{u.name}</h3>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {servicesByUniverse(u.id).map((s) => (
                    <li key={s.slug} className="flex items-center gap-2 text-[14px] text-white/75">
                      <s.icon className="size-3.5 text-green" strokeWidth={1.75} aria-hidden />
                      {s.name}
                    </li>
                  ))}
                </ul>
                <CardCircuit />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Direction */}
      <Section tone="white" aria-labelledby="direction-title">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <figure className="relative">
              <div className="overflow-hidden rounded-[20px] bg-paper">
                <SmartImage {...images.about.ceo} ratio="4/5" sizes="(min-width:1024px) 35vw, 100vw" objectPosition="top" />
              </div>
              <figcaption className="absolute -bottom-5 right-5 rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-white shadow-lg">{site.direction.label}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <SpotlightCard tone="dark" className="p-8 md:p-12">
              <Quote className="size-10 text-green" aria-hidden />
              <h2 id="direction-title" className="type-h3 mt-6 text-white">
                Le mot de la direction
              </h2>
              <blockquote className="mt-6 text-[17px] leading-relaxed text-white/75">{site.direction.message}</blockquote>
              <p className="mt-8 font-medium text-green">— {site.direction.label}</p>
            </SpotlightCard>
          </Reveal>
        </div>
      </Section>

      {/* Gallery marquee */}
      <section className="bg-white pb-20 md:pb-28" aria-label="L'équipe PBXcom au travail">
        <Marquee duration={50}>
          {gallery.map((img) => (
            <div key={img.src} className="group relative w-[300px] shrink-0 overflow-hidden rounded-[18px] md:w-[420px]">
              <SmartImage {...img} ratio="4/3" sizes="420px" imgClassName="transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute bottom-4 left-4 flex max-w-[85%] items-center gap-2 truncate rounded-full bg-ink/85 px-3 py-1.5 text-[12px] text-white">
                <Wrench className="size-3.5 shrink-0 text-green" aria-hidden />
                <span className="truncate">{img.alt}</span>
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      <CTABand tone="green" title="Travaillons ensemble." text="Parlez-nous de votre site : un conseiller vous rappelle et vous propose une solution adaptée, sans engagement." />
    </>
  );
}