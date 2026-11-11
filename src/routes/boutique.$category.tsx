import { createFileRoute, notFound } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { getCategory } from "@/data/categories";
import { ShopListing } from "@/components/shop/shop-listing";

export const Route = createFileRoute("/boutique/$category")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { slug: category.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? getCategory(loaderData.slug) : undefined;
    if (!c) return {};
    return seo({
      title: `${c.name} — Boutique`,
      description: `${c.description} Prix TTC, livraison partout au Maroc, installation possible par nos techniciens.`,
      path: `/boutique/${c.slug}`,
      image: c.image.src,
      breadcrumbs: [
        { name: "Boutique", path: "/boutique" },
        { name: c.name, path: `/boutique/${c.slug}` },
      ],
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const category = getCategory(slug)!;
  return <ShopListing key={category.slug} category={category} />;
}
