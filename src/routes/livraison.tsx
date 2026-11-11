import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage, type LegalSection } from "@/components/pages/legal-page";

export const Route = createFileRoute("/livraison")({
  head: () =>
    seo({
      title: "Livraison et retours",
      description: "Délais, zones et frais de livraison des commandes PBXcom partout au Maroc, retours et garantie des produits.",
      path: "/livraison",
      breadcrumbs: [{ name: "Livraison", path: "/livraison" }],
    }),
  component: Page,
});

// generated — delivery policy copy, to be validated by PBXcom
const sections: LegalSection[] = [
  {
    id: "zones",
    title: "Zones de livraison",
    body: (
      <>
        <p>
          PBXcom livre ses produits sur l'ensemble du territoire marocain, depuis ses locaux de {site.address.district}, {site.address.city}.
        </p>
        <ul>
          <li>Rabat, Salé, Témara et environs : livraison par nos soins ou par coursier.</li>
          <li>Casablanca, Kénitra, Fès, Meknès, Tanger, Marrakech, Agadir et grandes villes : livraison par transporteur partenaire.</li>
          <li>Autres localités : livraison par transporteur, délai confirmé à la commande.</li>
        </ul>
      </>
    ),
  },
  {
    id: "delais",
    title: "Délais",
    body: (
      <>
        <p>{site.delivery.text}</p>
        <p>
          Les délais courent à compter de la confirmation téléphonique de la commande et, en cas de virement, de la réception du paiement. Les produits sur devis ou commandés spécialement font l'objet d'un délai communiqué au cas par cas.
        </p>
      </>
    ),
  },
  {
    id: "frais",
    title: "Frais de livraison",
    body: (
      <p>
        Les frais de livraison dépendent de la destination, du poids et du volume de la commande. Ils vous sont communiqués lors de l'appel de confirmation, avant tout engagement de votre part. Aucun frais ne vous est facturé sans votre accord préalable.
      </p>
    ),
  },
  {
    id: "reception",
    title: "Réception de la commande",
    body: (
      <>
        <p>
          À la réception, vérifiez l'état des colis en présence du livreur. En cas de colis endommagé ou incomplet, émettez des réserves précises sur le bon de livraison et prévenez-nous sous 48h par téléphone, WhatsApp ou e-mail à {site.email}.
        </p>
        <p>En cas de paiement à la livraison, le règlement s'effectue en espèces ou par chèque au moment de la remise des produits.</p>
      </>
    ),
  },
  {
    id: "installation",
    title: "Installation",
    body: (
      <p>
        Si vous avez coché « J'ai besoin de l'installation », un technicien vous contacte pour planifier l'intervention. L'installation fait l'objet d'un devis distinct, établi gratuitement selon la configuration de votre site.
      </p>
    ),
  },
  {
    id: "retours",
    title: "Retours et échanges",
    body: (
      <>
        <p>
          Vous disposez d'un délai de 7 jours à compter de la réception pour nous signaler votre souhait de retourner un produit, conformément à la loi n° 31-08 édictant des mesures de protection du consommateur.
        </p>
        <ul>
          <li>Le produit doit être retourné neuf, complet et dans son emballage d'origine.</li>
          <li>Les produits installés, configurés sur mesure ou commandés spécialement ne peuvent être repris, sauf défaut.</li>
          <li>Les frais de retour sont à la charge du client, sauf produit défectueux ou erreur de notre part.</li>
        </ul>
      </>
    ),
  },
  {
    id: "garantie",
    title: "Garantie",
    body: (
      <p>
        {site.warranty}. En cas de panne, contactez-nous : nous assurons le diagnostic et la prise en charge auprès du constructeur. Consultez également nos <Link to="/cgv">conditions générales de vente</Link>.
      </p>
    ),
  },
];

function Page() {
  return (
    <LegalPage
      title="Livraison et retours"
      intro="Tout savoir sur la livraison de vos équipements partout au Maroc, les retours et la garantie."
      updated="11 novembre 2026"
      sections={sections}
      path="/livraison"
    />
  );
}
