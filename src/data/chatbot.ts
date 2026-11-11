import { site } from "@/config/site";
import { services } from "./services";
import { sectors } from "./sectors";
import { universes } from "./universes";

export type ChatChip = {
  label: string;
  /** "text:…" sends as user text · "flow:devis" starts the quote flow · "link:/path" navigates · "wa" opens WhatsApp · "products:query" */
  action: string;
};

export type ChatLink = { label: string; href: string };

export type BotReply = {
  text: string;
  chips?: ChatChip[];
  products?: string[];
  productQuery?: string;
  links?: ChatLink[];
};

export type ChatContext = { cartCount: number };

export type Intent = {
  id: string;
  keywords: string[];
  reply: (ctx: ChatContext) => BotReply;
};

export const welcomeChips: ChatChip[] = [
  { label: "🛡️ Sécurité", action: "text:sécurité" },
  { label: "🌐 Réseau", action: "text:réseau" },
  { label: "☎️ Télécom", action: "text:télécom" },
  { label: "🛒 Trouver un produit", action: "text:trouver un produit" },
  { label: "📝 Demander un devis", action: "flow:devis" },
  { label: "📞 Nous contacter", action: "text:contact" },
];

export const welcomeMessage = "Bonjour 👋 Je suis l'assistant PBXcom. Comment puis-je vous aider ?";

export const fallbackReply: BotReply = {
  text: "Je n'ai pas bien compris 🤔 Pouvez-vous reformuler, ou choisir l'un des sujets ci-dessous ?",
  chips: [...welcomeChips, { label: "💬 Parler à un conseiller sur WhatsApp", action: "wa" }],
};

const devisChip: ChatChip = { label: "📝 Demander un devis", action: "flow:devis" };
const waChip: ChatChip = { label: "💬 Conseiller WhatsApp", action: "wa" };

/** Synonyms per service (normalised: lowercase, no accents) */
const serviceKeywords: Record<string, string[]> = {
  videosurveillance: ["videosurveillance", "video surveillance", "cctv", "surveillance", "camera de surveillance", "cameras de surveillance", "nvr", "enregistreur"],
  "controle-acces": ["controle d'acces", "controle acces", "badge", "badges", "biometrie", "biometrique", "pointeuse", "pointage", "tourniquet", "lecteur de badge", "reconnaissance faciale", "ventouse"],
  "anti-intrusion": ["anti intrusion", "anti-intrusion", "intrusion", "alarme", "alarmes", "cambriolage", "detecteur de mouvement", "sirene", "vol"],
  incendie: ["incendie", "feu", "fumee", "detecteur de fumee", "detection incendie", "declencheur", "centrale incendie", "ssi"],
  routage: ["routage", "routeur", "switch", "commutation", "vlan", "pare-feu", "firewall", "reseau lent", "poe"],
  wifi: ["wifi", "wi-fi", "wi fi", "sans fil", "borne", "point d'acces", "couverture", "hotspot", "portail captif"],
  "cablage-cuivre": ["cablage", "cable", "cables", "rj45", "cat6", "cat 6", "baie", "brassage", "prise reseau"],
  "fibre-optique": ["fibre", "fibre optique", "optique", "soudure", "otdr", "liaison entre batiments"],
  "telephonie-ip": ["telephonie", "telephonie ip", "standard", "ipbx", "pabx", "pbx", "standard telephonique", "poste ip", "telephone ip", "toip"],
  visioconference: ["visio", "visioconference", "video conference", "teams", "zoom", "salle de reunion", "reunion"],
  voip: ["voip", "sip", "trunk", "centre d'appels", "call center", "casque", "softphone"],
  vpn: ["vpn", "teletravail", "acces distant", "a distance", "interconnexion", "multi-sites", "multi sites", "site a site"],
};

