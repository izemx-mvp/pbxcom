import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Check, Clock, Mail, MapPin, PhoneCall, Puzzle, Send, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { sectors } from "@/data/sectors";
import { universes } from "@/data/universes";
import { services, getService } from "@/data/services";
import { Button } from "@/components/site/button";
import { Breadcrumbs } from "@/components/site/blocks";
import { CircuitLines, Glow } from "@/components/site/circuit";
import { EASE } from "@/components/site/motion";
import { SelectField, TextAreaField, TextField, phoneError, phoneRegex } from "@/components/forms/fields";
import { CityCombobox } from "@/components/forms/city-combobox";
import { FormSuccess } from "@/components/forms/form-success";

export type DevisSearch = { service?: string; secteur?: string; besoin?: string };

const str = (v: unknown) => (typeof v === "string" && /^[a-z-]{2,40}$/.test(v) ? v : undefined);

export const Route = createFileRoute("/devis")({
  validateSearch: (search: Record<string, unknown>): DevisSearch => {
    const out: DevisSearch = {};
    const service = str(search["service"]);
    const secteur = str(search["secteur"]);
    const besoin = str(search["besoin"]);
    if (service) out.service = service;
    if (secteur) out.secteur = secteur;
    if (besoin) out.besoin = besoin;
    return out;
  },
  head: () =>
    seo({
      title: "Demande de devis gratuit",
      description: "Décrivez votre projet de sécurité, réseau ou télécom et recevez un devis gratuit et sans engagement en moins de 4h.",
      path: "/devis",
      breadcrumbs: [{ name: "Devis", path: "/devis" }],
    }),
  component: DevisPage,
});

const schema = z.object({
  secteur: z.string().min(1, "Choisissez un secteur."),
  besoins: z.array(z.string()).min(1, "Choisissez au moins un besoin."),
  services: z.array(z.string()),
  description: z.string().trim().min(10, "Décrivez votre projet en quelques mots (10 caractères minimum)."),
  taille: z.string().trim().max(80).optional(),
  delai: z.string().min(1, "Indiquez le délai souhaité."),
  nom: z.string().trim().min(2, "Indiquez votre nom complet."),
  entreprise: z.string().trim().max(120).optional(),
  telephone: z.string().trim().regex(phoneRegex, phoneError),
  email: z.union([z.literal(""), z.string().trim().email("Indiquez une adresse e-mail valide.")]),
  ville: z.string().trim().min(2, "Indiquez votre ville."),
});
type Values = z.infer<typeof schema>;

const delais = ["Dès que possible", "Sous 1 mois", "Sous 3 mois", "Pas encore défini"];

const stepDefs: Array<{ title: string; label: string; fields: Array<keyof Values> }> = [
  { title: "Dans quel secteur se situe votre projet ?", label: "Secteur", fields: ["secteur"] },
  { title: "De quoi avez-vous besoin ?", label: "Besoins", fields: ["besoins", "services"] },
  { title: "Parlez-nous de votre projet", label: "Projet", fields: ["description", "taille", "delai"] },
  { title: "Comment vous recontacter ?", label: "Coordonnées", fields: ["nom", "entreprise", "telephone", "email", "ville"] },
  { title: "Vérifiez votre demande", label: "Récapitulatif", fields: [] },
];

const besoinChoices: Array<{ id: string; name: string; icon: LucideIcon }> = [
  ...universes.map((u) => ({ id: u.id, name: u.name, icon: u.icon })),
  { id: "autre", name: "Autre besoin", icon: Puzzle },
];

