import { useRef, type ReactNode, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { images } from "@/config/images";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { AppLink } from "./app-link";
import { buttonVariants, ButtonContent } from "./button";
import { CircuitLines, CircuitPattern, Glow, GridBackground } from "./circuit";
import { Eyebrow, Highlight } from "./primitives";
import { SmartImage } from "./smart-image";
import type { ImageAsset } from "@/config/images";
import { EASE } from "./motion";

/* ───────────────────────── Marquee */
export function Marquee({ children, duration = 40, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={cn("group relative flex overflow-hidden mask-fade-x", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1 || undefined}
          className="flex shrink-0 animate-marquee items-center gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Tabs (animated underline / pill) */
export function SiteTabs<T extends string>({
  tabs,
  value,
  onChange,
  tone = "light",
  layoutId,
  className,
  variant = "pill",
  label,
}: {
  tabs: Array<{ value: T; label: string; count?: number }>;
  value: T;
  onChange: (v: T) => void;
  tone?: "light" | "dark";
  layoutId: string;
  className?: string;
  variant?: "pill" | "underline";
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "no-scrollbar flex max-w-full gap-1 overflow-x-auto",
        variant === "pill" && (tone === "dark" ? "rounded-full bg-white/[0.05] p-1 hairline-dark" : "rounded-full border border-ink/10 bg-white p-1"),
        variant === "underline" && (tone === "dark" ? "border-b border-white/10" : "border-b border-ink/10"),
        className,
      )}
      onKeyDown={(e) => {
        const idx = tabs.findIndex((t) => t.value === value);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const next = tabs[(idx + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
          if (next) onChange(next.value);
          const el = e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[tabs.indexOf(next!)];
          el?.focus();
        }
      }}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative min-h-11 shrink-0 cursor-pointer whitespace-nowrap px-4 text-sm font-medium transition-colors",
              variant === "pill" && "rounded-full",
              variant === "underline" && "pb-3 pt-2",
              tone === "dark"
                ? active
                  ? variant === "pill"
                    ? "text-ink"
                    : "text-white"
                  : "text-white/60 hover:text-white"
                : active
                  ? variant === "pill"
                    ? "text-white"
                    : "text-ink"
                  : "text-mute hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className={cn(
                  "absolute",
                  variant === "pill" ? cn("inset-0 rounded-full", tone === "dark" ? "bg-green" : "bg-ink") : "inset-x-0 -bottom-px h-0.5 bg-green",
                )}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && <span className="label-mono text-[10px] opacity-60">{tab.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Breadcrumbs */
export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const all: Crumb[] = [{ label: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol className={cn("label-mono flex flex-wrap items-center gap-1.5 text-[11px]", tone === "dark" ? "text-white/50" : "text-mute")}>
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <AppLink href={c.href} className={cn("transition-colors", tone === "dark" ? "hover:text-green" : "hover:text-green-deep")}>
                  {c.label}
                </AppLink>
              ) : (
                <span aria-current={last ? "page" : undefined} className={tone === "dark" ? "text-white/85" : "text-ink"}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3 opacity-50" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ───────────────────────── Page hero */
export function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  crumbs,
  image,
  children,
  compact,
  aside,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: ReactNode;
  crumbs: Crumb[];
  image?: ImageAsset;
  children?: ReactNode;
  compact?: boolean;
  aside?: ReactNode;
}) {
  return (
    <section className="surface-dark relative isolate overflow-hidden bg-noise">
      {image && (
        <div className="absolute inset-0 -z-10">
          <SmartImage {...image} fill priority className="bg-ink" imgClassName="opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_15%,oklch(0.155_0.006_165/0.75)_55%,oklch(0.155_0.006_165/0.35))]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        </div>
      )}
      <GridBackground className="-z-10" />
      <CircuitLines variant="corner" className="-z-10" opacity={0.45} />
      <Glow className="-left-40 top-10 -z-10 size-[520px]" />
      <div
        className={cn(
          "container-site relative",
          compact ? "pb-14 pt-[calc(var(--header-h)+56px)] md:pb-16" : "pb-20 pt-[calc(var(--header-h)+72px)] md:pb-28 md:pt-[calc(var(--header-h)+96px)]",
        )}
      >
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-8 grid gap-10", aside && "lg:grid-cols-[1fr_auto] lg:items-end")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="max-w-3xl"
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="type-h1 mt-5 text-white">
              <Highlight title={title} highlight={highlight} />
            </h1>
            {subtitle && <p className="type-lead mt-6 max-w-[60ch] text-white/65">{subtitle}</p>}
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
          {aside}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA band (cta-background) */
export function CTABand({
  title = "Un projet ? Parlons-en.",
  text = "Décrivez votre besoin en quelques clics : un conseiller vous rappelle et votre devis gratuit arrive en moins de 4h.",
  tone = "dark",
}: {
  title?: string;
  text?: string;
  tone?: "dark" | "green";
}) {
  if (tone === "green") {
    return (
      <section className="relative isolate overflow-hidden bg-green text-ink">
        <CircuitPattern opacity={0.1} />
        <div className="container-site relative flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <h2 className="type-h2">{title}</h2>
            <p className="mt-4 max-w-[56ch] text-lg text-ink/75">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/devis" className={buttonVariants({ variant: "dark", size: "lg" })}>
              <ButtonContent arrow>Devis gratuit</ButtonContent>
            </Link>
            <a
              href={buildWhatsAppUrl(defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "secondary-light", size: "lg" }), "border-ink/20 bg-transparent hover:bg-white/30")}
            >
              <ButtonContent icon={<MessageCircle className="size-4" aria-hidden />}>WhatsApp</ButtonContent>
            </a>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <SmartImage {...images.misc.ctaBackground} fill className="-z-10 bg-ink" imgClassName="opacity-60" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--ink)_20%,oklch(0.155_0.006_165/0.6))]" />
      <div className="container-site flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <div className="max-w-2xl">
          <Eyebrow>Devis gratuit · Sans engagement</Eyebrow>
          <h2 className="type-h2 mt-4">{title}</h2>
          <p className="mt-4 max-w-[56ch] text-lg text-white/65">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/devis" className={buttonVariants({ variant: "primary", size: "lg" })}>
            <ButtonContent arrow>Demander un devis</ButtonContent>
          </Link>
          <a
            href={buildWhatsAppUrl(defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            <ButtonContent icon={<MessageCircle className="size-4" aria-hidden />}>WhatsApp</ButtonContent>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Spotlight card — cursor-following glow + gradient border */
export function SpotlightCard({ children, className, tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-[14px] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1",
        tone === "dark" ? "bg-graphite" : "bg-white shadow-[0_1px_2px_oklch(0.155_0.006_165/0.05)]",
        className,
      )}
    >
      {/* gradient border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[14px] p-px opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), var(--green), transparent 60%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[14px]",
          tone === "dark" ? "shadow-[inset_0_0_0_1px_oklch(1_0_0/0.07)]" : "shadow-[inset_0_0_0_1px_oklch(0.155_0.006_165/0.08)]",
        )}
      />
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), oklch(0.775 0.215 133 / 0.14), transparent 55%)" }}
      />
      {children}
    </div>
  );
}

/** Hover underline that "draws" a circuit along the bottom of a card. */
export function CardCircuit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 8" preserveAspectRatio="none" aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-2 w-full", className)}>
      <path
        d="M0 6 H120 L126 2 H174 L180 6 H300"
        fill="none"
        stroke="var(--green)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[stroke-dashoffset:0] group-hover/spot:[stroke-dashoffset:0]"
      />
    </svg>
  );
}
