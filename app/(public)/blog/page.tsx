import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { TopicGrid } from "@/components/blog/topic-grid";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCategories, getPublishedPosts } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog | The Technology Fiction",
  description:
    "Explore editorial technology writing across Salesforce, AI, career growth, tutorials, and entrepreneurship."
});

function normalizeQuery(value?: string) {
  return (value || "").trim().toLowerCase();
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const [allPosts, allCategories] = await Promise.all([getPublishedPosts(), getCategories()]);

  const searchQuery = normalizeQuery(q);
  const selectedTag = normalizeQuery(tag);

  const filteredPosts = allPosts.filter((post) => {
    const tagMatches = !selectedTag || post.tags.some((item) => item.slug === selectedTag);

    if (!tagMatches) return false;
    if (!searchQuery) return true;

    const haystack = [
      post.title,
      post.subtitle,
      post.excerpt,
      post.category.name,
      ...post.tags.map((item) => item.name),
      ...post.content.flatMap((node) => {
        switch (node.type) {
          case "paragraph":
          case "heading":
          case "blockquote":
            return [node.text];
          case "bulletList":
          case "orderedList":
            return node.items;
          case "codeBlock":
            return [node.code];
          case "callout":
            return [node.title, node.body];
          case "image":
            return [node.alt, node.caption || ""];
          case "video":
            return [node.title, node.caption || ""];
          default:
            return [];
        }
      })
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchQuery);
  });

  const featuredPost = filteredPosts[0] || allPosts[0];
  const listingPosts = filteredPosts.filter((post) => post.id !== featuredPost?.id);
  const activeTag =
    allCategories.flatMap(() => []) || undefined;

  return (
    <div className="pb-20">
      <Container className="pt-10 sm:pt-12 lg:pt-14">
        <Card className="glass-panel grid gap-8 overflow-hidden p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:p-10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blog</p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Searchable editorial writing for Salesforce, AI, and career growth
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Browse practical articles, tutorials, and strategic writing built for readers who want clarity, depth, and useful answers they can apply immediately.
            </p>

            <form action="/blog" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Search
                </span>
                <Input
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Search articles, ideas, topics, or frameworks"
                  className="pl-20"
                />
              </div>
              {tag ? <input type="hidden" name="tag" value={tag} /> : null}
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-medium text-white transition hover:bg-[#0f172a]"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition ${
                  !tag
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-slate-200 bg-white/80 text-slate-500 hover:border-accent/30 hover:text-accent"
                }`}
              >
                All topics
              </Link>
              {allCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 transition hover:border-accent/30 hover:text-accent"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {featuredPost && (
            <Card className="glass-panel border-white/50 p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {searchQuery || selectedTag ? "Best match" : "Featured story"}
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {featuredPost.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {featuredPost.category.name}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {featuredPost.readingTime} min read
                </span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="mt-5 inline-block text-sm font-medium text-accent">
                Read article
              </Link>
            </Card>
          )}
        </Card>
      </Container>

      <Container className="mt-12 sm:mt-14 lg:mt-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Browse by topic</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">Category clusters</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-500">
            Explore articles by subject so readers can move naturally between tutorials, strategic thinking, and adjacent topics.
          </p>
        </div>
        <TopicGrid categories={allCategories} />
      </Container>

      <Container className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest articles</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
                {searchQuery
                  ? `Results for “${q}”`
                  : selectedTag
                    ? `Posts tagged “${tag}”`
                    : "Recent writing"}
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"} found
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              {(listingPosts.length ? listingPosts : filteredPosts).map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">No match yet</p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">Try a broader search term</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                No articles matched that exact search. Try a broader phrase like Salesforce, AI, tutorial, integration, career, or entrepreneurship.
              </p>
              <Link href="/blog" className="mt-5 inline-block text-sm font-medium text-accent">
                Clear search and browse all articles
              </Link>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Explore</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">Find the right path faster</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use the search box to find tutorials, implementation ideas, architecture patterns, and practical career guidance without digging through unrelated content.
            </p>
            {(searchQuery || selectedTag) && (
              <Link href="/blog" className="mt-5 inline-block text-sm font-medium text-accent">
                Reset filters
              </Link>
            )}
          </Card>

          <Card className="glass-panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Popular directions</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["salesforce", "ai", "career", "tutorial", "integration", "entrepreneurship"].map((term) => (
                <Link
                  key={term}
                  href={`/blog?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 transition hover:border-accent/30 hover:text-accent"
                >
                  {term}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
