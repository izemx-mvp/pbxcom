import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { HomeHero } from "@/components/home/hero";
import { FeaturedProducts, ReferencesMarquee, ServicesGrid, UniversesBento } from "@/components/home/sections-a";
import { AboutTeaser, ProcessSteps, ProjectConfigurator, QuoteSection, SectorsSplit, WhyPbxcom } from "@/components/home/sections-b";
import { CTABand } from "@/components/site/blocks";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: `PBXcom — Sécurité, Réseau, Télécom à Rabat | Devis en moins de 4h`,
      description: `${site.slogan}. Vidéosurveillance, contrôle d'accès, réseau, Wi-Fi, fibre, téléphonie IP : intégrateur depuis 2006 à Rabat. Boutique en ligne et devis gratuit en moins de 4h.`,
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HomeHero />
      <ReferencesMarquee />
      <UniversesBento />
      <ServicesGrid />
      <SectorsSplit />
      <FeaturedProducts />
      <WhyPbxcom />
      <ProcessSteps />
      <ProjectConfigurator />
      <AboutTeaser />
      <QuoteSection />
      <CTABand
        tone="green"
        title="Un projet de sécurité, réseau ou télécom ?"
        text="Parlons-en dès aujourd'hui : estimation gratuite, sans engagement, et une réponse en moins de 4h."
      />
    </>
  );
}