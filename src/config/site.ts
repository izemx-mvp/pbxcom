export type Reference = {
  name: string;
  fullName: string;
  sector: string;
  logo?: string;
};

const foundingYear = 2006;

export const site = {
  name: "PBXcom",
  legalName: "PBXCOM",
  tagline: "Informatique et Télécom",
  slogan: "Sécurité, Réseau, Télécom : Tout pour Connecter et Protéger",
  description:
    "Intégrateur de systèmes de sécurité, d'infrastructures réseau et de télécommunications depuis 2006 à Rabat. Devis gratuit en moins de 4h.",
  url: "https://pbxcom.fr",
  foundingYear,
  yearsOfExperience: new Date().getFullYear() - foundingYear,
  address: {
    street: "Lot Rabiaa, 37 Route de Mehdia",
    district: "Route de Mehdia",
    city: "Salé",
    full: "Lot Rabiaa, 37 Route de Mehdia, Salé 11000, Maroc",
    mapsQuery: "Pbxcom, 37 Route de Mehdia, Salé",
  },
  phone: { display: "06 61 10 00 03", href: "tel:+212661100003" },
  whatsapp: { display: "06 61 10 00 03", number: "212661100003" },
  email: "contact@pbxcom.fr",
  hours: "Lun – Ven : 9h – 19h · Sam : 9h – 12h",
  hoursDetail: [
    { days: "Lundi – Vendredi", time: "09:00 – 19:00" },
    { days: "Samedi", time: "09:00 – 12:00" },
    { days: "Dimanche", time: "Fermé" },
  ],
  socials: {
    facebook: { label: "Facebook", handle: "PbxcomMAROC", url: "https://www.facebook.com/PbxcomMAROC" },
    instagram: { label: "Instagram", handle: "pbxcom.fr", url: "https://www.instagram.com/pbxcom.fr" },
  },
  quoteDelay: "moins de 4h",
  direction: {
    label: "La Direction PBXcom",
    // generated
    message:
      "Depuis 2006, nous avons construit PBXcom autour d'une conviction simple : une installation de sécurité, un réseau ou un système téléphonique n'a de valeur que s'il fonctionne chaque jour, sans que vous ayez à y penser. C'est pourquoi nous accompagnons chaque client de l'étude jusqu'à la maintenance, avec la même équipe et la même exigence. Nos partenariats avec les leaders du secteur nous permettent de proposer des solutions fiables et durables, adaptées à chaque budget. Aujourd'hui, avec notre boutique en ligne, nous rendons cette expertise encore plus accessible, partout au Maroc.",
  },
  references: [
    { name: "OCP", fullName: "OCP Group — Office Chérifien des Phosphates", sector: "Industrie", logo: "/images/references/ocp.webp" },
    { name: "Maroc Telecom", fullName: "Maroc Telecom (IAM)", sector: "Télécoms", logo: "/images/references/maroc-telecom.webp" },
    { name: "CDG", fullName: "CDG — Caisse de Dépôt et de Gestion", sector: "Institution financière", logo: "/images/references/cdg.webp" },
    { name: "Marsa Maroc", fullName: "Marsa Maroc — Exploitation portuaire", sector: "Transport & logistique", logo: "/images/references/marsa-maroc.webp" },
    { name: "Al Barid Bank", fullName: "Al Barid Bank — Groupe Barid Al-Maghrib", sector: "Banque", logo: "/images/references/al-barid-bank.webp" },
    { name: "Crédit Agricole", fullName: "Crédit Agricole du Maroc", sector: "Banque", logo: "/images/references/credit-agricole.webp" },
    { name: "DGAPR", fullName: "Délégation Générale à l'Administration Pénitentiaire et à la Réinsertion", sector: "Administration publique", logo: "/images/references/dgapr.webp" },
  ] as Reference[],
  // generated
  delivery: {
    short: "Livraison partout au Maroc",
    text: "Expédition sous 24 à 72h ouvrées à Rabat, Salé, Témara, Casablanca et dans les grandes villes, 3 à 5 jours ouvrés pour le reste du Maroc. Les frais sont confirmés par téléphone avec votre commande.",
    note: "Livraison calculée à la confirmation",
  },
  // generated
  payment: {
    methods: [
      {
        id: "livraison",
        label: "Paiement à la livraison",
        text: "Réglez en espèces ou par chèque à la réception de votre commande.",
      },
      {
        id: "virement",
        label: "Virement bancaire",
        text: "Nos coordonnées bancaires vous sont transmises avec la confirmation de commande.",
      },
    ],
  },
  warranty: "Garantie constructeur de 12 à 36 mois selon les produits", // generated
} as const;

export type PaymentMethodId = (typeof site.payment.methods)[number]["id"];
