import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, ChevronDown, FileText, Link2, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { legalNav } from "@/config/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/site/blocks";
import { EASE } from "@/components/site/motion";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Shared layout for legal pages: hero meta card, reading progress, sticky TOC with scroll-spy, numbered section cards. */
export function LegalPage({ title, intro, updated, sections, path }: { title: string; intro: string; updated: string; sections: LegalSection[]; path: string }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [tocOpen, setTocOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start 30%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [sections]);

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
  const others = legalNav.filter((l) => l.to !== path);

  const copyLink = (id: string) => {
    try {
      void navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const toc = (onPick?: () => void) => (
    <ol className="relative mt-4 flex flex-col gap-0.5">
      <span className="absolute bottom-0 left-0 top-0 w-px bg-ink/10" aria-hidden />
      <motion.span className="absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-green-deep" style={{ scaleY: progress }} aria-hidden />
      {sections.map((s, i) => {
        const on = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={onPick}
              aria-current={on ? "location" : undefined}
              className={cn("flex gap-3 rounded-r-lg py-2 pl-4 pr-2 text-[14px] transition-colors", on ? "bg-paper font-medium text-ink" : "text-mute hover:text-ink")}
            >
              <span className={cn("font-mono text-[11px] leading-6", on ? "text-green-deep" : "opacity-60")}>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        title={title}
        subtitle={intro}
        crumbs={[{ label: title }]}
        compact
        aside={
          <motion.dl
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="hidden w-[280px] overflow-hidden rounded-[18px] bg-graphite/90 ring-1 ring-white/10 lg:block"
          >
            {[
              { k: "Dernière mise à jour", v: updated },
              { k: "Sections", v: `${sections.length} articles` },
              { k: "Droit applicable", v: "Droit marocain" },
            ].map((m, i) => (
              <div key={m.k} className={cn("px-5 py-3.5", i > 0 && "border-t border-white/[0.07]")}>
                <dt className="label-mono text-[10px] text-white/45">{m.k}</dt>
                <dd className="mt-0.5 text-[15px] font-medium text-white">{m.v}</dd>
              </div>
            ))}
          </motion.dl>
        }
      />

      {/* Reading progress */}
      <div className="sticky top-[var(--header-h)] z-30 h-[3px] bg-ink/[0.06]" aria-hidden>
        <motion.div className="h-full origin-left bg-green" style={{ scaleX: progress }} />
      </div>

      <section className="bg-white py-12 md:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[270px_1fr] lg:gap-20">
          {/* Mobile collapsible TOC */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setTocOpen((o) => !o)}
              aria-expanded={tocOpen}
              className="flex w-full cursor-pointer items-center justify-between rounded-[14px] border border-ink/[0.08] bg-paper px-5 py-4 text-left"
            >
              <span>
                <span className="label-mono block text-[10px] text-mute">Sommaire</span>
                <span className="mt-0.5 block text-[15px] font-medium text-ink">
                  {String(activeIndex + 1).padStart(2, "0")} · {sections[activeIndex]?.title}
                </span>
              </span>
              <ChevronDown className={cn("size-5 text-mute transition-transform", tocOpen && "rotate-180")} aria-hidden />
            </button>
            <AnimatePresence initial={false}>
              {tocOpen && (
                <motion.nav
                  aria-label="Sommaire"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden px-1"
                >
                  {toc(() => setTocOpen(false))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop sticky TOC */}
          <aside className="hidden lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:block lg:self-start">
            <nav aria-label="Sommaire">
              <div className="flex items-center justify-between">
                <p className="label-mono text-[10px] text-mute">Sommaire</p>
                <span className="label-mono text-[10px] text-green-deep">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                </span>
              </div>
              {toc()}
            </nav>
            <div className="mt-10 border-t border-ink/[0.08] pt-6">
              <p className="label-mono text-[10px] text-mute">Autres pages</p>
              <ul className="mt-3 flex flex-col gap-2 text-[14px]">
                {others.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="group inline-flex items-center gap-1.5 text-ink/70 hover:text-green-deep">
                      {l.label}
                      <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <article ref={articleRef} className="max-w-[76ch]">
            <p className="label-mono mb-8 flex items-center gap-2 text-[11px] text-mute">
              <span className="size-1.5 rounded-full bg-green-deep" aria-hidden />
              Dernière mise à jour : {updated}
            </p>
            <div className="flex flex-col gap-4">
              {sections.map((s, i) => {
                const on = active === s.id;
                return (
                  <motion.section
                    key={s.id}
                    id={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className={cn(
                      "group/sec relative scroll-mt-[calc(var(--header-h)+32px)] rounded-[18px] border p-6 transition-[border-color,box-shadow,background-color] duration-300 md:p-8",
                      on ? "border-green-deep/30 bg-white shadow-[0_24px_50px_-40px_oklch(0.155_0.006_165/0.5)]" : "border-ink/[0.07] bg-paper/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold text-ink md:text-2xl">
                        <span className={cn("font-mono text-[0.65em] transition-colors", on ? "text-green-deep" : "text-mute")}>{String(i + 1).padStart(2, "0")}</span>
                        {s.title}
                      </h2>
                      <button
                        type="button"
                        onClick={() => copyLink(s.id)}
                        aria-label={`Copier le lien vers « ${s.title} »`}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-mute opacity-100 transition-[opacity,color,background-color] hover:bg-white hover:text-green-deep md:opacity-0 md:group-hover/sec:opacity-100 md:focus-visible:opacity-100"
                      >
                        {copied === s.id ? <Check className="size-4 text-green-deep" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
                      </button>
                    </div>
                    <div className="prose-legal mt-4 [&>*:first-child]:!mt-0">{s.body}</div>
                  </motion.section>
                );
              })}
            </div>

            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-ink/70 hover:text-green-deep">
              <ArrowUp className="size-4" aria-hidden /> Revenir en haut
            </a>

            {/* Question card */}
            <div className="relative mt-12 overflow-hidden rounded-[20px] bg-ink p-7 text-white md:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-green/20 blur-3xl" aria-hidden />
              <p className="label-mono relative text-[10px] text-green">Une question ?</p>
              <h3 className="relative mt-2 font-display text-2xl font-semibold">Notre équipe vous répond</h3>
              <p className="relative mt-2 max-w-[52ch] text-white/60">Pour toute question sur ces conditions, vos données ou une commande, contactez-nous directement.</p>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <a
                  href={buildWhatsAppUrl(`Bonjour PBXcom, j'ai une question concernant la page « ${title} ».`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#25D366] px-4 text-sm font-medium text-ink transition-[filter] hover:brightness-105"
                >
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
                <a href={`mailto:${site.email}`} className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/15 px-4 text-sm font-medium text-white transition-colors hover:border-green">
                  <Mail className="size-4" aria-hidden /> {site.email}
                </a>
              </div>
            </div>

            {/* Other legal pages (all screens) */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {others.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex h-full items-center gap-3 rounded-[14px] border border-ink/[0.08] bg-paper p-4 transition-colors hover:border-green-deep/40">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink text-green">
                      <FileText className="size-4" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="flex-1 text-[14px] font-medium text-ink">{l.label}</span>
                    <ArrowUpRight className="size-4 text-mute transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-deep" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}