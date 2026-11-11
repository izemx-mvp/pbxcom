/**
 * Single source of truth for every image path in the project.
 * Components must import from here — never hard-code a path elsewhere.
 */
export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const img = (src: string, width: number, height: number, alt: string): ImageAsset => ({
  src,
  width,
  height,
  alt,
});

export const images = {
  brand: {
    logo: img("/brand/pbxcom-logo.png", 2000, 428, "PBXcom — Informatique et Télécom"),
  },
  chatbot: {
    avatar: img("/images/chatbot/avatar.png", 512, 512, "Assistant PBXcom"),
    avatarWebp: img("/images/chatbot/avatar.webp", 512, 512, "Assistant PBXcom"),
  },
  hero: {
    main: img(
      "/images/hero/hero-main.webp",
      2400,
      1340,
      "Technicien PBXcom branchant un câble réseau dans une baie de brassage",
    ),
    mobile: img("/images/hero/hero-mobile.webp", 1856, 2304, "Caméra dôme de vidéosurveillance en gros plan"),
    duoDesk: img("/images/hero/hero-duo-desk.webp", 2400, 1340, "Deux conseillers PBXcom au bureau"),
    duoDeskMobile: img("/images/hero/hero-duo-desk-mobile.webp", 900, 1000, "Deux conseillers PBXcom au bureau"),
  },
  universes: {
    securite: img("/images/universes/securite.webp", 2400, 1610, "Entrée de bâtiment équipée d'une caméra et d'un lecteur de badge"),
    reseau: img("/images/universes/reseau.webp", 2400, 1610, "Baie réseau symétrique et câblage structuré"),
    telecom: img("/images/universes/telecom.webp", 2400, 1610, "Salle de réunion avec visioconférence et téléphone IP"),
  },
  services: {
    videosurveillance: img("/images/services/videosurveillance.webp", 2400, 1792, "Salle de contrôle de vidéosurveillance"),
    "controle-acces": img("/images/services/controle-acces.webp", 2400, 1792, "Badge présenté sur un lecteur de contrôle d'accès"),
    "anti-intrusion": img("/images/services/anti-intrusion.webp", 2400, 1792, "Clavier d'alarme et détecteur de mouvement"),
    incendie: img("/images/services/incendie.webp", 2400, 1792, "Détecteur de fumée, déclencheur manuel et issue de secours"),
    routage: img("/images/services/routage.webp", 2400, 1792, "Ports d'un routeur et d'un switch en gros plan"),
    wifi: img("/images/services/wifi.webp", 2400, 1792, "Point d'accès Wi-Fi au plafond d'un open space"),
    "cablage-cuivre": img("/images/services/cablage-cuivre.webp", 2400, 1792, "Technicien sertissant un connecteur RJ45"),
    "fibre-optique": img("/images/services/fibre-optique.webp", 2400, 1792, "Brins de fibre optique lumineux"),
    "telephonie-ip": img("/images/services/telephonie-ip.webp", 2400, 1792, "Téléphone IP à la réception d'un hôtel"),
    visioconference: img("/images/services/visioconference.webp", 2400, 1792, "Visioconférence en salle de conseil"),
    voip: img("/images/services/voip.webp", 2400, 1792, "Conseillère avec casque téléphonique"),
    vpn: img("/images/services/vpn.webp", 2400, 1792, "Ordinateur sécurisé relié aux bureaux par VPN"),
  },
  sectors: {
    // TODO replace — /images/sectors/entreprise.webp not provided yet
    entreprise: img("/images/services/wifi.webp", 2400, 1792, "Bureaux d'entreprise équipés en Wi-Fi professionnel"),
    hotel: img("/images/sectors/hotel.webp", 2400, 1610, "Hall d'hôtel"),
    collectivite: img("/images/sectors/collectivite.webp", 2400, 1610, "Bâtiment de collectivité territoriale"),
    residence: img("/images/sectors/residence.webp", 2400, 1610, "Résidence sécurisée"),
    sante: img("/images/sectors/sante.webp", 2400, 1610, "Établissement de santé"),
    transport: img("/images/sectors/transport.webp", 2400, 1610, "Infrastructure de transport"),
  },
  categories: {
    videosurveillance: img("/images/categories/videosurveillance.webp", 2400, 1018, "Caméras de vidéosurveillance"),
    "controle-acces": img("/images/categories/controle-acces.webp", 2400, 1018, "Équipements de contrôle d'accès"),
    alarme: img("/images/categories/alarme.webp", 2400, 1018, "Équipements d'alarme et anti-intrusion"),
    incendie: img("/images/categories/incendie.webp", 2400, 1018, "Équipements de détection incendie"),
    reseau: img("/images/categories/reseau.webp", 2400, 1018, "Équipements réseau"),
    "cablage-fibre": img("/images/categories/cablage-fibre.webp", 2400, 1018, "Câbles et accessoires fibre optique"),
    "telephonie-ip": img("/images/categories/telephonie-ip.webp", 2400, 1018, "Téléphones IP"),
    visioconference: img("/images/categories/visioconference.webp", 2400, 1018, "Équipements de visioconférence"),
  },
  process: {
    devis: img("/images/process/step-1-devis.webp", 1200, 1200, "Smartphone affichant un formulaire de devis"),
    appel: img("/images/process/step-2-appel.webp", 1200, 1200, "Conseiller PBXcom au téléphone avec un casque"),
    travaux: img("/images/process/step-3-travaux.webp", 1200, 1200, "Technicien intervenant sur une baie réseau"),
  },
  about: {
    teamInstallation: img("/images/about/team-installation.webp", 2400, 1610, "Deux techniciens installant une caméra sur une façade"),
    teamOffice: img("/images/about/team-office.webp", 2400, 1610, "Équipe étudiant un schéma réseau sur un ordinateur"),
    warehouse: img("/images/about/warehouse.webp", 2400, 1610, "Stock d'équipements organisé"),
    ceo: img("/images/about/ceo.webp", 1400, 1738, "La Direction PBXcom"),
  },
  misc: {
    ctaBackground: img("/images/misc/cta-background.webp", 2400, 1018, ""),
    og: img("/images/misc/og-image.jpg", 1200, 630, "PBXcom — Sécurité, Réseau, Télécom"),
    notFound: img("/images/misc/404.webp", 2400, 1792, "Câble réseau débranché sur un bureau"),
  },
} as const;

export const productImagePath = (slug: string) => `/images/products/${slug}.webp`;
