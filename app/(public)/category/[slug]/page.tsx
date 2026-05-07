import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/layout/json-ld";
import { Card } from "@/components/ui/card";
import { getCategories, getCategoryBySlug, getPostsByCategory } from "@/lib/content/repository";
import { getCategoryHubContent, getCategorySummary } from "@/lib/content/presentation";
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
  const hubContent = getCategoryHubContent(category);

  return (
    <div className="pb-20">
      <Container className="pt-14">
        <JsonLd data={categoryJsonLd(category, posts.length)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: category.name, path: `/category/${category.slug}` }
          ])}
        />
        <Card className="glass-panel p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Topic</p>
          <h1 className="mt-3 text-5xl font-semibold text-ink">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {getCategorySummary(category)}
          </p>
          <p className="mt-6 text-sm text-slate-500">{posts.length} published articles</p>
        </Card>
      </Container>

      <Container className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Topic guide</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
              How to use this category
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              {hubContent.intro}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
              {hubContent.bullets.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-[#fbfaf7] px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Related paths</p>
            <div className="mt-4 space-y-3">
              {hubContent.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl border border-slate-200 bg-[#fbfaf7] px-4 py-4 text-sm font-medium text-ink transition hover:border-accent/30 hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>

          {posts[0] ? (
            <Card className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Start here</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{posts[0].title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{posts[0].excerpt}</p>
              <Link
                href={`/blog/${posts[0].slug}`}
                className="mt-5 inline-block text-sm font-medium text-accent hover:text-ink"
              >
                Read this article
              </Link>
            </Card>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
