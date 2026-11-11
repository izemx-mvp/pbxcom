import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, CircleCheck, Copy, Layers, PackageCheck, PhoneCall, Receipt, ShoppingBag, Truck, Users } from "lucide-react";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { formatDate, formatPrice, formatTime } from "@/lib/format";
import { readLastOrder, type SavedOrder } from "@/lib/order";
import { buttonVariants, ButtonContent } from "@/components/site/button";
import { EmptyState } from "@/components/site/primitives";
import { PageBar } from "@/components/site/page-bar";
import { CheckoutSteps } from "@/components/shop/checkout-steps";
import { AnimatedCheck } from "@/components/forms/success-panel";
import { CircuitLines, Glow, GridBackground } from "@/components/site/circuit";
import { EASE } from "@/components/site/motion";

export const Route = createFileRoute("/commande/confirmation")({
  head: () => seo({ title: "Confirmation", description: "Votre demande a bien été préparée.", path: "/commande/confirmation", noindex: true }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [order, setOrder] = useState<SavedOrder | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrder(readLastOrder()), []);

  if (order === undefined) {
    return (
      <section className="surface-dark min-h-[70vh] pt-[calc(var(--header-h)+48px)]">
        <div className="container-site">
          <div className="skeleton mx-auto h-80 max-w-3xl rounded-[18px] opacity-20" />
        </div>
      </section>
    );
  }

  if (order === null) {
    return (
      <>
      <PageBar crumbs={[{ label: "Boutique", href: "/boutique" }, { label: "Confirmation" }]} />
      <section className="bg-paper py-16 md:py-24">
        <div className="container-site max-w-3xl">
          <EmptyState
            icon={Receipt}
            title="Aucune commande récente"
            text="Nous n'avons trouvé aucune commande ou demande de devis récente sur cet appareil. Parcourez la boutique ou contactez-nous directement."
            action={
              <>
                <Link to="/boutique" className={buttonVariants({ variant: "dark", size: "lg" })}>
                  <ButtonContent arrow>Retour à la boutique</ButtonContent>
                </Link>
                <Link to="/contact" className={buttonVariants({ variant: "secondary-light", size: "lg" })}>
                  Nous contacter
                </Link>
              </>
            }
          />
        </div>
      </section>
      </>
    );
  }

  const isQuote = order.kind === "devis";
  const created = new Date(order.createdAt);
  const steps = isQuote
    ? [
        { icon: CircleCheck, title: "Demande reçue", text: "Votre demande de devis a bien été enregistrée par notre équipe." },
        { icon: PhoneCall, title: "Appel d'un conseiller", text: `Un conseiller vous rappelle en ${site.quoteDelay} (heures ouvrées) pour affiner votre besoin.` },
        { icon: Receipt, title: "Devis détaillé", text: "Vous recevez un devis ferme, sans engagement, avec les options d'installation." },
      ]
    : [
        { icon: CircleCheck, title: "Commande reçue", text: "Votre commande a bien été enregistrée par notre équipe." },
        { icon: PhoneCall, title: "Confirmation par téléphone", text: "Nous vous appelons pour confirmer la disponibilité, les frais de livraison et le paiement." },
        { icon: Truck, title: "Préparation et livraison", text: site.delivery.text },
      ];

  return (
    <>
      <section className="surface-dark relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+40px)] md:pb-20">
        <GridBackground className="opacity-60" />
        <CircuitLines variant="wide" className="opacity-40" />
        <Glow className="left-1/2 top-24 size-[520px] -translate-x-1/2" />
        <div className="container-site relative">
          <div className="flex justify-center">
            <CheckoutSteps current={2} />
          </div>
          <div className="mt-12 flex flex-col items-center text-center">
            <AnimatedCheck size={88} />
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="type-h1 mt-8 max-w-2xl text-white"
            >
              {isQuote ? "Merci, votre demande de devis a bien été envoyée" : "Merci, votre commande a bien été envoyée"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
              className="type-lead mt-4 max-w-xl text-white/65"
            >
              Un conseiller PBXcom vous recontacte rapidement pour confirmer les détails. Conservez votre référence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
              className="mt-8 inline-flex flex-col items-center rounded-[14px] border border-white/10 bg-white/[0.04] px-6 py-4"
            >
              <span className="label-mono text-[10px] text-white/45">{isQuote ? "Référence de la demande" : "Référence de commande"}</span>
              <span className="mt-1 flex items-center gap-3">
                <span className="font-mono text-xl font-medium tracking-wider text-green md:text-2xl">{order.ref}</span>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      void navigator.clipboard.writeText(order.ref);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1800);
                    } catch {
                      /* clipboard unavailable */
                    }
                  }}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/[0.06] text-white/70 transition-colors hover:bg-white/10 hover:text-green"
                  aria-label="Copier la référence"
                >
                  {copied ? <Check className="size-4 text-green" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                </button>
              </span>
              <span className="mt-1 text-[12px] text-white/40">
                {formatDate(created)} à {formatTime(created)}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="container-site grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[18px] border border-ink/[0.07] bg-white p-6 md:p-8">
            <div className="flex items-center gap-3">
              <PackageCheck className="size-5 text-green-deep" aria-hidden />
              <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>
            </div>
            <ul className="mt-6 divide-y divide-ink/[0.07]">
              {order.lines.map((l) => (
                <li key={l.sku} className="flex items-start justify-between gap-4 py-3 text-[14px]">
                  <span>
                    <span className="font-medium text-ink">{l.name}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-mute">
                      {l.sku} · Qté {l.qty}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">{l.lineTotal === null ? "Sur devis" : formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-ink/[0.08] pt-4">
              <span className="font-medium">{isQuote ? "Sous-total indicatif" : "Total TTC"}</span>
              <span className="font-display text-2xl font-semibold tabular-nums">{formatPrice(order.subtotal)}</span>
            </div>
            <dl className="mt-6 grid gap-x-6 gap-y-3 rounded-[12px] bg-paper p-5 text-[14px] sm:grid-cols-2">
              {(
                [
                  ["Nom", order.customer.nom],
                  ["Téléphone", order.customer.telephone],
                  ["E-mail", order.customer.email],
                  ["Ville", order.customer.ville],
                  ["Adresse", order.customer.adresse],
                  ["Entreprise", order.customer.entreprise],
                  ["Installation", order.needsInstallation ? "Oui, demandée" : undefined],
                  ["Paiement", isQuote ? undefined : site.payment.methods.find((m) => m.id === order.customer.paiement)?.label],
                ] as Array<[string, string | undefined]>
              )
                .filter(([, v]) => Boolean(v))
                .map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt className="label-mono text-[10px] text-mute">{k}</dt>
                    <dd className="mt-0.5 break-words text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">Et maintenant ?</h2>
            <ol className="relative mt-8 flex flex-col gap-8 pl-2">
              <span className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-green via-green/40 to-ink/10" aria-hidden />
              {steps.map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                  className="relative flex gap-5"
                >
                  <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-green ring-4 ring-paper">
                    <s.icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="label-mono text-[10px] text-green-deep">Étape {i + 1}</p>
                    <h3 className="mt-1 font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-mute">{s.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/boutique" className={buttonVariants({ variant: "dark", size: "lg" })}>
                <ButtonContent arrow>Retour à la boutique</ButtonContent>
              </Link>
              <a href={site.phone.href} className={buttonVariants({ variant: "secondary-light", size: "lg" })}>
                <ButtonContent icon={<PhoneCall className="size-4" aria-hidden />}>{site.phone.display}</ButtonContent>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* While you wait */}
      <section className="bg-white py-16 md:py-20" aria-labelledby="meanwhile-title">
        <div className="container-site">
          <p className="label-mono text-green-deep">En attendant notre appel</p>
          <h2 id="meanwhile-title" className="type-h3 mt-2 text-ink">
            Découvrez ce que nous pouvons faire pour vous
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Layers, title: "Nos solutions", text: "Sécurité, réseau et télécom : 12 services installés par nos équipes.", to: "/solutions" as const },
              { icon: ShoppingBag, title: "La boutique", text: "Caméras, switchs, téléphones IP… livrés partout au Maroc.", to: "/boutique" as const },
              { icon: Users, title: "Qui sommes-nous", text: `Un intégrateur basé à Rabat depuis ${site.foundingYear}.`, to: "/a-propos" as const },
            ].map((c, i) => (
              <motion.li key={c.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}>
                <Link to={c.to} className="group flex h-full flex-col rounded-[18px] border border-ink/[0.07] bg-paper p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_oklch(0.155_0.006_165/0.45)]">
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-green">
                      <c.icon className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <ArrowUpRight className="size-5 text-mute transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-deep" aria-hidden />
                  </div>
                  <p className="mt-5 font-display text-lg font-semibold text-ink">{c.title}</p>
                  <p className="mt-1 text-[14px] text-mute">{c.text}</p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}