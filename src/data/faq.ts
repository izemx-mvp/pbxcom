import type { UniverseId } from "./services";

export type FaqItem = { q: string; a: string };

// generated
export const universeFaq: Record<UniverseId, FaqItem[]> = {
  securite: [
    {
      q: "Combien de caméras faut-il pour sécuriser mon site ?",
      a: "Tout dépend de la surface, du nombre d'accès et des zones à risque. Lors de l'étude gratuite, un technicien identifie les angles morts et vous propose le nombre juste de caméras, sans surdimensionner l'installation.",
    },
    {
      q: "Puis-je consulter mes caméras depuis mon téléphone ?",
      a: "Oui. Toutes nos installations de vidéosurveillance sont livrées avec un accès sécurisé sur smartphone, tablette et ordinateur. Nous configurons l'application avec vous lors de la mise en service.",
    },
    {
      q: "Le contrôle d'accès peut-il servir de pointeuse ?",
      a: "Oui. Nos terminaux biométriques et lecteurs de badges peuvent enregistrer les entrées et sorties du personnel et exporter les présences au format Excel pour la gestion de la paie.",
    },
    {
      q: "Assurez-vous la maintenance des systèmes de détection incendie ?",
      a: "Oui. Nous proposons des contrats de maintenance avec visites périodiques, tests des détecteurs et de la centrale, et rapport d'intervention à chaque passage.",
    },
  ],
  reseau: [
    {
      q: "Faut-il refaire tout le câblage pour passer au Wi-Fi 6 ?",
      a: "Pas nécessairement. Nous auditons d'abord votre câblage existant. Si les liens sont en Cat5e ou Cat6 en bon état, ils suffisent pour la plupart des points d'accès Wi-Fi 6.",
    },
    {
      q: "Quelle différence entre fibre monomode et multimode ?",
      a: "La fibre multimode convient aux distances courtes, à l'intérieur d'un bâtiment. La monomode permet des liaisons de plusieurs kilomètres entre bâtiments. Nous choisissons selon la distance et le débit visés.",
    },
    {
      q: "Pouvez-vous intervenir sans interrompre notre activité ?",
      a: "Oui. Nous planifions les interventions sensibles en dehors des heures de travail, le soir ou le week-end, et préparons les bascules à l'avance pour limiter toute coupure.",
    },
    {
      q: "Livrez-vous une documentation du réseau ?",
      a: "Chaque installation est livrée avec un plan de repérage, les résultats de tests des liens et les configurations des équipements, pour faciliter toute évolution future.",
    },
  ],
  telecom: [
    {
      q: "Puis-je conserver mes numéros de téléphone actuels ?",
      a: "Dans la grande majorité des cas, oui. Nous organisons la migration de vos lignes vers la téléphonie IP en conservant vos numéros et en limitant l'interruption de service.",
    },
    {
      q: "La téléphonie IP fonctionne-t-elle en cas de coupure Internet ?",
      a: "Nous prévoyons des solutions de secours : double accès Internet, bascule automatique ou renvoi vers des mobiles, selon le niveau de continuité dont vous avez besoin.",
    },
    {
      q: "Vos équipements de visioconférence sont-ils compatibles avec Teams et Zoom ?",
      a: "Oui. Les caméras, barres et speakerphones que nous installons sont compatibles avec les principales plateformes de réunion du marché.",
    },
    {
      q: "Formez-vous nos équipes après l'installation ?",
      a: "Oui. Chaque mise en service comprend une prise en main avec vos utilisateurs et un guide simple pour les fonctions les plus courantes.",
    },
  ],
};

// generated
export const contactFaq: FaqItem[] = [
  {
    q: "En combien de temps recevrai-je mon devis ?",
    a: "Nous nous engageons à vous répondre en moins de 4h ouvrées. Un conseiller vous appelle pour confirmer les détails de votre projet avant d'établir le devis.",
  },
  {
    q: "Le devis est-il payant ?",
    a: "Non. Le devis et l'estimation sont entièrement gratuits et sans engagement.",
  },
  {
    q: "Intervenez-vous en dehors de Rabat ?",
    a: "Oui. Basés à Hay Riad, Rabat, nous intervenons dans la région Rabat-Salé-Kénitra, à Casablanca et dans les principales villes du Maroc selon les projets. Nos produits sont livrés partout au Maroc.",
  },
  {
    q: "Proposez-vous l'installation des produits achetés en ligne ?",
    a: "Oui. Il suffit de cocher « J'ai besoin de l'installation » dans votre panier ou de nous le préciser : un technicien vous recontacte pour planifier l'intervention.",
  },
];
