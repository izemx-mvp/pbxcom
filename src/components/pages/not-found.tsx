import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { images } from "@/config/images";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { CircuitLines, Glow, GridBackground } from "@/components/site/circuit";
import { Eyebrow } from "@/components/site/primitives";
import { SmartImage } from "@/components/site/smart-image";

const quickLinks = [
  { label: "Nos solutions", to: "/solutions" },
  { label: "La boutique", to: "/boutique" },
  { label: "Demander un devis", to: "/devis" },
  { label: "Nous contacter", to: "/contact" },
] as const;

export function NotFoundPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = q.trim();
    void navigate({ to: "/boutique", search: value ? { q: value } : {} });
  };

  return (
    <section className="surface-dark relative isolate overflow-hidden bg-noise">
      <GridBackground className="-z-10" />
      <CircuitLines className="-z-10" opacity={0.35} />
      <Glow className="-right-40 top-20 -z-10 size-[560px]" />
      <div className="container-site grid min-h-[100svh] items-center gap-12 pb-20 pt-[calc(var(--header-h)+48px)] lg:grid-cols-2">
        <div>
          <Eyebrow>Erreur 404 · Page introuvable</Eyebrow>
          <p aria-hidden className="stroke-text mt-6 font-display text-[clamp(7rem,22vw,14rem)] font-bold leading-[0.85] tracking-[-0.05em] text-green">
            404
          </p>
          <h1 className="type-h2 mt-6 text-white">Cette page s'est débranchée.</h1>
          <p className="type-lead mt-4 max-w-[48ch] text-white/65">
            Le lien est peut-être ancien ou la page a été déplacée. Recherchez un produit ou reprenez depuis l'un des raccourcis ci-dessous.
          </p>
          <form onSubmit={submit} className="mt-8 flex max-w-md gap-2" role="search">
            <label htmlFor="notfound-search" className="sr-only">
              Rechercher un produit
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" aria-hidden />
              <input
                id="notfound-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Caméra, switch, téléphone IP…"
                className="h-12 w-full rounded-[10px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-white placeholder:text-white/35 outline-none focus:border-green"
              />
            </div>
            <button type="submit" className={buttonVariants({ variant: "primary", size: "md" })}>
              Rechercher
            </button>
          </form>
          <ul className="mt-10 grid max-w-md grid-cols-2 gap-2">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex min-h-12 items-center justify-between rounded-[10px] border border-white/10 bg-white/[0.03] px-4 text-sm text-white/80 transition-colors hover:border-green/60 hover:text-white"
                >
                  {l.label}
                  <ArrowRight className="size-4 text-green transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/" className={buttonVariants({ variant: "ghost" }) + " mt-8 text-white/70 hover:text-white"}>
            <ButtonContent arrow>Retour à l'accueil</ButtonContent>
          </Link>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[24px] bg-green/10 blur-3xl" aria-hidden />
          <SmartImage {...images.misc.notFound} priority className="relative rounded-[20px] ring-1 ring-white/10" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
