import { useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banknote, Building2, Check, Clock, FileText, Landmark, Lock, MessageCircle, ShieldCheck, ShoppingBag, Truck, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildOrderMessage, cartLinesForOrder, generateOrderRef, saveLastOrder, type SavedOrder } from "@/lib/order";
import { Button, buttonVariants, ButtonContent } from "@/components/site/button";
import { PageBar } from "@/components/site/page-bar";
import { EmptyState } from "@/components/site/primitives";
import { ProductImage } from "@/components/site/product-card";
import { CheckoutSteps } from "@/components/shop/checkout-steps";
import { TextAreaField, TextField, phoneError, phoneRegex } from "@/components/forms/fields";
import { CityCombobox } from "@/components/forms/city-combobox";

type CommandeSearch = { mode?: "devis" };

export const Route = createFileRoute("/commande/")({
  validateSearch: (search: Record<string, unknown>): CommandeSearch => (search["mode"] === "devis" ? { mode: "devis" } : {}),
  head: () => seo({ title: "Finaliser ma commande", description: "Renseignez vos coordonnées pour finaliser votre commande PBXcom.", path: "/commande", noindex: true }),
  component: CheckoutPage,
});

const schema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom complet."),
  telephone: z.string().trim().regex(phoneRegex, phoneError),
  email: z.string().trim().email("Indiquez une adresse e-mail valide."),
  entreprise: z.string().trim().max(120).optional(),
  ice: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{15}$/.test(v), "L'ICE comporte 15 chiffres.")
    .optional(),
  ville: z.string().trim().min(2, "Indiquez votre ville."),
  adresse: z.string().trim().min(6, "Indiquez votre adresse de livraison."),
  paiement: z.enum(["livraison", "virement"]),
  notes: z.string().trim().max(800).optional(),
});
type Values = z.infer<typeof schema>;

function Card({ icon: Icon, title, children, step }: { icon: typeof User; title: string; children: ReactNode; step: string }) {
  return (
    <fieldset className="group/field relative overflow-hidden rounded-[18px] border border-ink/[0.07] bg-white p-6 transition-shadow duration-300 focus-within:shadow-[0_24px_50px_-36px_oklch(0.155_0.006_165/0.5)] md:p-8">
      <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-green transition-transform duration-500 group-focus-within/field:scale-y-100" aria-hidden />
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-green">
          <Icon className="size-5" strokeWidth={1.5} aria-hidden />
        </span>
        <div>
          <p className="label-mono text-[10px] text-mute">Étape {step}</p>
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        </div>
      </div>
      {children}
    </fieldset>
  );
}

