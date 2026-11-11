import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage, type LegalSection } from "@/components/pages/legal-page";

export const Route = createFileRoute("/cgv")({
  head: () =>
    seo({
      title: "Conditions générales de vente",
      description: "Conditions générales de vente applicables aux commandes passées sur le site PBXcom.",
      path: "/cgv",
      breadcrumbs: [{ name: "CGV", path: "/cgv" }],
    }),
  component: Page,
});

const domain = site.url.replace("https://", "");

// generated — CGV copy, to be validated by PBXcom's legal counsel before launch
const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet",
    body: (
      <p>
        Les présentes conditions générales de vente régissent les ventes de produits et prestations conclues entre {site.legalName}, dont le siège est situé {site.address.full}, et toute personne physique ou morale (« le Client ») passant commande via le site {domain}. Toute commande implique l'acceptation sans réserve des présentes conditions.
      </p>
    ),
  },
  {
    id: "produits",
    title: "Produits et informations",
    body: (
      <>
        <p>Les produits proposés sont décrits avec la plus grande exactitude possible. Les photographies sont non contractuelles. Les caractéristiques techniques sont celles communiquées par les constructeurs.</p>
        <p>Certains produits, en raison de leur nature ou de la configuration qu'ils nécessitent, sont proposés « sur devis » : leur prix est communiqué après échange avec un conseiller.</p>
      </>
    ),
  },
  {
    id: "prix",
    title: "Prix",
    body: (
      <p>
        Les prix sont indiqués en dirhams marocains (MAD), toutes taxes comprises, hors frais de livraison et hors installation. {site.legalName} se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés au prix en vigueur lors de la confirmation de la commande.
      </p>
    ),
  },
  {
    id: "commande",
    title: "Commande",
    body: (
      <>
        <p>
          Le Client constitue son panier puis renseigne ses coordonnées. Le récapitulatif de commande est transmis à {site.legalName} via WhatsApp ou par e-mail. La commande devient ferme après confirmation téléphonique par nos équipes, portant notamment sur la disponibilité des produits, les frais de livraison et le mode de paiement.
        </p>
        <p>{site.legalName} se réserve le droit de refuser toute commande présentant une anomalie ou émanant d'un client avec lequel existe un litige.</p>
      </>
    ),
  },
  {
    id: "paiement",
    title: "Paiement",
    body: (
      <>
        <p>Aucun paiement n'est collecté en ligne. Le Client règle sa commande selon l'un des modes suivants :</p>
        <ul>
          {site.payment.methods.map((m) => (
            <li key={m.id}>
              <strong>{m.label}</strong> : {m.text}
            </li>
          ))}
        </ul>
        <p>Les produits restent la propriété de {site.legalName} jusqu'au paiement intégral du prix.</p>
      </>
    ),
  },
  {
    id: "livraison",
    title: "Livraison",
    body: (
      <p>
        Les modalités de livraison sont détaillées sur la page <Link to="/livraison">Livraison et retours</Link>. Les délais sont donnés à titre indicatif ; un retard ne peut donner lieu à l'annulation de la commande qu'au-delà de 30 jours, sauf accord contraire.
      </p>
    ),
  },
  {
    id: "retractation",
    title: "Droit de rétractation",
    body: (
      <p>
        Conformément à la loi n° 31-08 édictant des mesures de protection du consommateur, le Client consommateur dispose d'un délai de 7 jours à compter de la livraison pour exercer son droit de rétractation, sans avoir à justifier de motif. Les produits doivent être retournés neufs, complets et dans leur emballage d'origine. Ce droit ne s'applique pas aux produits configurés ou installés à la demande du Client.
      </p>
    ),
  },
  {
    id: "garantie",
    title: "Garanties",
    body: (
      <p>
        Les produits bénéficient de la garantie légale contre les vices cachés et de la garantie commerciale du constructeur ({site.warranty.toLowerCase()}). La garantie ne couvre pas les dommages résultant d'une mauvaise utilisation, d'une installation non conforme ou d'une intervention non autorisée.
      </p>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    body: (
      <p>
        {site.legalName} ne saurait être tenue responsable des dommages indirects liés à l'utilisation des produits, ni de l'inexécution de ses obligations en cas de force majeure. La responsabilité de {site.legalName} est limitée au montant de la commande concernée.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    body: (
      <p>
        Les données collectées lors de la commande sont traitées conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel. Voir notre <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    ),
  },
  {
    id: "litiges",
    title: "Droit applicable et litiges",
    body: (
      <p>
        Les présentes conditions sont soumises au droit marocain. En cas de différend, les parties rechercheront une solution amiable. À défaut, compétence est attribuée aux tribunaux de Rabat, sous réserve des dispositions protectrices applicables aux consommateurs.
      </p>
    ),
  },
];

function Page() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      intro="Les règles qui encadrent vos commandes sur le site PBXcom : prix, commande, paiement, livraison et garanties."
      updated="11 novembre 2026"
      sections={sections}
      path="/cgv"
    />
  );
}
