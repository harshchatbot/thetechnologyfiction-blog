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

export default async function BlogPage() {
  const [allPosts, allCategories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const featuredPost = allPosts[0];

  return (
    <div className="pb-20">
      <Container className="pt-10 sm:pt-12 lg:pt-14">
        <Card className="glass-panel grid gap-8 overflow-hidden p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Journal</p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Thoughtful writing for people building real technical leverage
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
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
            <Card className="glass-panel border-white/50 p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Featured story</p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {featuredPost.excerpt}
              </p>
              <Link href={`/blog/${featuredPost.slug}`} className="mt-5 inline-block text-sm font-medium text-accent">
                Read featured story
              </Link>
            </Card>
          )}
        </Card>
      </Container>

      <Container className="mt-12 sm:mt-14 lg:mt-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Browse by topic</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">Topic clusters</h2>
        </div>
        <TopicGrid categories={allCategories} />
      </Container>

      <Container className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {allPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        <div className="space-y-6">
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
