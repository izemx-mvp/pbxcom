import {
  Cable,
  Cctv,
  Flame,
  Headset,
  KeyRound,
  LockKeyhole,
  PhoneCall,
  Router,
  Siren,
  Video,
  Waypoints,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { images, type ImageAsset } from "@/config/images";

export type UniverseId = "securite" | "reseau" | "telecom";

export type ServiceSlug =
  | "videosurveillance"
  | "controle-acces"
  | "anti-intrusion"
  | "incendie"
  | "routage"
  | "wifi"
  | "cablage-cuivre"
  | "fibre-optique"
  | "telephonie-ip"
  | "visioconference"
  | "voip"
  | "vpn";

export type Service = {
  slug: ServiceSlug;
  universe: UniverseId;
  name: string;
  short: string;
  description: string;
  useCases: string[];
  specChips: string[];
  icon: LucideIcon;
  image: ImageAsset;
  /** Shop category used for related products */
  category: string;
};

// generated — descriptions, use cases and spec chips
export const services: Service[] = [
  {
    slug: "videosurveillance",
    universe: "securite",
    name: "Vidéosurveillance",
    short: "Caméras IP HD, enregistrement et visualisation à distance.",
    description:
      "Nous concevons des systèmes de vidéosurveillance IP adaptés à chaque site : étude des angles morts, choix des caméras (dôme, bullet, PTZ), enregistreurs NVR dimensionnés pour votre durée de conservation et accès sécurisé depuis smartphone. Chaque installation est livrée paramétrée, testée et documentée.",
    useCases: ["Parkings et accès", "Commerces et entrepôts", "Halls d'hôtels", "Sites multi-bâtiments"],
    specChips: ["4K / 8 MP", "Vision nocturne IR", "Accès mobile"],
    icon: Cctv,
    image: images.services.videosurveillance,
    category: "videosurveillance",
  },
  {
    slug: "controle-acces",
    universe: "securite",
    name: "Contrôle d'accès",
    short: "Badges, biométrie et gestion des droits par zone.",
    description:
      "Maîtrisez qui entre, où et quand. Lecteurs de badges RFID, terminaux biométriques, tourniquets et ventouses : nous déployons des solutions centralisées avec gestion des plages horaires, historique des passages et intégration à la pointeuse ou à la vidéosurveillance.",
    useCases: ["Bureaux et sièges sociaux", "Zones sensibles", "Résidences fermées", "Pointage du personnel"],
    specChips: ["RFID / Mifare", "Biométrie", "Logiciel centralisé"],
    icon: KeyRound,
    image: images.services["controle-acces"],
    category: "controle-acces",
  },
  {
    slug: "anti-intrusion",
    universe: "securite",
    name: "Anti-intrusion",
    short: "Alarmes filaires et sans fil, détection et alertes.",
    description:
      "Des centrales d'alarme fiables, des détecteurs de mouvement et d'ouverture placés au bon endroit, des sirènes dissuasives et des alertes instantanées sur votre téléphone. Nous adaptons chaque système à la configuration des lieux et à vos habitudes pour éviter les fausses alarmes.",
    useCases: ["Villas et appartements", "Agences et commerces", "Entrepôts", "Locaux techniques"],
    specChips: ["Filaire & radio", "Alertes GSM / IP", "Détection anti-masque"],
    icon: Siren,
    image: images.services["anti-intrusion"],
    category: "alarme",
  },
  {
    slug: "incendie",
    universe: "securite",
    name: "Détection incendie",
    short: "Détecteurs, déclencheurs et centrales de sécurité incendie.",
    description:
      "Protégez les personnes et les biens avec un système de détection incendie conforme : détecteurs optiques de fumée et thermiques, déclencheurs manuels, sirènes flash et centrales adressables. Nous assurons l'étude, l'installation, la mise en service et les visites de maintenance.",
    useCases: ["Hôtels et ERP", "Établissements de santé", "Bureaux", "Sites industriels"],
    specChips: ["Adressable", "Conventionnel", "Maintenance annuelle"],
    icon: Flame,
    image: images.services.incendie,
    category: "incendie",
  },
  {
    slug: "routage",
    universe: "reseau",
    name: "Routage & commutation",
    short: "Routeurs, switchs manageables et segmentation VLAN.",
    description:
      "Un réseau performant commence par une architecture saine. Nous dimensionnons et configurons vos routeurs, pare-feu et switchs manageables : VLAN, qualité de service pour la voix et la vidéo, redondance des liens et supervision, pour un réseau stable et évolutif.",
    useCases: ["Sièges et agences", "Multi-sites", "Datacenters de proximité", "Réseaux de caméras"],
    specChips: ["VLAN / QoS", "PoE+", "Redondance"],
    icon: Router,
    image: images.services.routage,
    category: "reseau",
  },
  {
    slug: "wifi",
    universe: "reseau",
    name: "Wi-Fi professionnel",
    short: "Couverture Wi-Fi 6 maîtrisée, portail invités.",
    description:
      "Fini les zones blanches. Après une étude de couverture, nous installons des points d'accès Wi-Fi 6 gérés de façon centralisée, avec itinérance fluide, réseau invités isolé et portail captif personnalisé : idéal pour les bureaux, hôtels et espaces recevant du public.",
    useCases: ["Hôtels et riads", "Open spaces", "Écoles et campus", "Entrepôts"],
    specChips: ["Wi-Fi 6", "Itinérance", "Portail captif"],
    icon: Wifi,
    image: images.services.wifi,
    category: "reseau",
  },
  {
    slug: "cablage-cuivre",
    universe: "reseau",
    name: "Câblage cuivre",
    short: "Câblage structuré Cat6/Cat6A, baies et brassage.",
    description:
      "Le câblage est la fondation de votre réseau. Nous réalisons des installations structurées en Cat6 et Cat6A : cheminement, baies de brassage, repérage, tests et certification de chaque lien. Un travail propre et documenté, pensé pour durer et évoluer.",
    useCases: ["Nouveaux locaux", "Rénovation de bureaux", "Baies informatiques", "Extensions de réseau"],
    specChips: ["Cat6 / Cat6A", "Certification des liens", "Repérage complet"],
    icon: Cable,
    image: images.services["cablage-cuivre"],
    category: "cablage-fibre",
  },
  {
    slug: "fibre-optique",
    universe: "reseau",
    name: "Fibre optique",
    short: "Liaisons fibre entre bâtiments, soudure et tests.",
    description:
      "Pour relier des bâtiments ou des étages à très haut débit, nous déployons des liaisons fibre optique monomode et multimode : tirage, soudure par fusion, tiroirs optiques et mesures de réflectométrie pour garantir des performances durables.",
    useCases: ["Liaisons inter-bâtiments", "Backbones d'immeubles", "Campus et zones industrielles", "Vidéosurveillance longue distance"],
    specChips: ["Monomode / Multimode", "Soudure fusion", "Tests OTDR"],
    icon: Waypoints,
    image: images.services["fibre-optique"],
    category: "cablage-fibre",
  },
  {
    slug: "telephonie-ip",
    universe: "telecom",
    name: "Téléphonie IP",
    short: "Standards IPBX, postes IP et numéros SDA.",
    description:
      "Modernisez votre téléphonie avec un standard IPBX : postes IP, accueil vocal, files d'attente, transferts, messagerie vocale par e-mail et rapports d'appels. Nous migrons votre installation existante sans interruption de service et formons vos équipes.",
    useCases: ["Accueil et standard", "Hôtels", "Centres d'appels", "Agences multi-sites"],
    specChips: ["IPBX / SIP", "Postes PoE", "Accueil vocal"],
    icon: PhoneCall,
    image: images.services["telephonie-ip"],
    category: "telephonie-ip",
  },
  {
    slug: "visioconference",
    universe: "telecom",
    name: "Visioconférence",
    short: "Salles de réunion équipées, audio et vidéo HD.",
    description:
      "Des réunions hybrides qui fonctionnent du premier coup. Nous équipons vos salles avec caméras auto-cadrage, barres de visioconférence, micros et écrans, compatibles avec les principales plateformes de réunion, pour une expérience simple à lancer et agréable pour tous.",
    useCases: ["Salles de conseil", "Huddle rooms", "Formation à distance", "Direction générale"],
    specChips: ["4K auto-cadrage", "Audio beamforming", "Compatible Teams / Zoom"],
    icon: Video,
    image: images.services.visioconference,
    category: "visioconference",
  },
  {
    slug: "voip",
    universe: "telecom",
    name: "VoIP & centres d'appels",
    short: "Trunk SIP, casques et solutions pour équipes d'appel.",
    description:
      "Réduisez vos coûts de communication et gagnez en souplesse : trunk SIP, softphones, casques professionnels et outils de supervision pour vos équipes commerciales ou votre service client. Nous dimensionnons la solution selon le volume d'appels et vos horaires.",
    useCases: ["Service client", "Équipes commerciales", "Télétravail", "Support technique"],
    specChips: ["Trunk SIP", "Softphone", "Statistiques d'appels"],
    icon: Headset,
    image: images.services.voip,
    category: "telephonie-ip",
  },
  {
    slug: "vpn",
    universe: "telecom",
    name: "VPN & interconnexion",
    short: "Accès distants sécurisés et liaison entre sites.",
    description:
      "Connectez vos agences et vos collaborateurs nomades à votre système d'information en toute sécurité. Nous mettons en place des VPN site-à-site et des accès distants chiffrés, avec authentification renforcée et pare-feu configurés selon vos règles.",
    useCases: ["Agences multi-sites", "Télétravail", "Accès aux caméras à distance", "Prestataires externes"],
    specChips: ["IPsec / SSL", "Double authentification", "Pare-feu"],
    icon: LockKeyhole,
    image: images.services.vpn,
    category: "reseau",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesByUniverse = (u: UniverseId) => services.filter((s) => s.universe === u);
