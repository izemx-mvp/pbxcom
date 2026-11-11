import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, ArrowUpRight, Check, Clock, CreditCard, Mail, MapPin, MessageCircle, Phone, Truck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { images } from "@/config/images";
import { companyNav, legalNav } from "@/config/nav";
import { universes } from "@/data/universes";
import { categories } from "@/data/categories";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { FacebookIcon, InstagramIcon, Logo } from "@/components/site/icons";
import { CircuitDivider, GridBackground } from "@/components/site/circuit";
import { SmartImage } from "@/components/site/smart-image";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    // Stored nowhere: frontend-only MVP
    setState("done");
    setEmail("");
  };

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-graphite p-6 ring-1 ring-white/[0.07] md:p-8">
      <GridBackground className="opacity-40" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_minmax(0,420px)] md:items-center">
        <div>
          <p className="label-mono text-[10px] text-green">Newsletter</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white">Restez connecté</h3>
          <p className="mt-2 max-w-sm text-sm text-white/55">Recevez les dernières tendances pour développer votre entreprise.</p>
        </div>
        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-[12px] bg-green/10 px-4 py-4 text-sm text-green"
              role="status"
            >
              <Check className="size-4" aria-hidden /> Merci ! Votre inscription est bien prise en compte.
            </motion.p>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }}>
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse e-mail
              </label>
              <div className="flex gap-2 rounded-[14px] border border-white/10 bg-ink/60 p-1.5 transition-colors focus-within:border-green">
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="votre@email.ma"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  aria-invalid={state === "error"}
                  aria-describedby={state === "error" ? "newsletter-error" : undefined}
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/35 outline-none"
                />
                <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "h-11")}>
                  <ButtonContent arrow>S'inscrire</ButtonContent>
                </button>
              </div>
              {state === "error" && (
                <p id="newsletter-error" className="mt-2 text-xs text-[#FF8A8A]">
                  Veuillez saisir une adresse e-mail valide.
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Giant wordmark: each letter lights up on hover */
function Wordmark() {
  return (
    <div className="select-none overflow-hidden" aria-hidden>
      <p className="-mb-[0.18em] flex justify-center font-display text-[clamp(5rem,22vw,22rem)] font-bold leading-none tracking-[-0.04em]">
        {"PBXCOM".split("").map((l, i) => (
          <span
            key={i}
            className="stroke-text cursor-default text-white opacity-[0.07] transition-[opacity,color,transform] duration-500 hover:-translate-y-[0.04em] hover:text-green hover:opacity-60"
          >
            {l}
          </span>
        ))}
      </p>
    </div>
  );
}

const linkCls = "group inline-flex items-center gap-1.5 text-white/65 transition-colors hover:text-white";
function Arrow() {
  return <ArrowUpRight className="size-3.5 -translate-x-1 text-green opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />;
}

export function Footer() {
  const perks = [
    { icon: Truck, label: "Livraison partout au Maroc" },
    { icon: Wrench, label: "Installation par nos techniciens" },
    { icon: CreditCard, label: "Paiement à la livraison" },
    { icon: Clock, label: `Devis gratuit en ${site.quoteDelay}` },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-white">
      {/* Top CTA strip */}
      <div className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <SmartImage {...images.misc.ctaBackground} fill className="-z-10 bg-ink" imgClassName="opacity-50" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--ink)_25%,oklch(0.155_0.006_165/0.55))]" />
        <div className="container-wide grid gap-8 py-12 md:py-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Un projet ? <span className="text-green">Parlons-en.</span>
            </p>
            <p className="mt-3 text-white/60">Devis gratuit et sans engagement, réponse en {site.quoteDelay}.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link to="/devis" className="group flex items-center gap-3 rounded-[14px] bg-green p-4 text-ink transition-colors hover:bg-green-bright">
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
              <span>
                <span className="block text-[11px] opacity-70">Gratuit</span>
                <span className="block font-medium">Demander un devis</span>
              </span>
            </Link>
            <a href={buildWhatsAppUrl(defaultWhatsAppMessage)} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-[14px] bg-white/[0.05] p-4 ring-1 ring-white/10 transition-colors hover:ring-green/60">
              <MessageCircle className="size-5 text-green" aria-hidden />
              <span>
                <span className="block text-[11px] text-white/50">Réponse rapide</span>
                <span className="block font-medium">WhatsApp</span>
              </span>
            </a>
            <a href={site.phone.href} className="group flex items-center gap-3 rounded-[14px] bg-white/[0.05] p-4 ring-1 ring-white/10 transition-colors hover:ring-green/60">
              <Phone className="size-5 text-green" aria-hidden />
              <span>
                <span className="block text-[11px] text-white/50">Appelez-nous</span>
                <span className="block font-medium">{site.phone.display}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Perks strip */}
      <div className="border-b border-white/[0.06]">
        <ul className="container-wide grid grid-cols-2 gap-px lg:grid-cols-4">
          {perks.map((p) => (
            <li key={p.label} className="flex items-center gap-3 py-5 text-[13px] text-white/70 md:text-sm">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-graphite text-green ring-1 ring-white/[0.07]">
                <p.icon className="size-4" strokeWidth={1.5} aria-hidden />
              </span>
              {p.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="container-wide relative pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="flex flex-col gap-6">
            <Logo className="h-9" />
            <p className="font-display text-lg leading-snug text-white/85">« {site.slogan} »</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Depuis {site.foundingYear}, PBXcom installe des systèmes de sécurité et intègre des solutions informatiques et télécoms pour les entreprises, collectivités et
              particuliers.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 hover:text-white"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                  <span>
                    {site.address.full}
                    <span className="mt-0.5 block text-[12px] text-green opacity-0 transition-opacity group-hover:opacity-100">Voir sur la carte →</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={site.phone.href} className="flex gap-3 hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                {site.hours}
              </li>
            </ul>
            <div className="flex gap-3">
              <a href={site.socials.facebook.url} target="_blank" rel="noopener noreferrer" aria-label={`Facebook — ${site.socials.facebook.handle}`} className={buttonVariants({ variant: "icon", size: "icon" })}>
                <FacebookIcon className="size-5" />
              </a>
              <a href={site.socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram — ${site.socials.instagram.handle}`} className={buttonVariants({ variant: "icon", size: "icon" })}>
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <h3 className="label-mono text-green">Solutions</h3>
              <ul className="mt-5 flex flex-col gap-3 text-sm">
                <li>
                  <Link to="/solutions" className={linkCls}>
                    Toutes les solutions <Arrow />
                  </Link>
                </li>
                {universes.map((u) => (
                  <li key={u.id}>
                    <Link to="/solutions/$universe" params={{ universe: u.id }} className={linkCls}>
                      <u.icon className="size-3.5 text-white/35 transition-colors group-hover:text-green" strokeWidth={1.75} aria-hidden />
                      {u.name} <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label-mono text-green">Boutique</h3>
              <ul className="mt-5 flex flex-col gap-3 text-sm">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link to="/boutique/$category" params={{ category: c.slug }} className={linkCls}>
                      {c.name} <Arrow />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/boutique" className={cn(linkCls, "text-green/80")}>
                    Tout le catalogue <Arrow />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="label-mono text-green">Entreprise</h3>
              <ul className="mt-5 flex flex-col gap-3 text-sm">
                {companyNav.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkCls}>
                      {l.label} <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label-mono text-green">Informations</h3>
              <ul className="mt-5 flex flex-col gap-3 text-sm">
                {legalNav.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkCls}>
                      {l.label} <Arrow />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/panier" className={linkCls}>
                    Mon panier <Arrow />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Newsletter />
        </div>
      </div>

      <Wordmark />
      <CircuitDivider tone="dark" />
      <div className="container-wide flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
        <p>© {new Date().getFullYear()} PBXCOM — Tous droits réservés</p>
        <p className="label-mono text-[10px]">
          {site.tagline} · Depuis {site.foundingYear}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-white/60 transition-colors hover:border-green hover:text-white"
        >
          Haut de page
          <ArrowUp className="size-3.5 text-green transition-transform group-hover:-translate-y-0.5" aria-hidden />
        </button>
      </div>
    </footer>
  );
}