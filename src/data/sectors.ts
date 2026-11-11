import { Building2, HeartPulse, Hotel, House, Landmark, TrainFront, type LucideIcon } from "lucide-react";
import { images, type ImageAsset } from "@/config/images";
import type { ServiceSlug } from "./services";

export type SectorSlug = "entreprise" | "hotel" | "collectivite" | "residence" | "sante" | "transport";

export type Sector = {
  slug: SectorSlug;
  name: string;
  short: string;
  description: string;
  needs: string[];
  solutions: ServiceSlug[];
  icon: LucideIcon;
  image: ImageAsset;
};

// generated — descriptions and needs
export const sectors: Sector[] = [
  {
    slug: "entreprise",
    name: "Entreprise",
    short: "Bureaux, sièges et agences",
    description:
      "Des locaux sécurisés, un réseau fiable et une téléphonie moderne : les fondations dont vos équipes ont besoin pour travailler sereinement, sur un ou plusieurs sites.",
    needs: [
      "Contrôler les accès aux bureaux et aux zones sensibles",
      "Un réseau et un Wi-Fi performants pour tous les collaborateurs",
      "Un standard téléphonique professionnel et évolutif",
      "Relier les agences et le télétravail en toute sécurité",
    ],
    solutions: ["controle-acces", "wifi", "telephonie-ip", "vpn", "videosurveillance"],
    icon: Building2,
    image: images.sectors.entreprise,
  },
  {
    slug: "hotel",
    name: "Hôtel",
    short: "Hôtels, riads et résidences touristiques",
    description:
      "L'expérience client passe par un Wi-Fi irréprochable et une sécurité discrète. Nous équipons les établissements hôteliers de bout en bout, en limitant la gêne pour les clients pendant les travaux.",
    needs: [
      "Un Wi-Fi fluide dans toutes les chambres et espaces communs",
      "Une vidéosurveillance discrète des accès et parkings",
      "Des téléphones IP en chambre et à la réception",
      "Une détection incendie conforme pour l'accueil du public",
    ],
    solutions: ["wifi", "videosurveillance", "telephonie-ip", "incendie", "controle-acces"],
    icon: Hotel,
    image: images.sectors.hotel,
  },
  {
    slug: "collectivite",
    name: "Commune – Collectivité",
    short: "Communes, administrations et services publics",
    description:
      "Les bâtiments publics accueillent des usagers et des agents chaque jour. Nous les aidons à sécuriser leurs sites, moderniser leurs communications et interconnecter leurs services.",
    needs: [
      "Sécuriser les bâtiments administratifs et les espaces publics",
      "Gérer les accès des agents et des visiteurs",
      "Interconnecter les services et annexes",
      "Moderniser l'accueil téléphonique des usagers",
    ],
    solutions: ["videosurveillance", "controle-acces", "fibre-optique", "telephonie-ip", "vpn"],
    icon: Landmark,
    image: images.sectors.collectivite,
  },
  {
    slug: "residence",
    name: "Résidence",
    short: "Résidences, immeubles et villas",
    description:
      "Les résidents attendent tranquillité et confort. Contrôle des entrées, vidéosurveillance des parties communes et alarmes : nous sécurisons les résidences sans compliquer la vie quotidienne.",
    needs: [
      "Filtrer les entrées des piétons et des véhicules",
      "Surveiller les parkings et parties communes",
      "Protéger les logements contre l'intrusion",
      "Un réseau pour la loge du gardien et les équipements communs",
    ],
    solutions: ["controle-acces", "videosurveillance", "anti-intrusion", "cablage-cuivre"],
    icon: House,
    image: images.sectors.residence,
  },
  {
    slug: "sante",
    name: "Santé",
    short: "Cliniques, cabinets et laboratoires",
    description:
      "Dans un établissement de santé, la fiabilité est non négociable. Nous déployons des infrastructures robustes pour protéger les patients, les équipes et les données médicales.",
    needs: [
      "Une détection incendie fiable et entretenue",
      "Restreindre l'accès aux pharmacies, blocs et archives",
      "Un réseau stable pour les équipements et logiciels médicaux",
      "Une téléphonie efficace entre services et avec les patients",
    ],
    solutions: ["incendie", "controle-acces", "routage", "telephonie-ip", "videosurveillance"],
    icon: HeartPulse,
    image: images.sectors.sante,
  },
  {
    slug: "transport",
    name: "Transport",
    short: "Logistique, gares, ports et flottes",
    description:
      "Les sites de transport et de logistique sont étendus, ouverts et actifs en continu. Nous concevons des solutions qui couvrent de grandes surfaces et résistent aux conditions extérieures.",
    needs: [
      "Une vidéosurveillance longue portée sur de grandes surfaces",
      "Relier des bâtiments éloignés par fibre optique",
      "Contrôler les accès aux quais, dépôts et zones techniques",
      "Un Wi-Fi industriel pour les terminaux mobiles",
    ],
    solutions: ["videosurveillance", "fibre-optique", "controle-acces", "wifi", "routage"],
    icon: TrainFront,
    image: images.sectors.transport,
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);