const sectorKeywords: Record<string, string[]> = {
  entreprise: ["entreprise", "bureau", "bureaux", "societe", "pme", "siege", "agence"],
  hotel: ["hotel", "hotels", "riad", "hotellerie", "chambres", "tourisme"],
  collectivite: ["commune", "collectivite", "mairie", "administration", "public", "municipalite"],
  residence: ["residence", "immeuble", "syndic", "villa", "appartement", "maison", "copropriete"],
  sante: ["sante", "clinique", "hopital", "cabinet medical", "laboratoire", "medical"],
  transport: ["transport", "logistique", "entrepot", "port", "gare", "flotte", "depot"],
};

const serviceIntents: Intent[] = services.map((s) => {
  const universe = universes.find((u) => u.id === s.universe)!;
  return {
    id: `service:${s.slug}`,
    keywords: serviceKeywords[s.slug] ?? [s.name.toLowerCase()],
    reply: () => ({
      text: `**${s.name}** — ${s.description.split(". ").slice(0, 2).join(". ")}.\n\nCas d'usage : ${s.useCases.join(", ")}.`,
      links: [{ label: `En savoir plus sur ${s.name.toLowerCase()}`, href: `/solutions/${universe.id}#${s.slug}` }],
      productQuery: s.category,
      chips: [devisChip, { label: "🛒 Voir les produits", action: `link:/boutique/${s.category}` }, waChip],
    }),
  };
});

const universeIntents: Intent[] = universes.map((u) => ({
  id: `universe:${u.id}`,
  keywords:
    u.id === "securite"
      ? ["securite", "securiser", "proteger", "protection", "surete"]
      : u.id === "reseau"
        ? ["reseau", "reseaux", "infrastructure", "informatique", "internet", "connexion", "network"]
        : ["telecom", "telecoms", "telecommunication", "telecommunications", "communication", "communications", "telephone"],
  reply: () => {
    const list = services.filter((s) => s.universe === u.id);
    return {
      text: `Notre univers **${u.name}** couvre 4 services : ${list.map((s) => s.name).join(", ")}. ${u.tagline} Lequel vous intéresse ?`,
      chips: [...list.map((s) => ({ label: s.name, action: `text:${s.name}` })), devisChip],
      links: [{ label: `Découvrir ${u.name}`, href: `/solutions/${u.id}` }],
    };
  },
}));

const sectorIntents: Intent[] = sectors.map((sec) => ({
  id: `sector:${sec.slug}`,
  keywords: sectorKeywords[sec.slug] ?? [sec.slug],
  reply: () => {
    const sol = sec.solutions.map((slug) => services.find((s) => s.slug === slug)!).slice(0, 4);
    return {
      text: `Pour le secteur **${sec.name}**, nos clients ont généralement besoin de :\n${sec.needs
        .slice(0, 3)
        .map((n) => `• ${n}`)
        .join("\n")}\n\nNous recommandons notamment : ${sol.map((s) => s.name).join(", ")}.`,
      chips: [{ label: `📝 Devis ${sec.name}`, action: `flow:devis:${sec.slug}` }, ...sol.slice(0, 3).map((s) => ({ label: s.name, action: `text:${s.name}` }))],
      links: [{ label: `Voir le secteur ${sec.name}`, href: `/secteurs#${sec.slug}` }],
    };
  },
}));

export const productKeywords = [
  "produit",
  "produits",
  "acheter",
  "achat",
  "boutique",
  "prix",
  "tarif",
  "combien",
  "trouver un produit",
  "camera",
  "cameras",
  "dome",
  "bullet",
  "telephone ip",
  "poste",
  "switch",
  "routeur",
  "borne wifi",
  "point d'acces",
  "kit alarme",
  "detecteur",
  "casque",
  "barre",
  "speakerphone",
  "cable",
  "baie",
  "lecteur",
  "terminal",
  "nvr",
];

