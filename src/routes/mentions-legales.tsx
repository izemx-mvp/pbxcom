import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage, type LegalSection } from "@/components/pages/legal-page";

export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    seo({
      title: "Mentions légales",
      description: "Mentions légales du site PBXcom : éditeur, hébergement, propriété intellectuelle.",
      path: "/mentions-legales",
      breadcrumbs: [{ name: "Mentions légales", path: "/mentions-legales" }],
    }),
  component: Page,
});

// generated — legal notice; registration numbers (RC, ICE, IF) and host details to be added by PBXcom before launch
const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    body: (
      <>
        <p>
          Le site {site.url.replace("https://", "")} est édité par <strong>{site.legalName}</strong>, société de droit marocain spécialisée dans l'intégration de systèmes de sécurité, d'infrastructures réseau et de télécommunications.
        </p>
        <ul>
          <li>Siège : {site.address.full}</li>
          <li>Téléphone : {site.phone.display}</li>
          <li>E-mail : {site.email}</li>
          <li>Les informations d'immatriculation (RC, ICE, IF) sont communiquées sur simple demande.</li>
        </ul>
      </>
    ),
  },
  {
    id: "publication",
    title: "Direction de la publication",
    body: <p>La direction de la publication est assurée par la Direction de {site.legalName}.</p>,
  },
  {
    id: "hebergement",
    title: "Hébergement",
    body: <p>Le site est hébergé par un prestataire d'hébergement professionnel. Ses coordonnées complètes sont disponibles sur demande adressée à {site.email}.</p>,
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    body: (
      <>
        <p>
          L'ensemble des contenus du site (textes, visuels, logo, charte graphique, structure) est la propriété de {site.legalName} ou fait l'objet d'une autorisation d'utilisation. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.
        </p>
        <p>Les marques et logos des constructeurs et des clients cités restent la propriété de leurs titulaires respectifs.</p>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    body: (
      <p>
        {site.legalName} s'efforce d'assurer l'exactitude des informations publiées mais ne peut garantir l'absence d'erreurs ou d'omissions. Les liens vers des sites tiers sont fournis à titre informatif ; {site.legalName} n'exerce aucun contrôle sur leur contenu.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    body: (
      <p>
        Le traitement des données personnelles est décrit dans notre <Link to="/confidentialite">politique de confidentialité</Link>, conformément à la loi n° 09-08.
      </p>
    ),
  },
];

function Page() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Les informations légales relatives à l'éditeur et à l'utilisation du site PBXcom."
      updated="11 novembre 2026"
      sections={sections}
      path="/mentions-legales"
    />
  );
}