function OptionCard({ selected, onClick, icon: Icon, title, text, multi }: { selected: boolean; onClick: () => void; icon: LucideIcon; title: string; text?: string; multi?: boolean }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "group relative flex min-h-[96px] cursor-pointer flex-col items-start gap-3 rounded-[14px] border-2 p-4 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98]",
        selected ? "border-green-deep bg-green/[0.06]" : "border-ink/10 bg-white hover:border-ink/25",
      )}
    >
      <span className={cn("flex size-10 items-center justify-center rounded-xl transition-colors", selected ? "bg-ink text-green" : "bg-paper text-ink group-hover:bg-ink group-hover:text-green")}>
        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
      </span>
      <span>
        <span className="block font-medium text-ink">{title}</span>
        {text && <span className="mt-0.5 block text-[13px] text-mute">{text}</span>}
      </span>
      <span
        className={cn("absolute right-3 top-3 flex size-5 items-center justify-center border-2 transition-colors", multi ? "rounded-md" : "rounded-full", selected ? "border-green-deep bg-green-deep" : "border-ink/20")}
        aria-hidden
      >
        {selected && <Check className="size-3 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

function DevisPage() {
  const search = Route.useSearch();
  const reduce = useReducedMotion();
  const preset = useMemo(() => {
    const service = search["service"] ? getService(search["service"]) : undefined;
    const secteur = sectors.find((s) => s.slug === search["secteur"])?.slug ?? "";
    const besoinParam = search["besoin"];
    const besoins = service ? [service.universe] : besoinParam && besoinChoices.some((b) => b.id === besoinParam) ? [besoinParam] : [];
    return { secteur, besoins, services: service ? [service.slug] : [] };
  }, [search]);

  const [step, setStep] = useState(preset.secteur ? (preset.besoins.length ? 2 : 1) : 0);
  const [dir, setDir] = useState(1);
  const [sent, setSent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    trigger,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { secteur: preset.secteur, besoins: preset.besoins, services: preset.services, description: "", delai: "", nom: "", telephone: "", email: "", ville: "" },
  });
  const v = watch();

  const go = async (to: number) => {
    if (to > step) {
      const ok = await trigger(stepDefs[step]!.fields);
      if (!ok) return;
    }
    setDir(to > step ? 1 : -1);
    setStep(to);
    if (typeof window !== "undefined") document.getElementById("devis-card")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const toggle = (name: "besoins" | "services", id: string) => {
    const cur = getValues(name);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    setValue(name, next, { shouldValidate: name === "besoins" });
    if (name === "besoins" && !next.includes(id)) {
      setValue(
        "services",
        getValues("services").filter((s) => getService(s)?.universe !== id),
      );
    }
  };

  const sectorName = sectors.find((s) => s.slug === v.secteur)?.name ?? "";
  const besoinNames = v.besoins.map((b) => besoinChoices.find((c) => c.id === b)?.name ?? b);
  const serviceNames = v.services.map((s) => getService(s)?.name ?? s);

  const onSubmit = (x: Values) => {
    setLoading(true);
    // Frontend-only MVP: the request is not transmitted anywhere yet (to be wired to e-mail / CRM / backend).
    window.setTimeout(() => {
      setLoading(false);
      setSent(x.nom);
      if (typeof window !== "undefined") document.getElementById("devis-card")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 700);
  };

  const progress = (step / (stepDefs.length - 1)) * 100;
  const visibleServices = services.filter((s) => v.besoins.includes(s.universe));

  return (
    <section className="relative bg-paper pb-20 lg:pb-28">
      <div className="absolute inset-x-0 top-0 h-[var(--header-h)] bg-ink" aria-hidden />
      <div className="relative grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* Left: sticky ink panel */}
        <aside className="surface-dark relative overflow-hidden px-4 pb-12 pt-[calc(var(--header-h)+32px)] sm:px-8 lg:min-h-screen lg:px-12 xl:px-16">
          <CircuitLines variant="corner" className="opacity-60" />
          <Glow className="-bottom-40 -left-40 size-[480px]" />
          <div className="relative lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <Breadcrumbs items={[{ label: "Devis gratuit" }]} />
            <h1 className="type-h1 mt-8 text-white">
              Votre devis en <span className="text-green">{site.quoteDelay}</span>
            </h1>
            <p className="type-lead mt-5 max-w-md text-white/60">
              Gratuit et sans engagement. Décrivez votre besoin en quelques étapes : un conseiller vous rappelle pour affiner la solution et vous adresse un devis détaillé.
            </p>
            <ol className="mt-10 flex flex-col gap-6">
              {[
                { t: "Vous décrivez votre projet", d: "Secteur, besoins et contraintes en 2 minutes." },
                { t: "Un conseiller vous rappelle", d: `En ${site.quoteDelay}, aux heures ouvrées.` },
                { t: "Vous recevez votre devis", d: "Étude, matériel, installation et maintenance." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-green/40 font-mono text-[13px] text-green">0{i + 1}</span>
                  <div>
                    <p className="font-medium text-white">{s.t}</p>
                    <p className="mt-0.5 text-[14px] text-white/50">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* Live summary of the request */}
            {!sent && (
              <div className="mt-10 overflow-hidden rounded-[16px] bg-graphite ring-1 ring-white/10">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
                  <span className="label-mono flex items-center gap-2 text-[10px] text-green">
                    <Sparkles className="size-3.5" aria-hidden /> Votre demande
                  </span>
                  <span className="font-mono text-[11px] text-white/45">{Math.round(progress)}%</span>
                </div>
                <dl className="flex flex-col gap-3 p-5 text-[13px]">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-white/45">Secteur</dt>
                    <dd className={cn("text-right", sectorName ? "text-white" : "text-white/25")}>{sectorName || "—"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-white/45">Besoins</dt>
                    <dd className="flex flex-wrap justify-end gap-1.5">
                      {besoinNames.length ? (
                        <AnimatePresence initial={false}>
                          {besoinNames.map((b) => (
                            <motion.span key={b} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="rounded-full bg-green/15 px-2 py-0.5 text-[12px] text-green">
                              {b}
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <span className="text-white/25">—</span>
                      )}
                    </dd>
                  </div>
                  {serviceNames.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-white/45">Prestations</dt>
                      <dd className="text-right text-white/80">{serviceNames.join(", ")}</dd>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-white/45">Délai</dt>
                    <dd className={cn("text-right", v.delai ? "text-white" : "text-white/25")}>{v.delai || "—"}</dd>
                  </div>
                </dl>
                <div className="h-1 bg-white/[0.06]">
                  <motion.div className="h-full bg-green" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: EASE }} />
                </div>
              </div>
            )}
            <p className="mt-5 flex items-center gap-2 text-[13px] text-white/50">
              <ShieldCheck className="size-4 text-green" aria-hidden /> Gratuit, sans engagement, réponse en moins de 4h.
            </p>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 text-[14px]">
              <a href={site.phone.href} className="flex items-center gap-3 text-white/75 transition-colors hover:text-green">
                <PhoneCall className="size-4 text-green" aria-hidden /> {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/75 transition-colors hover:text-green">
                <Mail className="size-4 text-green" aria-hidden /> {site.email}
              </a>
              <p className="flex items-center gap-3 text-white/55">
                <MapPin className="size-4 text-green" aria-hidden /> {site.address.district}, {site.address.city}
              </p>
              <p className="flex items-center gap-3 text-white/55">
                <Clock className="size-4 text-green" aria-hidden /> {site.hours}
              </p>
            </div>
          </div>
        </aside>

        {/* Right: multi-step card */}
        <div className="px-4 pt-10 sm:px-8 lg:px-12 lg:pt-[calc(var(--header-h)+32px)] xl:px-16">
          <div id="devis-card" className="mx-auto max-w-2xl scroll-mt-28 rounded-[20px] border border-ink/[0.07] bg-white p-5 shadow-[0_40px_90px_-60px_oklch(0.155_0.006_165/0.55)] sm:p-8 md:p-10">
            {sent ? (
              <FormSuccess
                title={`Merci ${sent} !`}
                text={`Votre demande de devis a bien été envoyée. Un conseiller PBXcom vous rappelle en ${site.quoteDelay} (heures ouvrées) pour affiner votre besoin.`}
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Circuit progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <p className="label-mono text-[10px] text-mute">
                      Étape {step + 1} / {stepDefs.length} · {stepDefs[step]!.label}
                    </p>
                    <p className="font-mono text-[11px] text-green-deep">{Math.round(progress)}%</p>
                  </div>
                  <div className="relative mt-3 h-6" aria-hidden>
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/10" />
                    <motion.div className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-green-deep" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: EASE }} />
                    {stepDefs.map((s, i) => (
                      <span
                        key={s.label}
                        className={cn(
                          "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300",
                          i <= step ? "border-green-deep bg-green" : "border-ink/15 bg-white",
                        )}
                        style={{ left: `${(i / (stepDefs.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait" initial={false} custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <h2 className="type-h3 text-ink">{stepDefs[step]!.title}</h2>

                      {step === 0 && (
                        <div className="mt-6">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Secteur">
                            {sectors.map((s) => (
                              <OptionCard
                                key={s.slug}
                                icon={s.icon}
                                title={s.name}
                                text={s.short}
                                selected={v.secteur === s.slug}
                                onClick={() => {
                                  setValue("secteur", s.slug, { shouldValidate: true });
                                }}
                              />
                            ))}
                          </div>
                          {errors.secteur && <p className="mt-3 text-[13px] text-[#E5484D]" role="alert">{errors.secteur.message}</p>}
                        </div>
                      )}

                      {step === 1 && (
                        <div className="mt-6">
                          <p className="text-[14px] text-mute">Plusieurs choix possibles.</p>
                          <div className="mt-4 grid grid-cols-2 gap-3" role="group" aria-label="Besoins">
                            {besoinChoices.map((b) => (
                              <OptionCard key={b.id} multi icon={b.icon} title={b.name} selected={v.besoins.includes(b.id)} onClick={() => toggle("besoins", b.id)} />
                            ))}
                          </div>
                          {errors.besoins && <p className="mt-3 text-[13px] text-[#E5484D]" role="alert">{errors.besoins.message}</p>}
                          <AnimatePresence initial={false}>
                            {visibleServices.length > 0 && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <p className="mt-8 font-medium text-ink">
                                  Précisez les prestations <span className="font-normal text-mute">(optionnel)</span>
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Prestations">
                                  {visibleServices.map((s) => {
                                    const on = v.services.includes(s.slug);
                                    return (
                                      <button
                                        key={s.slug}
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => toggle("services", s.slug)}
                                        className={cn(
                                          "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[14px] transition-colors",
                                          on ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink hover:border-ink/30",
                                        )}
                                      >
                                        {on && <Check className="size-3.5 text-green" strokeWidth={3} aria-hidden />}
                                        {s.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="mt-6 grid gap-4">
                          <TextAreaField
                            label="Description du projet"
                            rows={5}
                            hint="Ex. : 12 caméras pour un entrepôt de 2 000 m², enregistrement 30 jours, accès à distance."
                            {...register("description")}
                            error={errors.description?.message}
                          />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <TextField label="Nombre de sites / surface" optional {...register("taille")} error={errors.taille?.message} />
                            <SelectField label="Délai souhaité" options={delais.map((d) => ({ value: d, label: d }))} {...register("delai")} error={errors.delai?.message} />
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          <TextField label="Nom complet" autoComplete="name" {...register("nom")} error={errors.nom?.message} />
                          <TextField label="Entreprise" optional autoComplete="organization" {...register("entreprise")} error={errors.entreprise?.message} />
                          <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" {...register("telephone")} error={errors.telephone?.message} />
                          <TextField label="E-mail" optional type="email" inputMode="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
                          <div className="sm:col-span-2">
                            <Controller
                              control={control}
                              name="ville"
                              render={({ field }) => <CityCombobox ref={field.ref} name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.ville?.message} />}
                            />
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <dl className="mt-6 divide-y divide-ink/[0.07] rounded-[14px] border border-ink/[0.07]">
                          {(
                            [
                              ["Secteur", sectorName, 0],
                              ["Besoins", [...besoinNames, ...serviceNames].join(" · "), 1],
                              ["Projet", v.description, 2],
                              ["Taille", v.taille, 2],
                              ["Délai", v.delai, 2],
                              ["Contact", [v.nom, v.entreprise, v.telephone, v.email, v.ville].filter(Boolean).join(" · "), 3],
                            ] as Array<[string, string | undefined, number]>
                          )
                            .filter(([, val]) => Boolean(val))
                            .map(([k, val, target]) => (
                              <div key={k} className="flex items-start gap-4 p-4">
                                <dt className="label-mono w-20 shrink-0 pt-0.5 text-[10px] text-mute">{k}</dt>
                                <dd className="min-w-0 flex-1 whitespace-pre-line break-words text-[14px] text-ink">{val}</dd>
                                <button type="button" onClick={() => void go(target)} className="shrink-0 cursor-pointer text-[13px] font-medium text-green-deep hover:underline">
                                  Modifier
                                </button>
                              </div>
                            ))}
                        </dl>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-10 flex items-center justify-between gap-3 border-t border-ink/[0.07] pt-6">
                  {step > 0 ? (
                    <button type="button" onClick={() => void go(step - 1)} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] px-3 text-sm font-medium text-ink hover:bg-paper">
                      <ArrowLeft className="size-4" aria-hidden /> Retour
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < stepDefs.length - 1 ? (
                    <Button type="button" variant="dark" size="lg" arrow onClick={() => void go(step + 1)}>
                      Continuer
                    </Button>
                  ) : (
                    <Button type="submit" variant="primary" size="lg" loading={loading} icon={<Send className="size-4" aria-hidden />}>
                      Envoyer ma demande
                    </Button>
                  )}
                </div>
                {step === stepDefs.length - 1 && (
                  <p className="mt-4 text-right text-[12px] text-mute">Gratuit et sans engagement. Données traitées conformément à la loi 09-08.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}