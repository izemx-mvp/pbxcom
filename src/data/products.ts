import { productImagePath } from "@/config/images";
import type { UniverseId } from "./services";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  universe: UniverseId;
  /** TTC price in MAD — null means "Prix sur demande" */
  price: number | null;
  oldPrice?: number;
  stock: number;
  sku: string;
  shortSpecs: string[];
  specs: Record<string, string>;
  description: string;
  images: string[];
  featured: boolean;
  tags: string[];
  /** ISO date used for "nouveautés" sorting */
  addedAt: string;
  /** Service that installs this product (links to the solutions page) */
  service: string;
};

type ProductInput = Omit<Product, "images" | "id"> & { images?: string[] };

const p = (input: ProductInput): Product => ({
  ...input,
  id: input.sku,
  images: input.images ?? [productImagePath(input.slug)],
});

// generated — the full catalogue below is sample data, structured to be swapped for a WooCommerce / API source
export const products: Product[] = [
  // ───────────── Vidéosurveillance
  p({
    slug: "camera-ip-dome-4mp-netvision-d4",
    name: "Caméra IP dôme 4 MP anti-vandale NV-D4",
    brand: "NetVision",
    category: "videosurveillance",
    universe: "securite",
    price: 890,
    oldPrice: 1050,
    stock: 34,
    sku: "NV-D4-28",
    shortSpecs: ["4 MP", "IR 30 m"],
    specs: {
      Capteur: "1/3\" CMOS progressif 4 MP",
      Objectif: "Fixe 2,8 mm (angle 103°)",
      "Vision nocturne": "Infrarouge jusqu'à 30 m",
      Compression: "H.265+ / H.264",
      Alimentation: "PoE (802.3af) ou 12 V DC",
      Protection: "IP67 / IK10",
      Stockage: "Carte microSD jusqu'à 256 Go",
    },
    description:
      "Caméra dôme compacte et robuste, idéale pour les halls, couloirs et accès. Son boîtier anti-vandale IK10 et son étanchéité IP67 lui permettent d'être installée en intérieur comme en extérieur. La compression H.265+ réduit l'espace de stockage nécessaire sans perte de qualité.",
    featured: true,
    tags: ["caméra", "dôme", "ip", "poe", "extérieur", "camera"],
    addedAt: "2026-03-10",
    service: "videosurveillance",
  }),
  p({
    slug: "camera-ip-bullet-8mp-netvision-b8",
    name: "Caméra IP bullet 4K 8 MP NV-B8 Pro",
    brand: "NetVision",
    category: "videosurveillance",
    universe: "securite",
    price: 1490,
    stock: 18,
    sku: "NV-B8-PRO",
    shortSpecs: ["4K 8 MP", "IR 60 m"],
    specs: {
      Capteur: "1/2,8\" CMOS 8 MP",
      Objectif: "Varifocal motorisé 2,8 – 12 mm",
      "Vision nocturne": "Infrarouge jusqu'à 60 m",
      Analyse: "Détection humain / véhicule, franchissement de ligne",
      Alimentation: "PoE+ (802.3at)",
      Protection: "IP67",
      Température: "-30 °C à +60 °C",
    },
    description:
      "Caméra bullet 4K pour la surveillance des façades, parkings et périmètres. L'objectif varifocal motorisé permet d'ajuster le cadrage à distance, et l'analyse intelligente distingue les personnes des véhicules pour limiter les fausses alertes.",
    featured: true,
    tags: ["caméra", "bullet", "4k", "extérieur", "parking", "camera"],
    addedAt: "2026-06-02",
    service: "videosurveillance",
  }),
  p({
    slug: "enregistreur-nvr-16-voies-netvision",
    name: "Enregistreur NVR 16 voies PoE NV-R16",
    brand: "NetVision",
    category: "videosurveillance",
    universe: "securite",
    price: 3290,
    stock: 9,
    sku: "NV-R16-P",
    shortSpecs: ["16 voies", "16 ports PoE"],
    specs: {
      Voies: "16 caméras IP jusqu'à 12 MP",
      "Ports PoE": "16 ports (budget 200 W)",
      Disques: "2 baies SATA jusqu'à 10 To chacune",
      Sorties: "HDMI 4K + VGA",
      "Accès distant": "Application mobile et navigateur",
      Format: "Rackable 1U",
    },
    description:
      "Le cœur de votre installation de vidéosurveillance. Ce NVR alimente directement jusqu'à 16 caméras grâce à ses ports PoE intégrés, enregistre en continu ou sur détection et vous donne accès aux images en direct depuis votre smartphone.",
    featured: false,
    tags: ["nvr", "enregistreur", "poe", "stockage"],
    addedAt: "2025-11-20",
    service: "videosurveillance",
  }),

  // ───────────── Contrôle d'accès
  p({
    slug: "lecteur-badge-rfid-securlink-r200",
    name: "Lecteur de badges RFID avec clavier SL-R200",
    brand: "SecurLink",
    category: "controle-acces",
    universe: "securite",
    price: 690,
    stock: 42,
    sku: "SL-R200-K",
    shortSpecs: ["Mifare / EM", "Clavier code"],
    specs: {
      Technologies: "EM 125 kHz et Mifare 13,56 MHz",
      Identification: "Badge, code ou badge + code",
      Interface: "Wiegand 26/34",
      Protection: "IP65",
      Alimentation: "12 V DC",
    },
    description:
      "Lecteur polyvalent pour sécuriser une porte d'entrée ou une zone sensible. Il accepte les badges EM et Mifare et peut exiger un code en complément pour les accès les plus sensibles. Compatible avec la majorité des centrales de contrôle d'accès.",
    featured: true,
    tags: ["badge", "lecteur", "rfid", "porte", "accès"],
    addedAt: "2026-02-14",
    service: "controle-acces",
  }),
  p({
    slug: "terminal-biometrique-reconnaissance-faciale-securlink",
    name: "Terminal biométrique reconnaissance faciale SL-Face 5",
    brand: "SecurLink",
    category: "controle-acces",
    universe: "securite",
    price: 2490,
    oldPrice: 2790,
    stock: 11,
    sku: "SL-FACE5",
    shortSpecs: ["Visage + badge", "3 000 profils"],
    specs: {
      Identification: "Visage, empreinte, badge, code",
      Capacité: "3 000 visages / 10 000 badges",
      Écran: "5\" tactile",
      "Pointage": "Export des présences (Excel)",
      Connectivité: "TCP/IP, Wi-Fi, Wiegand",
      Vitesse: "Reconnaissance en moins de 0,5 s",
    },
    description:
      "Contrôle d'accès et pointage du personnel sans contact. Le terminal reconnaît un visage en moins d'une demi-seconde, même avec un masque, et exporte les présences pour la paie. Idéal pour les bureaux, usines et établissements de santé.",
    featured: true,
    tags: ["biométrie", "pointeuse", "visage", "pointage", "badge"],
    addedAt: "2026-05-18",
    service: "controle-acces",
  }),
  p({
    slug: "ventouse-electromagnetique-280kg-securlink",
    name: "Ventouse électromagnétique 280 kg avec support",
    brand: "SecurLink",
    category: "controle-acces",
    universe: "securite",
    price: 420,
    stock: 0,
    sku: "SL-VEM280",
    shortSpecs: ["280 kg", "Contact d'état"],
    specs: {
      "Force de retenue": "280 kg",
      Alimentation: "12 / 24 V DC",
      Consommation: "500 mA sous 12 V",
      Signalisation: "LED et contact d'état de porte",
      Fourniture: "Supports en L et Z inclus",
    },
    description:
      "Ventouse de verrouillage pour portes vitrées, bois ou métal. Livrée avec ses supports de montage, elle s'associe à un lecteur de badges ou à un bouton de sortie pour sécuriser une porte rapidement.",
    featured: false,
    tags: ["ventouse", "porte", "verrouillage"],
    addedAt: "2025-09-03",
    service: "controle-acces",
  }),

  // ───────────── Alarme
  p({
    slug: "kit-alarme-sans-fil-securlink-home",
    name: "Kit alarme sans fil GSM/Wi-Fi SL-Home",
    brand: "SecurLink",
    category: "alarme",
    universe: "securite",
    price: 2190,
    oldPrice: 2490,
    stock: 15,
    sku: "SL-KIT-HOME",
    shortSpecs: ["GSM + Wi-Fi", "Kit 8 éléments"],
    specs: {
      Contenu: "Centrale, 2 détecteurs de mouvement, 2 contacts d'ouverture, sirène, 2 télécommandes",
      Transmission: "GSM 4G et Wi-Fi",
      Application: "Armement et alertes sur smartphone",
      Autonomie: "Batterie de secours 8 h",
      Extension: "Jusqu'à 64 périphériques",
    },
    description:
      "Tout le nécessaire pour protéger un appartement, une villa ou un petit commerce. Installation simple, alertes instantanées sur votre téléphone et armement à distance : votre alarme reste active même en cas de coupure de courant ou d'Internet.",
    featured: true,
    tags: ["alarme", "kit", "sans fil", "villa", "gsm"],
    addedAt: "2026-04-01",
    service: "anti-intrusion",
  }),
  p({
    slug: "detecteur-mouvement-double-technologie",
    name: "Détecteur de mouvement double technologie",
    brand: "SecurLink",
    category: "alarme",
    universe: "securite",
    price: 340,
    stock: 56,
    sku: "SL-PIR-DT",
    shortSpecs: ["IR + hyperfréquence", "Portée 12 m"],
    specs: {
      Technologie: "Infrarouge passif + hyperfréquence",
      Portée: "12 m, angle 90°",
      "Immunité animaux": "Jusqu'à 25 kg",
      Liaison: "Filaire",
      Fonction: "Anti-masque",
    },
    description:
      "La double technologie réduit fortement les fausses alarmes : le détecteur ne se déclenche que si l'infrarouge et l'hyperfréquence confirment une présence. Parfait pour les entrepôts, bureaux et locaux techniques.",
    featured: false,
    tags: ["détecteur", "mouvement", "alarme", "pir"],
    addedAt: "2025-10-12",
    service: "anti-intrusion",
  }),
  p({
    slug: "sirene-exterieure-flash-securlink",
    name: "Sirène extérieure avec flash 110 dB",
    brand: "SecurLink",
    category: "alarme",
    universe: "securite",
    price: 560,
    stock: 23,
    sku: "SL-SIR-EXT",
    shortSpecs: ["110 dB", "Flash LED"],
    specs: {
      Puissance: "110 dB à 1 m",
      Signalisation: "Flash LED",
      Protection: "Autoprotection à l'ouverture et à l'arrachement",
      Batterie: "Batterie de secours intégrée",
      Indice: "IP54",
    },
    description:
      "Sirène dissuasive pour façade, avec flash visible de loin et autoprotection contre le sabotage. Compatible avec les centrales filaires du marché.",
    featured: false,
    tags: ["sirène", "alarme", "extérieur"],
    addedAt: "2025-08-21",
    service: "anti-intrusion",
  }),

  // ───────────── Incendie
  p({
    slug: "detecteur-fumee-optique-adressable",
    name: "Détecteur de fumée optique adressable",
    brand: "Ignis Pro",
    category: "incendie",
    universe: "securite",
    price: 380,
    stock: 64,
    sku: "IG-DO-ADR",
    shortSpecs: ["Adressable", "Optique"],
    specs: {
      Principe: "Détection optique de fumée",
      Technologie: "Adressable, isolateur intégré",
      Couverture: "Jusqu'à 60 m²",
      Signalisation: "LED 360°",
      Socle: "Socle universel inclus",
    },
    description:
      "Détecteur adressable qui indique précisément la pièce concernée sur la centrale, pour une intervention plus rapide. Son isolateur intégré protège la boucle en cas de court-circuit.",
    featured: false,
    tags: ["détecteur", "fumée", "incendie", "adressable"],
    addedAt: "2026-01-09",
    service: "incendie",
  }),
  p({
    slug: "declencheur-manuel-reamorcable",
    name: "Déclencheur manuel réarmable rouge",
    brand: "Ignis Pro",
    category: "incendie",
    universe: "securite",
    price: 260,
    stock: 38,
    sku: "IG-DM-R",
    shortSpecs: ["Réarmable", "Membrane"],
    specs: {
      Type: "Réarmable par clé",
      Compatibilité: "Conventionnel et adressable",
      Montage: "Saillie ou encastré",
      Protection: "Capot de protection fourni",
    },
    description:
      "Déclencheur manuel pour l'alarme incendie, réarmable avec la clé fournie : pas de verre à remplacer après un test ou une alerte. Livré avec capot de protection contre les déclenchements accidentels.",
    featured: false,
    tags: ["déclencheur", "incendie", "manuel"],
    addedAt: "2025-07-15",
    service: "incendie",
  }),
  p({
    slug: "centrale-incendie-adressable-2-boucles",
    name: "Centrale de détection incendie adressable 2 boucles",
    brand: "Ignis Pro",
    category: "incendie",
    universe: "securite",
    price: null,
    stock: 4,
    sku: "IG-CDI-2B",
    shortSpecs: ["2 boucles", "250 points"],
    specs: {
      Boucles: "2 boucles, 125 points par boucle",
      Écran: "LCD rétroéclairé",
      Journal: "Historique de 2 000 événements",
      Sorties: "Relais programmables",
      Alimentation: "230 V avec batteries de secours",
    },
    description:
      "Centrale adressable pour les bâtiments de moyenne et grande taille. Son dimensionnement dépend de votre site : nous vous proposons une étude et un devis incluant la programmation et la mise en service.",
    featured: true,
    tags: ["centrale", "incendie", "adressable"],
    addedAt: "2026-02-28",
    service: "incendie",
  }),

  // ───────────── Réseau
  p({
    slug: "switch-24-ports-poe-manageable-linkcore",
    name: "Switch manageable 24 ports PoE+ LC-S24P",
    brand: "LinkCore",
    category: "reseau",
    universe: "reseau",
    price: 4290,
    oldPrice: 4690,
    stock: 12,
    sku: "LC-S24P-4X",
    shortSpecs: ["24 ports PoE+", "4 SFP+"],
    specs: {
      Ports: "24 × Gigabit PoE+ et 4 × SFP+ 10 G",
      "Budget PoE": "370 W",
      Administration: "Web, CLI, SNMP",
      Fonctions: "VLAN, QoS, LACP, IGMP snooping",
      Format: "Rackable 1U",
    },
    description:
      "Switch professionnel pour alimenter caméras, téléphones IP et points d'accès Wi-Fi depuis une seule baie. Les liens SFP+ 10 G assurent un raccordement rapide au cœur de réseau ou à la fibre.",
    featured: true,
    tags: ["switch", "poe", "réseau", "manageable", "vlan"],
    addedAt: "2026-05-05",
    service: "routage",
  }),
  p({
    slug: "point-acces-wifi-6-plafond-linkcore",
    name: "Point d'accès Wi-Fi 6 plafond LC-AX3000",
    brand: "LinkCore",
    category: "reseau",
    universe: "reseau",
    price: 1390,
    stock: 27,
    sku: "LC-AX3000",
    shortSpecs: ["Wi-Fi 6", "AX3000"],
    specs: {
      Norme: "Wi-Fi 6 (802.11ax) bi-bande",
      Débit: "Jusqu'à 3 000 Mb/s",
      Utilisateurs: "Plus de 150 connexions simultanées",
      Alimentation: "PoE+",
      Gestion: "Contrôleur cloud ou local",
      Fonctions: "Itinérance, portail captif, réseau invités",
    },
    description:
      "Point d'accès discret pour bureaux, hôtels et espaces recevant du public. Géré de façon centralisée, il permet une itinérance fluide entre bornes et la création d'un réseau invités isolé avec portail personnalisé.",
    featured: true,
    tags: ["wifi", "wi-fi", "point d'accès", "hôtel", "borne"],
    addedAt: "2026-06-20",
    service: "wifi",
  }),
  p({
    slug: "routeur-pare-feu-vpn-linkcore",
    name: "Routeur pare-feu VPN multi-WAN LC-G500",
    brand: "LinkCore",
    category: "reseau",
    universe: "reseau",
    price: 2890,
    stock: 8,
    sku: "LC-G500",
    shortSpecs: ["Dual WAN", "VPN IPsec"],
    specs: {
      Ports: "2 WAN + 4 LAN Gigabit",
      VPN: "IPsec, OpenVPN, WireGuard (50 tunnels)",
      Sécurité: "Pare-feu SPI, filtrage web",
      "Équilibrage": "Répartition de charge et bascule automatique",
      Débit: "Pare-feu 900 Mb/s",
    },
    description:
      "Le routeur idéal pour les PME et agences : il combine deux accès Internet avec bascule automatique, un pare-feu et des tunnels VPN pour relier vos sites et vos collaborateurs en télétravail.",
    featured: false,
    tags: ["routeur", "vpn", "pare-feu", "firewall"],
    addedAt: "2025-12-11",
    service: "vpn",
  }),

  // ───────────── Câblage & fibre
  p({
    slug: "cable-cat6a-ftp-305m-linkcore",
    name: "Câble Cat6A F/FTP LSZH — touret 305 m",
    brand: "LinkCore",
    category: "cablage-fibre",
    universe: "reseau",
    price: 2650,
    stock: 20,
    sku: "LC-C6A-305",
    shortSpecs: ["Cat6A", "LSZH"],
    specs: {
      Catégorie: "Cat6A, 500 MHz",
      Blindage: "F/FTP (paires écrantées)",
      Gaine: "LSZH sans halogène",
      Conducteur: "Cuivre massif AWG23",
      Longueur: "305 m",
    },
    description:
      "Câble blindé haute performance pour les réseaux 10 Gigabit. Sa gaine sans halogène est recommandée dans les bâtiments recevant du public.",
    featured: false,
    tags: ["câble", "cat6a", "rj45", "cuivre"],
    addedAt: "2025-10-30",
    service: "cablage-cuivre",
  }),
  p({
    slug: "baie-brassage-19-pouces-24u",
    name: "Baie de brassage 19\" 24U porte vitrée",
    brand: "LinkCore",
    category: "cablage-fibre",
    universe: "reseau",
    price: 3450,
    stock: 6,
    sku: "LC-BAIE-24U",
    shortSpecs: ["24U", "600 × 600"],
    specs: {
      Hauteur: "24U",
      Dimensions: "600 × 600 mm",
      Porte: "Vitrée avec serrure",
      Ventilation: "Toit ventilé, 2 ventilateurs",
      Charge: "Jusqu'à 600 kg",
    },
    description:
      "Baie de brassage pour organiser switchs, panneaux et enregistreurs dans un espace propre et ventilé. Panneaux latéraux démontables pour faciliter l'installation.",
    featured: false,
    tags: ["baie", "rack", "armoire", "brassage"],
    addedAt: "2026-01-25",
    service: "cablage-cuivre",
  }),
  p({
    slug: "tiroir-optique-24-fo-optiwave",
    name: "Tiroir optique 24 FO SC/APC équipé",
    brand: "OptiWave",
    category: "cablage-fibre",
    universe: "reseau",
    price: 1190,
    stock: 14,
    sku: "OW-TO24-SC",
    shortSpecs: ["24 fibres", "SC/APC"],
    specs: {
      Capacité: "24 fibres",
      Connecteurs: "SC/APC (traversées et pigtails inclus)",
      Format: "1U coulissant",
      Compatibilité: "Monomode OS2",
      Fourniture: "Cassettes d'épissure incluses",
    },
    description:
      "Tiroir optique coulissant livré équipé, pour terminer proprement une liaison fibre dans votre baie. Il simplifie les opérations de maintenance grâce à son ouverture frontale.",
    featured: false,
    tags: ["fibre", "tiroir", "optique"],
    addedAt: "2026-04-17",
    service: "fibre-optique",
  }),

  // ───────────── Téléphonie IP
  p({
    slug: "telephone-ip-voxline-v300",
    name: "Téléphone IP couleur 6 lignes VX-300",
    brand: "VoxLine",
    category: "telephonie-ip",
    universe: "telecom",
    price: 990,
    stock: 46,
    sku: "VX-300-C",
    shortSpecs: ["6 lignes SIP", "PoE"],
    specs: {
      Lignes: "6 comptes SIP",
      Écran: "Couleur 2,8\"",
      Audio: "HD Voice, mains-libres full duplex",
      Réseau: "2 ports Gigabit, PoE",
      Compatibilité: "Standards IPBX SIP du marché",
    },
    description:
      "Téléphone de bureau polyvalent, clair et confortable, compatible avec la plupart des standards IP. Alimenté directement par le réseau (PoE), il s'installe en quelques minutes.",
    featured: true,
    tags: ["téléphone", "ip", "poste", "sip", "telephone"],
    addedAt: "2026-03-22",
    service: "telephonie-ip",
  }),
  p({
    slug: "standard-ipbx-voxline-50-postes",
    name: "Standard IPBX VoxLine jusqu'à 50 postes",
    brand: "VoxLine",
    category: "telephonie-ip",
    universe: "telecom",
    price: null,
    stock: 5,
    sku: "VX-PBX-50",
    shortSpecs: ["50 postes", "Accueil vocal"],
    specs: {
      Capacité: "50 utilisateurs, 15 appels simultanés",
      Fonctions: "Accueil vocal, files d'attente, enregistrement",
      Lignes: "Trunk SIP et passerelles analogiques",
      Messagerie: "Messagerie vocale par e-mail",
      Administration: "Interface web",
    },
    description:
      "Standard téléphonique complet pour PME, hôtels et agences. La configuration dépend de votre organisation : nous vous proposons un devis incluant le paramétrage de l'accueil vocal et la formation de vos équipes.",
    featured: false,
    tags: ["ipbx", "standard", "pbx", "téléphonie"],
    addedAt: "2026-02-05",
    service: "telephonie-ip",
  }),
  p({
    slug: "casque-pro-duo-usb-voxline",
    name: "Casque professionnel duo USB antibruit",
    brand: "VoxLine",
    category: "telephonie-ip",
    universe: "telecom",
    price: 650,
    oldPrice: 760,
    stock: 31,
    sku: "VX-HS-DUO",
    shortSpecs: ["Duo", "Antibruit"],
    specs: {
      Port: "Binaural (2 écouteurs)",
      Micro: "Antibruit, perche flexible",
      Connexion: "USB-A et jack 3,5 mm",
      Commandes: "Volume et sourdine sur le câble",
      Poids: "110 g",
    },
    description:
      "Casque confortable pour une utilisation prolongée en centre d'appels ou en télétravail. Son micro antibruit isole la voix de l'environnement sonore.",
    featured: false,
    tags: ["casque", "headset", "centre d'appels", "voip"],
    addedAt: "2026-06-11",
    service: "voip",
  }),

  // ───────────── Visioconférence
  p({
    slug: "barre-visio-4k-meetsphere",
    name: "Barre de visioconférence 4K MeetSphere Bar",
    brand: "MeetSphere",
    category: "visioconference",
    universe: "telecom",
    price: 7990,
    stock: 7,
    sku: "MS-BAR-4K",
    shortSpecs: ["4K", "Auto-cadrage"],
    specs: {
      Caméra: "4K, champ de vision 120°",
      Cadrage: "Auto-cadrage et suivi de l'orateur",
      Audio: "6 micros beamforming, haut-parleurs intégrés",
      Connexion: "USB-C, HDMI",
      Salle: "Jusqu'à 10 personnes",
    },
    description:
      "Caméra, micros et haut-parleurs réunis dans une seule barre : branchez-la à votre ordinateur et lancez vos réunions sur les principales plateformes. Parfaite pour les salles de 4 à 10 personnes.",
    featured: true,
    tags: ["visio", "visioconférence", "caméra", "réunion", "barre"],
    addedAt: "2026-07-01",
    service: "visioconference",
  }),
  p({
    slug: "speakerphone-bluetooth-meetsphere",
    name: "Speakerphone USB / Bluetooth MeetSphere Halo",
    brand: "MeetSphere",
    category: "visioconference",
    universe: "telecom",
    price: 1890,
    stock: 19,
    sku: "MS-HALO",
    shortSpecs: ["360°", "Bluetooth"],
    specs: {
      Micros: "4 micros omnidirectionnels 360°",
      Portée: "Captation jusqu'à 3 m",
      Connexion: "USB-C et Bluetooth",
      Autonomie: "15 h",
      Usage: "Petites salles et bureaux",
    },
    description:
      "Un son clair pour vos appels et réunions en petit comité. Posez-le au centre de la table : ses micros captent chaque participant et réduisent l'écho.",
    featured: false,
    tags: ["speakerphone", "audio", "réunion", "micro"],
    addedAt: "2026-03-30",
    service: "visioconference",
  }),
  p({
    slug: "kit-salle-visio-meetsphere-room",
    name: "Kit salle de visioconférence MeetSphere Room",
    brand: "MeetSphere",
    category: "visioconference",
    universe: "telecom",
    price: null,
    stock: 3,
    sku: "MS-ROOM-KIT",
    shortSpecs: ["PTZ 12×", "Micros plafond"],
    specs: {
      Caméra: "PTZ zoom optique 12×",
      Audio: "Micros de plafond et processeur audio",
      Contrôle: "Tablette tactile de salle",
      Salle: "Jusqu'à 20 personnes",
      Installation: "Câblage et intégration inclus",
    },
    description:
      "Solution complète pour les grandes salles de réunion et salles de conseil. Chaque kit est adapté à l'acoustique et à la configuration de votre salle : demandez une étude gratuite.",
    featured: false,
    tags: ["visio", "salle", "conférence", "ptz"],
    addedAt: "2026-05-27",
    service: "visioconference",
  }),
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
export const priceBounds = (() => {
  const prices = products.map((p) => p.price).filter((v): v is number => v !== null);
  return { min: Math.floor(Math.min(...prices) / 100) * 100, max: Math.ceil(Math.max(...prices) / 100) * 100 };
})();

export const relatedProducts = (product: Product, limit = 4) =>
  [
    ...products.filter((p) => p.category === product.category && p.slug !== product.slug),
    ...products.filter((p) => p.universe === product.universe && p.category !== product.category),
  ].slice(0, limit);
