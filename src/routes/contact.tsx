import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Navigation, PhoneCall, Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { contactFaq } from "@/data/faq";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { PageHero } from "@/components/site/blocks";
import { Section, SectionHeading, IconTile } from "@/components/site/primitives";
import { Button, buttonVariants, ButtonContent } from "@/components/site/button";
import { CardCircuit } from "@/components/site/blocks";
import { EASE } from "@/components/site/motion";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { SiteAccordion } from "@/components/site/site-accordion";
import { FacebookIcon, InstagramIcon } from "@/components/site/icons";
import { SelectField, TextAreaField, TextField, phoneError, phoneRegex } from "@/components/forms/fields";
import { FormSuccess } from "@/components/forms/form-success";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact",
      description: `Contactez PBXcom à Hay Riad, Rabat : téléphone, WhatsApp, e-mail ou formulaire. Réponse rapide, devis gratuit en ${site.quoteDelay}.`,
      path: "/contact",
      breadcrumbs: [{ name: "Contact", path: "/contact" }],
    }),
  component: ContactPage,
});

const sujets = ["Demande de devis", "Question sur un produit", "Suivi de commande", "Maintenance / SAV", "Partenariat", "Autre"];

const schema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom."),
  telephone: z.string().trim().regex(phoneRegex, phoneError),
  email: z.union([z.literal(""), z.string().trim().email("Indiquez une adresse e-mail valide.")]),
  sujet: z.string().min(1, "Choisissez un sujet."),
  message: z.string().trim().min(10, "Votre message doit comporter au moins 10 caractères.").max(1500),
});
type Values = z.infer<typeof schema>;

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&z=15&hl=fr&output=embed`;

function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { email: "", sujet: "" } });

  const onSubmit = (v: Values) => {
    setLoading(true);
    // Frontend-only MVP: the message is not transmitted anywhere yet (to be wired to e-mail / CRM / backend).
    window.setTimeout(() => {
      setSent(v.nom);
      setLoading(false);
      reset();
    }, 700);
  };

  if (sent)
    return (
      <FormSuccess
        title={`Merci ${sent} !`}
        text="Votre message a bien été envoyé. Notre équipe vous répond rapidement, aux heures ouvrées."
      >
        <button type="button" onClick={() => setSent(null)} className="mt-6 cursor-pointer text-sm font-medium text-green-deep hover:underline">
          Envoyer un autre message
        </button>
      </FormSuccess>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <TextField label="Nom complet" autoComplete="name" {...register("nom")} error={errors.nom?.message} />
      <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" {...register("telephone")} error={errors.telephone?.message} />
      <TextField label="E-mail" optional type="email" inputMode="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
      <SelectField label="Sujet" options={sujets.map((s) => ({ value: s, label: s }))} {...register("sujet")} error={errors.sujet?.message} />
      <TextAreaField label="Votre message" rows={5} {...register("message")} error={errors.message?.message} className="sm:col-span-2" />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-mute">Données traitées conformément à la loi 09-08.</p>
        <Button type="submit" size="lg" loading={loading} icon={<Send className="size-4" aria-hidden />}>
          Envoyer
        </Button>
      </div>
    </form>
  );
}

function ContactPage() {
  const cards = [
    { icon: PhoneCall, label: "Téléphone", value: site.phone.display, href: site.phone.href, note: "Lun – Sam, aux heures d'ouverture" },
    { icon: MessageCircle, label: "WhatsApp", value: site.whatsapp.display, href: buildWhatsAppUrl(defaultWhatsAppMessage), note: "Réponse rapide", external: true, featured: true },
    { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}`, note: "Pour vos demandes détaillées" },
    { icon: MapPin, label: "Adresse", value: `${site.address.street}, ${site.address.district}`, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`, note: site.address.city, external: true },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        highlight="votre projet"
        subtitle={`Une question, un devis, un suivi de commande ? Notre équipe vous répond rapidement. Devis gratuit en ${site.quoteDelay}.`}
        crumbs={[{ label: "Contact" }]}
        compact
        aside={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="hidden w-[320px] flex-col gap-3 rounded-[20px] bg-graphite/90 p-5 ring-1 ring-white/10 lg:flex"
          >
            <p className="label-mono flex items-center gap-2 text-[10px] text-white/50">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-green" />
              </span>
              Le plus rapide
            </p>
            <a href={buildWhatsAppUrl(defaultWhatsAppMessage)} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "w-full")}>
              <ButtonContent icon={<MessageCircle className="size-4" aria-hidden />}>Écrire sur WhatsApp</ButtonContent>
            </a>
            <a href={site.phone.href} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}>
              <ButtonContent icon={<PhoneCall className="size-4" aria-hidden />}>{site.phone.display}</ButtonContent>
            </a>
            <p className="text-center text-[12px] text-white/45">{site.hours}</p>
          </motion.div>
        }
      />

      <Section tone="light" aria-label="Moyens de contact" className="pt-12 md:pt-16">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <StaggerItem key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-[18px] p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_oklch(0.155_0.006_165/0.45)]",
                  "featured" in c && c.featured ? "bg-ink text-white" : "border border-ink/[0.07] bg-white",
                )}
              >
                <div className="flex items-start justify-between">
                  <IconTile icon={c.icon} tone={"featured" in c && c.featured ? "dark" : "light"} />
                  <ArrowUpRight className={cn("size-5 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5", "featured" in c && c.featured ? "text-green" : "text-mute group-hover:text-green-deep")} aria-hidden />
                </div>
                {"featured" in c && c.featured && <span className="label-mono absolute right-14 top-7 rounded-full bg-green px-2 py-0.5 text-[9px] text-ink">Recommandé</span>}
                <span className={cn("label-mono mt-6 text-[10px]", "featured" in c && c.featured ? "text-white/50" : "text-mute")}>{c.label}</span>
                <span className={cn("mt-1 break-words font-medium transition-colors", "featured" in c && c.featured ? "text-white group-hover:text-green" : "text-ink group-hover:text-green-deep")}>{c.value}</span>
                <span className={cn("mt-1 text-[13px]", "featured" in c && c.featured ? "text-white/55" : "text-mute")}>{c.note}</span>
                <CardCircuit />
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="relative overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white p-6 sm:p-8 md:p-10">
            <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--green-deep),var(--green),transparent)]" aria-hidden />
            <p className="label-mono text-[10px] text-green-deep">Formulaire</p>
            <h2 className="type-h3 mt-2 text-ink">Écrivez-nous</h2>
            <p className="mb-8 mt-2 text-[15px] text-mute">Remplissez le formulaire : notre équipe vous répond rapidement.</p>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08} className="relative min-h-[420px] overflow-hidden rounded-[20px] bg-ink">
            <iframe
              title={`Carte : ${site.address.full}`}
              src={mapSrc}
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.6] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[16px] bg-ink p-5 text-white shadow-2xl sm:inset-x-auto sm:left-4 sm:max-w-xs">
              <p className="label-mono text-[10px] text-green">Nos bureaux</p>
              <p className="mt-2 font-display text-lg font-semibold">{site.name}</p>
              <address className="mt-1 text-[14px] not-italic leading-relaxed text-white/65">
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city}
              </address>
              <ul className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-4 text-[13px]">
                {site.hoursDetail.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span className="flex items-center gap-2 text-white/55">
                      <Clock className="size-3.5 text-green" aria-hidden />
                      {h.days}
                    </span>
                    <span className="text-white/85">{h.time}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.full)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-4 w-full")}
              >
                <ButtonContent icon={<Navigation className="size-4" aria-hidden />}>Itinéraire</ButtonContent>
              </a>
              <div className="mt-4 flex gap-2">
                <a href={site.socials.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="PBXcom sur Facebook" className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/75 transition-colors hover:bg-green hover:text-ink">
                  <FacebookIcon className="size-4" />
                </a>
                <a href={site.socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="PBXcom sur Instagram" className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/75 transition-colors hover:bg-green hover:text-ink">
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" divider aria-labelledby="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions fréquentes" highlight="fréquentes" subtitle="Vous ne trouvez pas votre réponse ? Appelez-nous ou écrivez-nous sur WhatsApp." className="mb-0 md:mb-0" />
          <SiteAccordion items={contactFaq} />
        </div>
      </Section>
    </>
  );
}