const generalIntents: Intent[] = [
  {
    id: "greeting",
    keywords: ["bonjour", "bonsoir", "salut", "salam", "hello", "coucou", "hey", "slt", "bjr", "salamou alaykoum"],
    reply: () => ({ text: "Bonjour et bienvenue chez PBXcom 👋 Que puis-je faire pour vous aujourd'hui ?", chips: welcomeChips }),
  },
  {
    id: "thanks",
    keywords: ["merci", "parfait", "super", "genial", "top", "nickel", "chokran", "shukran", "d'accord", "ok merci"],
    reply: () => ({
      text: "Avec plaisir ! N'hésitez pas si vous avez une autre question. Un conseiller reste aussi disponible sur WhatsApp.",
      chips: [devisChip, waChip],
    }),
  },
  {
    id: "find-product",
    keywords: ["trouver un produit", "catalogue", "boutique", "acheter", "achat", "commander en ligne"],
    reply: () => ({
      text: "Que recherchez-vous ? Choisissez une famille de produits ou tapez directement un nom (caméra, switch, téléphone IP, badge…).",
      chips: [
        { label: "📷 Caméras", action: "text:caméra" },
        { label: "🔑 Contrôle d'accès", action: "text:lecteur badge" },
        { label: "🚨 Alarme", action: "text:kit alarme" },
        { label: "🌐 Switch & Wi-Fi", action: "text:switch" },
        { label: "☎️ Téléphones IP", action: "text:téléphone IP" },
        { label: "🎥 Visioconférence", action: "text:barre visio" },
      ],
      links: [{ label: "Parcourir toute la boutique", href: "/boutique" }],
    }),
  },
  {
    id: "devis-delay",
    keywords: ["delai devis", "combien de temps", "quand", "rapide", "delai", "4h", "4 heures", "reponse"],
    reply: () => ({
      text: `Votre devis est **gratuit et sans engagement**, et nous vous répondons en **${site.quoteDelay}**. Un conseiller vous appelle d'abord pour valider les détails de votre projet.`,
      chips: [devisChip, waChip],
    }),
  },
  {
    id: "devis",
    keywords: ["devis", "estimation", "chiffrage", "cotation", "proposition commerciale", "projet"],
    reply: () => ({ text: "Je lance votre demande de devis 📝", chips: [] }),
  },
  {
    id: "livraison",
    keywords: ["livraison", "livrer", "livrez", "expedition", "envoi", "frais de port", "delai de livraison", "colis"],
    reply: () => ({
      text: `🚚 ${site.delivery.short}. ${site.delivery.text}`,
      links: [{ label: "Conditions de livraison", href: "/livraison" }],
      chips: [{ label: "💳 Moyens de paiement", action: "text:paiement" }, { label: "🛒 Voir la boutique", action: "link:/boutique" }],
    }),
  },
  {
    id: "paiement",
    keywords: ["paiement", "payer", "carte", "virement", "especes", "cheque", "reglement", "cash"],
    reply: () => ({
      text: `Deux moyens de paiement sont proposés :\n${site.payment.methods.map((m) => `• **${m.label}** — ${m.text}`).join("\n")}`,
      links: [{ label: "Conditions générales de vente", href: "/cgv" }],
      chips: [{ label: "🚚 Livraison", action: "text:livraison" }, devisChip],
    }),
  },
  {
    id: "installation",
    keywords: ["installation", "installer", "pose", "poser", "technicien", "intervention", "mise en service", "maintenance", "depannage"],
    reply: () => ({
      text: "Oui, nos techniciens installent et mettent en service tous les équipements : étude, fourniture, installation, paramétrage puis maintenance. Pour un achat en ligne, cochez simplement « J'ai besoin de l'installation » dans votre panier.",
      chips: [devisChip, { label: "🛡️ Garantie", action: "text:garantie" }],
    }),
  },
  {
    id: "garantie",
    keywords: ["garantie", "garanti", "sav", "retour", "panne", "defectueux", "remboursement", "echange"],
    reply: () => ({
      text: `${site.warranty}. En cas de panne, notre équipe diagnostique le matériel et prend en charge l'échange ou la réparation selon les conditions du constructeur. Les retours sont possibles sous 7 jours pour un produit non utilisé dans son emballage d'origine.`,
      links: [{ label: "Lire les CGV", href: "/cgv" }],
      chips: [waChip],
    }),
  },
  {
    id: "adresse",
    keywords: ["adresse", "ou etes vous", "ou vous trouver", "localisation", "situe", "horaire", "horaires", "ouvert", "heure", "showroom", "agence", "rabat", "hay riad"],
    reply: () => ({
      text: `📍 ${site.address.full}\n🕘 ${site.hours}\n📞 ${site.phone.display}`,
      links: [{ label: "Voir le plan et nous contacter", href: "/contact" }],
      chips: [waChip, devisChip],
    }),
  },
  {
    id: "contact",
    keywords: ["contact", "contacter", "appeler", "telephone de pbxcom", "numero", "email", "mail", "joindre", "conseiller", "humain", "parler"],
    reply: () => ({
      text: `Vous pouvez nous joindre :\n📞 ${site.phone.display}\n💬 WhatsApp ${site.whatsapp.display}\n✉️ ${site.email}\n🕘 ${site.hours}`,
      chips: [waChip, devisChip],
      links: [{ label: "Page contact", href: "/contact" }],
    }),
  },
  {
    id: "about",
    keywords: ["a propos", "qui etes vous", "pbxcom", "histoire", "depuis quand", "2006", "experience", "entreprise pbxcom", "societe pbxcom"],
    reply: () => ({
      text: `PBXcom est spécialiste depuis **${site.foundingYear}**, à Rabat, de l'installation de systèmes de sécurité et de l'intégration technologique : systèmes informatiques et réseaux télécom. Nous travaillons avec des partenaires leaders du secteur et accompagnons nos clients de l'étude à la maintenance.`,
      links: [{ label: "Découvrir PBXcom", href: "/a-propos" }],
      chips: [{ label: "🏆 Références", action: "text:références" }, devisChip],
    }),
  },
  {
    id: "references",
    keywords: ["reference", "references", "clients", "client", "confiance", "realisations", "projets", "ocp", "marsa", "barid", "dgapr"],
    reply: () => ({
      text: `Ils nous ont fait confiance : ${site.references.map((r) => r.name).join(", ")}. Nous accompagnons aussi des hôtels, résidences, cliniques et entreprises de toutes tailles.`,
      links: [{ label: "Voir nos références", href: "/references" }],
      chips: [devisChip],
    }),
  },
  {
    id: "cart",
    keywords: ["panier", "mon panier", "ma commande", "commande", "articles"],
    reply: (ctx) => ({
      text:
        ctx.cartCount > 0
          ? `Vous avez **${ctx.cartCount} article${ctx.cartCount > 1 ? "s" : ""}** dans votre panier.`
          : "Votre panier est vide pour le moment. Voulez-vous que je vous aide à trouver un produit ?",
      chips: ctx.cartCount > 0 ? [{ label: "🛒 Voir le panier", action: "link:/panier" }, { label: "✅ Commander", action: "link:/commande" }] : [{ label: "🛒 Trouver un produit", action: "text:trouver un produit" }],
    }),
  },
];

