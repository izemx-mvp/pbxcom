import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { sectors } from "@/data/sectors";
import { universes } from "@/data/universes";
import { formatMessage, openWhatsApp } from "@/lib/whatsapp";
import { Button } from "@/components/site/button";
import { FormCard, SelectField, TextAreaField, TextField, phoneError, phoneRegex } from "./fields";
import { SuccessPanel } from "./success-panel";

const schema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom."),
  telephone: z.string().trim().regex(phoneRegex, phoneError),
  secteur: z.string().min(1, "Choisissez un secteur."),
  besoin: z.string().min(1, "Choisissez un besoin."),
  message: z.string().trim().max(1000).optional(),
});
type Values = z.infer<typeof schema>;

export function QuickQuoteForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched" });

  const onSubmit = (v: Values) => {
    setLoading(true);
    const message = formatMessage(
      "Demande de devis rapide — site PBXcom",
      [
        ["Nom", v.nom],
        ["Téléphone", v.telephone],
        ["Secteur", sectors.find((s) => s.slug === v.secteur)?.name],
        ["Besoin", universes.find((u) => u.id === v.besoin)?.name ?? "Autre besoin"],
        ["Projet", v.message],
      ],
      "Merci de me rappeler pour établir mon devis.",
    );
    // Open immediately (inside the user gesture) so popup blockers allow it
    openWhatsApp(message);
    window.setTimeout(() => {
      setSent(message);
      setLoading(false);
      reset();
    }, 450);
  };

  return (
    <FormCard>
      {sent ? (
        <SuccessPanel
          title="Merci ! Demande prête."
          text="Votre message a été préparé dans WhatsApp. Un conseiller vous rappelle pour confirmer votre devis en moins de 4h."
          message={sent}
          subject="Demande de devis — PBXcom"
        >
          <button type="button" onClick={() => setSent(null)} className="mt-6 cursor-pointer text-sm font-medium text-ink link-underline">
            Faire une autre demande
          </button>
        </SuccessPanel>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div>
            <p className="label-mono text-green-deep">Devis express</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Parlez-nous de votre projet</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Nom complet" autoComplete="name" {...register("nom")} error={errors.nom?.message} />
            <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" {...register("telephone")} error={errors.telephone?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Secteur"
              {...register("secteur")}
              error={errors.secteur?.message}
              options={sectors.map((s) => ({ value: s.slug, label: s.name }))}
            />
            <SelectField
              label="Besoin"
              {...register("besoin")}
              error={errors.besoin?.message}
              options={[...universes.map((u) => ({ value: u.id, label: u.name })), { value: "autre", label: "Autre besoin" }]}
            />
          </div>
          <TextAreaField label="Votre projet en quelques mots" optional rows={3} {...register("message")} error={errors.message?.message} />
          <Button type="submit" size="lg" arrow loading={loading} className="mt-1 w-full">
            Envoyer ma demande
          </Button>
          <p className="text-center text-[12px] text-mute">
            Gratuit et sans engagement · Envoi via WhatsApp ·{" "}
            <Link to="/devis" className="font-medium text-ink underline-offset-2 hover:underline">
              Formulaire détaillé
            </Link>
          </p>
        </form>
      )}
    </FormCard>
  );
}
