import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { TopicGrid } from "@/components/blog/topic-grid";
import { AdSlot } from "@/components/ads/ad-slot";
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

export default async function BlogPage() {
  const [allPosts, allCategories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const featuredPost = allPosts[0];

  return (
    <div className="pb-20">
      <Container className="pt-14">
        <Card className="glass-panel grid gap-10 overflow-hidden p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Journal</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-ink">
              Thoughtful writing for people building real technical leverage
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Explore Salesforce, AI, career growth, tutorials, and entrepreneurship through deep dives designed for readability, internal discovery, and long-term search relevance.
            </p>
            <div className="relative max-w-xl">
              <span className="absolute left-4 top-3.5 text-xs uppercase tracking-[0.18em] text-slate-400">
                Find
              </span>
              <Input
                placeholder="Search article ideas, topics, or frameworks"
                className="pl-16"
                disabled
              />
            </div>
          </div>

          {featuredPost && (
            <Card className="glass-panel border-white/50 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Featured story</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink">{featuredPost.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{featuredPost.excerpt}</p>
              <Link href={`/blog/${featuredPost.slug}`} className="mt-5 inline-block text-sm font-medium text-accent">
                Read featured story
              </Link>
            </Card>
          )}
        </Card>
      </Container>

      <Container className="mt-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Browse by topic</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Topic clusters</h2>
        </div>
        <TopicGrid categories={allCategories} />
      </Container>

      <Container className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6 md:grid-cols-2">
          {allPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        <div className="space-y-6">
          <AdSlot slotKey="blogHubSidebar" className="min-h-[280px]" />
          <Card className="glass-panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Inner Circle</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">Build your topical authority</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Get practical thinking on technical execution, sharper career decisions, and the systems behind durable content businesses.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}
