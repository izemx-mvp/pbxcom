import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage, type LegalSection } from "@/components/pages/legal-page";

export const Route = createFileRoute("/confidentialite")({
  head: () =>
    seo({
      title: "Politique de confidentialité",
      description: "Comment PBXcom collecte, utilise et protège vos données personnelles, conformément à la loi 09-08.",
      path: "/confidentialite",
      breadcrumbs: [{ name: "Confidentialité", path: "/confidentialite" }],
    }),
  component: Page,
});

// generated — privacy policy copy, to be validated by PBXcom (add CNDP declaration reference if applicable)
const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Responsable du traitement",
    body: (
      <p>
        Le responsable du traitement des données collectées sur ce site est {site.legalName}, {site.address.full}. Pour toute question : {site.email}.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "Données collectées",
    body: (
      <>
        <p>Nous collectons uniquement les données que vous nous transmettez volontairement via nos formulaires (commande, devis, contact, newsletter) ou notre assistant :</p>
        <ul>
          <li>Identité : nom, entreprise, ICE le cas échéant.</li>
          <li>Coordonnées : téléphone, e-mail, ville et adresse de livraison.</li>
          <li>Informations sur votre projet ou votre commande.</li>
        </ul>
      </>
    ),
  },
  {
    id: "finalites",
    title: "Finalités",
    body: (
      <ul>
        <li>Traiter vos commandes et demandes de devis, et vous recontacter.</li>
        <li>Assurer la livraison, l'installation et le service après-vente.</li>
        <li>Vous adresser nos informations si vous vous êtes inscrit à la newsletter.</li>
      </ul>
    ),
  },
  {
    id: "whatsapp",
    title: "Transmission via WhatsApp",
    body: (
      <p>
        Nos formulaires ne stockent aucune donnée sur nos serveurs : ils préparent un message que vous envoyez vous-même via WhatsApp (ou par e-mail). Ce message est alors soumis aux conditions de confidentialité de WhatsApp ou de votre messagerie.
      </p>
    ),
  },
  {
    id: "stockage",
    title: "Stockage local",
    body: (
      <p>
        Le site utilise le stockage de votre navigateur pour conserver votre panier, les produits récemment consultés et l'historique de votre conversation avec l'assistant. Ces données restent sur votre appareil et ne nous sont pas transmises. Le site n'utilise pas de cookies publicitaires.
      </p>
    ),
  },
  {
    id: "conservation",
    title: "Durée de conservation",
    body: (
      <p>
        Les données liées à une commande ou à un devis sont conservées pendant la durée nécessaire à la relation commerciale et aux obligations légales. Les données de prospection sont conservées au maximum 3 ans après le dernier contact.
      </p>
    ),
  },
  {
    id: "droits",
    title: "Vos droits",
    body: (
      <p>
        Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition. Pour l'exercer, écrivez-nous à {site.email} ou à l'adresse de notre siège. Vous pouvez également saisir la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP).
      </p>
    ),
  },
  {
    id: "securite",
    title: "Sécurité",
    body: <p>{site.legalName} met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.</p>,
  },
];

function Page() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Vos données vous appartiennent. Voici comment nous les utilisons et les protégeons, conformément à la loi 09-08."
      updated="11 novembre 2026"
      sections={sections}
      path="/confidentialite"
    />
  );
}
