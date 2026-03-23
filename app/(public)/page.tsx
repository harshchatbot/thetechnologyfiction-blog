import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/blog/article-card";
import { TopicGrid } from "@/components/blog/topic-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getHomePageData } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "The Technology Fiction | Premium technology editorial platform",
  description:
    "A modern editorial brand covering Salesforce, AI, career growth, tutorials, and entrepreneurship."
});

export default async function HomePage() {
  const { featuredPosts, latestPosts, categories } = await getHomePageData();
  const heroPost = featuredPosts[0] || latestPosts[0];

  return (
    <div className="pb-20">
      <Container className="pt-12 sm:pt-16">
        <Card className="relative overflow-hidden border-none bg-ink px-8 py-10 text-white sm:px-12 sm:py-14">
          <div className="absolute inset-0 bg-grid bg-[size:28px_28px] opacity-10" />
          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <Badge className="border-white/10 bg-white/10 text-white">
                Premium editorial technology platform
              </Badge>
              <div className="space-y-6">
                <h1 className="max-w-3xl font-[var(--font-serif)] text-5xl leading-none sm:text-7xl">
                  The Technology Fiction
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Sharp, trustworthy writing on Salesforce, AI, career growth,
                  technical execution, and entrepreneurship for builders who want signal over noise.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog">
                  <Button>Explore the blog</Button>
                </Link>
                <Link href="/category/salesforce">
                  <Button variant="secondary">Browse Salesforce</Button>
                </Link>
              </div>
            </div>
            <Card className="border border-white/10 bg-white/5 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Featured insight</p>
              {heroPost && (
                <div className="mt-6 space-y-5">
                  <Badge className="border-white/10 bg-white/10 text-white">
                    {heroPost.category.name}
                  </Badge>
                  <h2 className="text-3xl font-semibold leading-tight">{heroPost.title}</h2>
                  <p className="leading-7 text-slate-300">{heroPost.excerpt}</p>
                  <Link href={`/blog/${heroPost.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    Read article <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </Card>
      </Container>

      <Container className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest writing</p>
            <h2 className="mt-2 text-4xl font-semibold text-ink">Fresh articles for modern builders</h2>
          </div>
          <Link href="/blog" className="text-sm font-medium text-accent hover:text-ink">
            View all posts
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {latestPosts.slice(0, 3).map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </Container>

      <Container className="mt-20">
        <div className="mb-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Topical clusters</p>
          <h2 className="text-4xl font-semibold text-ink">Designed for topical authority and internal linking</h2>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            The platform is structured so the homepage, category archives, and article pages reinforce each other with clear pathways across themes.
          </p>
        </div>
        <TopicGrid categories={categories} />
      </Container>
    </div>
  );
}
