import type { ImageAsset } from "@/config/images";
import type { ServiceSlug } from "./services";
import { getSector, type SectorSlug } from "./sectors";

export type Project = {
  id: string;
  title: string;
  sector: SectorSlug;
  scope: string;
  solutions: ServiceSlug[];
  highlights: string[];
  image: ImageAsset;
};

const sectorImage = (slug: SectorSlug) => getSector(slug)!.image;

// generated — representative projects, no client names
export const projects: Project[] = [
  {
    id: "hotel-4-etoiles",
    title: "Hôtel 4★ — vidéosurveillance IP & Wi-Fi",
    sector: "hotel",
    scope: "Couverture Wi-Fi de 120 chambres et des espaces communs, vidéosurveillance des accès et du parking.",
    solutions: ["wifi", "videosurveillance", "telephonie-ip"],
    highlights: ["Étude de couverture radio", "Réseau invités avec portail captif", "Travaux par étages, sans fermeture"],
    image: sectorImage("hotel"),
  },
  {
    id: "siege-entreprise",
    title: "Siège d'entreprise — contrôle d'accès & téléphonie IP",
    sector: "entreprise",
    scope: "Contrôle d'accès par badge sur 4 niveaux, migration du standard vers un IPBX et câblage Cat6A.",
    solutions: ["controle-acces", "telephonie-ip", "cablage-cuivre"],
    highlights: ["Droits d'accès par service", "Migration sans perte de numéros", "Baie de brassage refaite à neuf"],
    image: sectorImage("entreprise"),
  },
  {
    id: "collectivite-interconnexion",
    title: "Collectivité — interconnexion fibre des annexes",
    sector: "collectivite",
    scope: "Liaison fibre optique entre le bâtiment principal et trois annexes, vidéosurveillance des entrées.",
    solutions: ["fibre-optique", "videosurveillance", "vpn"],
    highlights: ["Liaisons monomode testées OTDR", "Supervision centralisée", "Accès sécurisé pour les services"],
    image: sectorImage("collectivite"),
  },
  {
    id: "residence-securisee",
    title: "Résidence fermée — accès véhicules & vidéosurveillance",
    sector: "residence",
    scope: "Contrôle d'accès piétons et véhicules, caméras sur les parkings et parties communes, poste de gardiennage.",
    solutions: ["controle-acces", "videosurveillance", "anti-intrusion"],
    highlights: ["Badges résidents et visiteurs", "Lecture des images depuis la loge", "Alarme des locaux techniques"],
    image: sectorImage("residence"),
  },
  {
    id: "clinique-privee",
    title: "Clinique privée — détection incendie & réseau",
    sector: "sante",
    scope: "Système de détection incendie adressable, réseau segmenté pour les équipements médicaux et accès restreints.",
    solutions: ["incendie", "routage", "controle-acces"],
    highlights: ["Centrale adressable 2 boucles", "VLAN dédiés aux équipements", "Contrat de maintenance annuel"],
    image: sectorImage("sante"),
  },
  {
    id: "plateforme-logistique",
    title: "Plateforme logistique — caméras longue portée & Wi-Fi",
    sector: "transport",
    scope: "Vidéosurveillance du périmètre et des quais, Wi-Fi pour terminaux de préparation, fibre entre entrepôts.",
    solutions: ["videosurveillance", "wifi", "fibre-optique"],
    highlights: ["Caméras 4K avec analyse", "Couverture Wi-Fi des allées", "Backbone fibre inter-bâtiments"],
    image: sectorImage("transport"),
  },
];