export const intents: Intent[] = [...generalIntents, ...universeIntents, ...serviceIntents, ...sectorIntents];

export const quoteFlowCopy = {
  secteur: "Parfait ! Pour commencer, dans quel secteur se situe votre projet ?",
  besoin: "Merci. Quel est votre besoin principal ?",
  description: "Décrivez votre projet en quelques mots (surface, nombre de caméras ou de postes, délai…).",
  nom: "Très bien. Quel est votre nom ?",
  telephone: "Et votre numéro de téléphone pour que le conseiller vous rappelle ?",
  telephoneInvalid: "Ce numéro ne semble pas valide. Indiquez un numéro marocain, par exemple 06 12 34 56 78.",
  summary: "Voici le récapitulatif de votre demande. Envoyez-la sur WhatsApp ou continuez sur le formulaire complet.",
  cancelled: "Demande annulée. Je reste à votre disposition !",
};

export const besoinOptions = [
  { label: "🛡️ Sécurité", value: "securite", name: "Sécurité" },
  { label: "🌐 Infrastructure réseau", value: "reseau", name: "Infrastructure réseau" },
  { label: "☎️ Télécommunication", value: "telecom", name: "Télécommunication" },
  { label: "🧩 Autre besoin", value: "autre", name: "Autre besoin" },
];
