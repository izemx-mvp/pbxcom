import { Network, PhoneCall, ShieldCheck, type LucideIcon } from "lucide-react";
import { images, type ImageAsset } from "@/config/images";
import { servicesByUniverse, type UniverseId } from "./services";

export type { UniverseId };

export type Universe = {
  id: UniverseId;
  number: string;
  name: string;
  navName: string;
  title: string;
  highlight: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  image: ImageAsset;
  categories: string[];
};

export const universes: Universe[] = [
  {
    id: "securite",
    number: "01",
    name: "Sécurité",
    navName: "Sécurité",
    title: "Protéger vos personnes, vos biens et vos sites",
    highlight: "Protéger",
    tagline: "Vidéosurveillance, contrôle d'accès, anti-intrusion et détection incendie.",
    // generated
    description:
      "Des systèmes de sécurité électronique pensés comme un tout : chaque caméra, chaque lecteur de badge et chaque détecteur est choisi, placé et paramétré pour répondre à un risque précis. Nous assurons l'étude, la fourniture, l'installation et la maintenance.",
    icon: ShieldCheck,
    image: images.universes.securite,
    categories: ["videosurveillance", "controle-acces", "alarme", "incendie"],
  },
  {
    id: "reseau",
    number: "02",
    name: "Infrastructure Réseau",
    navName: "Infrastructure Réseau",
    title: "Un réseau rapide, stable et prêt pour demain",
    highlight: "rapide",
    tagline: "Routage, Wi-Fi professionnel, câblage cuivre et fibre optique.",
    // generated
    description:
      "Le réseau est le système nerveux de votre activité. Du câblage structuré à la fibre entre bâtiments, en passant par le Wi-Fi et la commutation, nous construisons des infrastructures propres, documentées et dimensionnées pour évoluer avec vous.",
    icon: Network,
    image: images.universes.reseau,
    categories: ["reseau", "cablage-fibre"],
  },
  {
    id: "telecom",
    number: "03",
    name: "Télécommunication",
    navName: "Télécommunication",
    title: "Des communications claires, partout et pour tous",
    highlight: "claires",
    tagline: "Téléphonie IP, visioconférence, VoIP et VPN.",
    // generated
    description:
      "Standard téléphonique IP, salles de visioconférence, solutions pour centres d'appels et interconnexion sécurisée de vos sites : nous modernisons vos communications pour que vos équipes et vos clients restent joignables, où qu'ils soient.",
    icon: PhoneCall,
    image: images.universes.telecom,
    categories: ["telephonie-ip", "visioconference"],
  },
];

export const universeIds: UniverseId[] = ["securite", "reseau", "telecom"];
export const getUniverse = (id: string) => universes.find((u) => u.id === id);
export const universeServices = (id: UniverseId) => servicesByUniverse(id);