function CheckoutPage() {
  const { mode } = Route.useSearch();
  const { items, subtotal, count, isQuote: cartIsQuote, needsInstallation, setNeedsInstallation, clear, hydrated } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isQuote = cartIsQuote || mode === "devis";

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { paiement: "livraison", ville: "" } });
  const paiement = watch("paiement");

  const onSubmit = (v: Values) => {
    setLoading(true);
    const base: Omit<SavedOrder, "whatsappMessage"> = {
      ref: generateOrderRef(isQuote ? "DEV" : "PBX"),
      kind: isQuote ? "devis" : "commande",
      createdAt: new Date().toISOString(),
      customer: {
        nom: v.nom,
        telephone: v.telephone,
        email: v.email,
        ville: v.ville,
        adresse: v.adresse,
        paiement: v.paiement,
        ...(v.entreprise ? { entreprise: v.entreprise } : {}),
        ...(v.ice ? { ice: v.ice } : {}),
        ...(v.notes ? { notes: v.notes } : {}),
      },
      lines: cartLinesForOrder(items),
      subtotal,
      needsInstallation,
    };
    const message = buildOrderMessage(base);
    saveLastOrder({ ...base, whatsappMessage: message });
    // Frontend-only MVP: the order is not transmitted anywhere yet (to be wired to e-mail / CRM / backend).
    window.setTimeout(() => {
      clear();
      void navigate({ to: "/commande/confirmation" });
    }, 600);
  };

  return (
    <>
      <PageBar crumbs={[{ label: "Panier", href: "/panier" }, { label: isQuote ? "Demande de devis" : "Commande" }]}>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h1 className="type-h1 text-white">{isQuote ? "Demande de devis" : "Finaliser ma commande"}</h1>
          <CheckoutSteps current={1} />
        </div>
      </PageBar>
      <section className="bg-paper pb-24 pt-10 md:pt-14">
        <div className="container-wide">
          {!hydrated ? (
            <div className="skeleton h-96 rounded-[18px]" />
          ) : items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Aucun article à commander"
              text="Votre panier est vide. Ajoutez des produits depuis la boutique ou faites une demande de devis personnalisée."
              action={
                <>
                  <Link to="/boutique" className={buttonVariants({ variant: "dark", size: "lg" })}>
                    <ButtonContent arrow>Aller à la boutique</ButtonContent>
                  </Link>
                  <Link to="/devis" className={buttonVariants({ variant: "secondary-light", size: "lg" })}>
                    Demande de devis
                  </Link>
                </>
              }
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-10 lg:grid-cols-[1fr_420px]">
              <div className="flex flex-col gap-6">
                {isQuote && (
                  <p className="flex gap-3 rounded-[14px] border border-green-deep/25 bg-green/[0.07] p-4 text-[14px] text-ink/85">
                    <FileText className="mt-0.5 size-5 shrink-0 text-green-deep" aria-hidden />
                    {cartIsQuote
                      ? "Certains articles sont proposés sur devis : votre panier est transmis comme une demande de devis. Un conseiller vous rappelle en moins de 4h avec un prix ferme."
                      : "Votre panier sera transmis comme une demande de devis. Un conseiller vous rappelle en moins de 4h avec une proposition adaptée."}
                  </p>
                )}
                <Card icon={User} title="Vos coordonnées" step="1">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Nom complet" autoComplete="name" {...register("nom")} error={errors.nom?.message} className="sm:col-span-2" />
                    <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" {...register("telephone")} error={errors.telephone?.message} />
                    <TextField label="E-mail" type="email" inputMode="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
                  </div>
                </Card>
                <Card icon={Building2} title="Entreprise" step="2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Raison sociale" optional autoComplete="organization" {...register("entreprise")} error={errors.entreprise?.message} />
                    <TextField label="ICE" optional inputMode="numeric" hint="Identifiant commun de l'entreprise (15 chiffres)" {...register("ice")} error={errors.ice?.message} />
                  </div>
                </Card>
                <Card icon={Truck} title="Livraison" step="3">
                  <div className="grid gap-4">
                    <Controller
                      control={control}
                      name="ville"
                      render={({ field }) => <CityCombobox ref={field.ref} name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.ville?.message} />}
                    />
                    <TextField label="Adresse (rue, quartier, immeuble)" autoComplete="street-address" {...register("adresse")} error={errors.adresse?.message} />
                    <TextAreaField label="Remarques pour la livraison" optional rows={3} {...register("notes")} error={errors.notes?.message} />
                    <label className="flex cursor-pointer gap-3 rounded-[12px] bg-paper p-4">
                      <input type="checkbox" checked={needsInstallation} onChange={(e) => setNeedsInstallation(e.target.checked)} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--green-deep)]" />
                      <span>
                        <span className="flex items-center gap-2 font-medium text-ink">
                          <Wrench className="size-4 text-green-deep" aria-hidden /> J'ai besoin de l'installation
                        </span>
                        <span className="mt-1 block text-[13px] text-mute">Nos techniciens posent et mettent en service votre matériel.</span>
                      </span>
                    </label>
                  </div>
                </Card>
                {!isQuote && (
                  <Card icon={Banknote} title="Paiement" step="4">
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Mode de paiement">
                      {site.payment.methods.map((m) => {
                        const on = paiement === m.id;
                        const Icon = m.id === "livraison" ? Banknote : Landmark;
                        return (
                          <label
                            key={m.id}
                            className={cn(
                              "relative flex cursor-pointer flex-col gap-2 rounded-[14px] border-2 p-5 transition-colors",
                              on ? "border-green-deep bg-green/[0.05]" : "border-ink/10 hover:border-ink/25",
                            )}
                          >
                            <input type="radio" value={m.id} {...register("paiement")} className="peer sr-only" />
                            <span className="flex items-center justify-between">
                              <Icon className="size-6 text-green-deep" strokeWidth={1.5} aria-hidden />
                              <span className={cn("flex size-5 items-center justify-center rounded-full border-2", on ? "border-green-deep bg-green-deep" : "border-ink/25")} aria-hidden>
                                {on && <Check className="size-3 text-white" strokeWidth={3} />}
                              </span>
                            </span>
                            <span className="font-medium text-ink">{m.label}</span>
                            <span className="text-[13px] text-mute">{m.text}</span>
                            <span className="pointer-events-none absolute inset-0 rounded-[12px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green" />
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-[13px] text-mute">Aucun paiement n'est demandé en ligne : le règlement intervient après confirmation de votre commande.</p>
                  </Card>
                )}
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Récapitulatif de la commande">
                <div className="rounded-[18px] border border-ink/[0.07] bg-white p-6 shadow-[0_30px_70px_-45px_oklch(0.155_0.006_165/0.5)]">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>
                    <Link to="/panier" className="text-sm font-medium text-green-deep hover:underline">
                      Modifier
                    </Link>
                  </div>
                  <ul className="mt-5 flex max-h-72 flex-col gap-4 overflow-y-auto pr-1">
                    {items.map((i) => (
                      <li key={i.slug} className="flex gap-3">
                        <div className="relative w-14 shrink-0 overflow-hidden rounded-lg border border-ink/[0.07]">
                          <ProductImage product={i.product} sizes="56px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-[14px] font-medium leading-snug">{i.product.name}</p>
                          <p className="font-mono text-[11px] text-mute">Qté {i.qty}</p>
                        </div>
                        <p className="shrink-0 text-[14px] font-medium tabular-nums">{i.lineTotal === null ? "Sur devis" : formatPrice(i.lineTotal)}</p>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-5 flex flex-col gap-2 border-t border-ink/[0.08] pt-5 text-[14px]">
                    <div className="flex justify-between">
                      <dt className="text-mute">
                        Sous-total ({count} article{count > 1 ? "s" : ""})
                      </dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-mute">Livraison</dt>
                      <dd className="text-right text-ink/75">{site.delivery.note}</dd>
                    </div>
                    {needsInstallation && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">Installation</dt>
                        <dd className="text-right text-green-deep">Sur devis</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-4 flex items-baseline justify-between border-t border-ink/[0.08] pt-4">
                    <span className="font-medium">Total TTC</span>
                    <span className="font-display text-2xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <Button type="submit" size="lg" arrow loading={loading} className="mt-6 w-full">
                    {loading ? "Préparation…" : isQuote ? "Envoyer ma demande de devis" : "Confirmer ma commande"}
                  </Button>
                  <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-mute">
                    <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    Aucun paiement n'est demandé en ligne. Vos données servent uniquement au traitement de votre demande (loi 09-08).
                  </p>
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: ShieldCheck, label: "Aucun paiement en ligne" },
                    { icon: Clock, label: "Confirmation rapide" },
                    { icon: Truck, label: "Livraison au Maroc" },
                  ].map((t) => (
                    <li key={t.label} className="flex flex-col items-center gap-2 rounded-[12px] bg-white p-3 text-center text-[11px] leading-tight text-ink/75 ring-1 ring-ink/[0.06]">
                      <t.icon className="size-4 text-green-deep" strokeWidth={1.5} aria-hidden />
                      {t.label}
                    </li>
                  ))}
                </ul>
                <a
                  href={buildWhatsAppUrl("Bonjour PBXcom, j'ai besoin d'aide pour finaliser ma commande.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-3 rounded-[14px] bg-ink p-4 text-white transition-colors hover:bg-graphite"
                >
                  <MessageCircle className="size-5 text-green" aria-hidden />
                  <span className="text-[13px]">Besoin d'aide ? <span className="font-medium text-green">Écrivez-nous</span></span>
                </a>
              </aside>
            </form>
          )}
        </div>
      </section>
    </>
  );
}