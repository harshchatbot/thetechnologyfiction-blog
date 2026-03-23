import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/layout/json-ld";
import { Card } from "@/components/ui/card";
import { getCategories, getCategoryBySlug, getPostsByCategory } from "@/lib/content/repository";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, categoryJsonLd } from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildCategoryMetadata(category);
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug)
  ]);

  if (!category) notFound();

  return (
    <div className="pb-20">
      <Container className="pt-14">
        <JsonLd data={categoryJsonLd(category, posts.length)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.name, path: `/category/${category.slug}` }
          ])}
        />
        <Card className="p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Category archive</p>
          <h1 className="mt-3 text-5xl font-semibold text-ink">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{category.description}</p>
          <p className="mt-6 text-sm text-slate-500">{posts.length} published articles</p>
        </Card>
      </Container>

      <Container className="mt-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
