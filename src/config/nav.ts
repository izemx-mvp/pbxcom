export type MegaId = "solutions" | "boutique";

export const mainNav = [
  { label: "Accueil", to: "/", mega: null },
  { label: "Solutions", to: "/solutions", mega: "solutions" },
  { label: "Boutique", to: "/boutique", mega: "boutique" },
  { label: "Secteurs", to: "/secteurs", mega: null },
  { label: "Références", to: "/references", mega: null },
  { label: "À propos", to: "/a-propos", mega: null },
  { label: "Contact", to: "/contact", mega: null },
] as const;

export const legalNav = [
  { label: "Livraison", to: "/livraison" },
  { label: "CGV", to: "/cgv" },
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Confidentialité", to: "/confidentialite" },
] as const;

export const companyNav = [
  { label: "À propos", to: "/a-propos" },
  { label: "Références", to: "/references" },
  { label: "Secteurs", to: "/secteurs" },
  { label: "Devis gratuit", to: "/devis" },
  { label: "Contact", to: "/contact" },
] as const;
