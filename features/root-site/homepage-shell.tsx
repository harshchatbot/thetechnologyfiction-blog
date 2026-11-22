import type { Category, Post } from "@/types/content";
import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogSearchPanel } from "@/components/blog/blog-search-panel";
import { TopicGrid } from "@/components/blog/topic-grid";
import { TrackedLink } from "@/components/analytics/tracked-link";

type HomepageShellProps = {
  latestPosts: Post[];
  categories: Category[];
};

export function HomepageShell({
  latestPosts,
  categories
}: HomepageShellProps) {
  const featuredPost = latestPosts[0];
  const recentPosts = featuredPost
    ? latestPosts.filter((post) => post.id !== featuredPost.id).slice(0, 6)
    : latestPosts.slice(0, 6);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[#1a1c20] text-[#f5f3ef]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end">
            <div id="about" className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#c6d88b]">
                Salesforce learning · AI · Engineering
              </p>
              <h1 className="mt-4 font-[var(--font-serif)] text-4xl leading-tight text-[#f5f3ef] sm:text-5xl lg:text-6xl">
                Learn Salesforce. Build real skills. Grow with confidence.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#c5c8ca] sm:text-lg">
                Practical Salesforce learning, thoughtful technical articles, and tools for people who want to build—not just follow tutorials.
              </p>
              <div className="mt-8 max-w-3xl">
                <BlogSearchPanel categories={categories} />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedLink
                  href="/salesforce-coaching-ajmer"
                  eventName="training_cta_click"
                  eventParams={{ placement: "homepage_hero" }}
                  className="inline-flex items-center justify-center rounded-full bg-[#c6d88b] px-6 py-3 text-sm font-semibold text-[#17191c] transition hover:bg-[#dbe9ac]"
                >
                  Explore Salesforce training
                </TrackedLink>
                <TrackedLink
                  href="/blog"
                  eventName="blog_cta_click"
                  eventParams={{ placement: "homepage_hero_secondary" }}
                  className="inline-flex items-center justify-center rounded-full border border-[#6b7078] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#c6d88b]"
                >
                  Read the blog
                </TrackedLink>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[#272a2f] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[#aeb5bd]">
                Why learn here
              </p>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-[#f5f3ef]">Guided by industry experience</p>
                  <p className="mt-2 text-sm leading-7 text-[#c5c8ca]">
                    Learn from an experienced IT and Salesforce professional with over a decade of enterprise project experience.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f5f3ef]">Built for curious builders</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Fresh graduates, career switchers, admins, and developers ready for practical learning.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f5f3ef]">Learn by doing</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Explore Apex, LWC, integrations, and real project thinking—without unrealistic placement promises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container id="products" className="mt-16 scroll-mt-28">
        <div className="border-y border-slate-300/70 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Practice what you learn</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Learn here. Practice on OrgReady.</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Reading is a start. Put your Salesforce knowledge into practice with OrgReady,
            a dedicated place to explore hands-on practice.
          </p>
          <a
            href="https://orgready.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Practice on OrgReady ↗
          </a>
        </div>
      </Container>

      {featuredPost ? (
        <Container className="mt-14 sm:mt-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
            <TrackedLink
              href={`/blog/${featuredPost.slug}`}
              eventName="homepage_featured_topic_click"
              eventParams={{
                topic_title: featuredPost.title,
                topic_category: featuredPost.category.name
              }}
              className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent/30"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Featured post
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
                {featuredPost.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {featuredPost.category.name}
                </span>
                <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {featuredPost.readingTime} min read
                </span>
              </div>
              <span className="mt-6 inline-flex text-sm font-semibold text-accent">
                Read article
              </span>
            </TrackedLink>

            <section
              id="newsletter"
              className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-soft"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Stay in touch
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">
                Want sharper Salesforce and AI notes?
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Join the Inner Circle for thoughtful technical writing, useful updates, and career-focused signal.
              </p>
              <div className="mt-6 space-y-3">
                <TrackedLink
                  href="/#newsletter"
                  eventName="newsletter_cta_click"
                  eventParams={{ placement: "homepage_sidecard" }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Join Inner Circle
                </TrackedLink>
                <TrackedLink
                  href="/salesforce-coaching-ajmer"
                  eventName="homepage_pillar_cta_click"
                  eventParams={{ pillar_id: "coaching", placement: "homepage_sidecard" }}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
                >
                  View coaching
                </TrackedLink>
              </div>
            </section>
          </div>
        </Container>
      ) : null}

      <Container id="topics" className="mt-16 scroll-mt-28">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-steel">
              Topics
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Browse by category
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Start with the topic that matches what you care about most, then move into the articles that matter.
          </p>
        </div>
        <TopicGrid categories={categories} />
      </Container>

      <Container id="latest" className="mt-16 scroll-mt-28">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-steel">
              Latest posts
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-ink">
              Recent writing from the blog
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              A simple stream of articles you can open and read without digging through a heavy landing page.
            </p>
          </div>
          <TrackedLink
            href="/blog"
            eventName="blog_cta_click"
            eventParams={{ placement: "homepage_latest_writing" }}
            className="text-sm font-semibold text-accent hover:text-ink"
          >
            View all posts
          </TrackedLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recentPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
