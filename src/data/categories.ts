import { Cable, Cctv, Flame, KeyRound, PhoneCall, Router, Siren, Video, type LucideIcon } from "lucide-react";
import { images, type ImageAsset } from "@/config/images";
import type { UniverseId } from "./services";

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  universe: UniverseId;
  icon: LucideIcon;
  image: ImageAsset;
};

// generated — short texts and descriptions
export const categories: Category[] = [
  {
    slug: "videosurveillance",
    name: "Vidéosurveillance",
    short: "Caméras IP, NVR, kits",
    description: "Caméras IP dôme, bullet et PTZ, enregistreurs NVR et kits complets pour surveiller vos locaux de jour comme de nuit.",
    universe: "securite",
    icon: Cctv,
    image: images.categories.videosurveillance,
  },
  {
    slug: "controle-acces",
    name: "Contrôle d'accès",
    short: "Lecteurs, badges, biométrie",
    description: "Lecteurs de badges, terminaux biométriques, ventouses et badges RFID pour gérer précisément les entrées de vos sites.",
    universe: "securite",
    icon: KeyRound,
    image: images.categories["controle-acces"],
  },
  {
    slug: "alarme",
    name: "Alarme & anti-intrusion",
    short: "Centrales, détecteurs, sirènes",
    description: "Centrales d'alarme, détecteurs de mouvement et d'ouverture, sirènes et claviers pour protéger vos locaux contre l'intrusion.",
    universe: "securite",
    icon: Siren,
    image: images.categories.alarme,
  },
  {
    slug: "incendie",
    name: "Détection incendie",
    short: "Détecteurs, centrales, déclencheurs",
    description: "Détecteurs de fumée et de chaleur, déclencheurs manuels, sirènes flash et centrales pour une détection incendie fiable.",
    universe: "securite",
    icon: Flame,
    image: images.categories.incendie,
  },
  {
    slug: "reseau",
    name: "Réseau",
    short: "Switchs, routeurs, Wi-Fi",
    description: "Switchs manageables PoE, routeurs, pare-feu et points d'accès Wi-Fi 6 pour un réseau professionnel stable et rapide.",
    universe: "reseau",
    icon: Router,
    image: images.categories.reseau,
  },
  {
    slug: "cablage-fibre",
    name: "Câblage & fibre",
    short: "Câbles, baies, fibre optique",
    description: "Câbles Cat6 et Cat6A, baies de brassage, panneaux, jarretières et accessoires fibre optique pour une infrastructure soignée.",
    universe: "reseau",
    icon: Cable,
    image: images.categories["cablage-fibre"],
  },
  {
    slug: "telephonie-ip",
    name: "Téléphonie IP",
    short: "Postes IP, IPBX, casques",
    description: "Téléphones IP, standards IPBX, passerelles et casques professionnels pour moderniser les communications de votre entreprise.",
    universe: "telecom",
    icon: PhoneCall,
    image: images.categories["telephonie-ip"],
  },
  {
    slug: "visioconference",
    name: "Visioconférence",
    short: "Caméras, barres, speakerphones",
    description: "Caméras de conférence, barres vidéo tout-en-un et speakerphones pour des réunions hybrides simples et de qualité.",
    universe: "telecom",
    icon: Video,
    image: images.categories.visioconference,
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
