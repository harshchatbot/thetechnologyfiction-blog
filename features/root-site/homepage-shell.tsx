import Link from "next/link";
import type { Category, Post } from "@/types/content";
import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/blog/article-card";
import { TopicGrid } from "@/components/blog/topic-grid";
import { TrackedLink } from "@/components/analytics/tracked-link";
import {
  authorityStats,
  featuredGuideTopics,
  roadmapPillars,
  trustSignals
} from "@/features/root-site/content";

type HomepageShellProps = {
  latestPosts: Post[];
  categories: Category[];
};

export function HomepageShell({
  latestPosts,
  categories
}: HomepageShellProps) {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="float-soft absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#c7a45d]/15 blur-3xl" />
        <div className="float-soft absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-[#4f87c5]/10 blur-3xl [animation-delay:1.5s]" />
        <div className="hero-orbit absolute left-[12%] top-[28%] h-32 w-32 rounded-full border border-white/10" />
        <div className="hero-orbit absolute right-[14%] top-[18%] h-20 w-20 rounded-full border border-[#d8bc80]/30 [animation-delay:2s]" />
        <Container className="relative pt-24 pb-20 sm:pt-28 sm:pb-24">
          <div className="grid items-end gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:text-left">
            <div className="mx-auto max-w-5xl text-center xl:mx-0 xl:text-left">
              <div className="glass-panel-dark fade-up inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bc80]">
                For Salesforce architects, developers, and career switchers
              </div>
              <h1 className="fade-up fade-up-delay-1 mt-8 font-[var(--font-serif)] text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">
                Stop Guessing.
                <br />
                Start Engineering.
              </h1>
              <p className="fade-up fade-up-delay-2 mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                The Technology Fiction is a modern editorial platform for people
                building technical careers, shipping Salesforce systems, and
                learning to think with more depth, clarity, and leverage.
              </p>
              <p className="fade-up fade-up-delay-2 mt-4 text-sm uppercase tracking-[0.24em] text-slate-400">
                No fluff. No vanity content. Just sharp execution.
              </p>
              <div className="fade-up fade-up-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row xl:items-start">
                <TrackedLink
                  href="/#newsletter"
                  eventName="newsletter_cta_click"
                  eventParams={{ placement: "homepage_hero" }}
                  className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#d8bc80] px-7 py-3 text-sm font-semibold text-[#07111f] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Join Inner Circle
                </TrackedLink>
                <TrackedLink
                  href="/blog"
                  eventName="blog_cta_click"
                  eventParams={{ placement: "homepage_hero" }}
                  className="glass-panel-dark inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/5"
                >
                  Explore the blog
                </TrackedLink>
              </div>
            </div>

            <div className="fade-up fade-up-delay-3 mx-auto w-full max-w-xl xl:mx-0">
              <div className="glass-panel-dark rounded-[2rem] border border-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
                  Editorial focus
                </p>
                <div className="mt-6 space-y-5">
                  {[
                    {
                      title: "Salesforce systems thinking",
                      body: "Architecture, migration, security, Apex, LWC, and practical execution notes from real delivery work."
                    },
                    {
                      title: "AI with grounded judgment",
                      body: "Useful AI workflows, implementation patterns, and decision-making frameworks without hype-heavy shortcuts."
                    },
                    {
                      title: "Career leverage for technical builders",
                      body: "Roadmaps, credibility systems, and sharper thinking for people moving toward senior technical roles."
                    }
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                    >
                      <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl text-center">
            <div className="fade-up fade-up-delay-3 border-t border-white/10 pt-8">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Read by technologists across teams like
              </p>
              <div className="marquee-shell mt-6">
                <div className="marquee-track">
                  {[...trustSignals, ...trustSignals].map((signal, index) => (
                    <span
                      key={`${signal}-${index}`}
                      className="inline-flex items-center gap-3 px-6 text-sm font-semibold uppercase tracking-[0.28em] text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d8bc80]" />
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="-mt-10 relative z-10">
        <div className="glass-panel grid gap-4 rounded-[2rem] border border-slate-200/70 p-6 md:grid-cols-2 xl:grid-cols-4 xl:p-8">
          {authorityStats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel fade-up rounded-[1.5rem] border border-white/50 bg-[#f7f2ea]/70 p-5"
            >
              <div className="text-3xl font-semibold text-ink">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="mt-20">
        <div className="grid gap-6 xl:grid-cols-3">
          {roadmapPillars.map((pillar, index) => (
            <section
              key={pillar.id}
              id={pillar.id}
              className="glass-panel fade-up group scroll-mt-28 rounded-[2rem] border border-slate-200/80 p-8 transition duration-500 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-steel">
                {pillar.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink transition duration-300 group-hover:text-accent">
                {pillar.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {pillar.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-700">
                {pillar.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200/80 bg-[#f9f6f1]/80 px-4 py-3 transition hover:border-accent/30 hover:bg-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <TrackedLink
                href={
                  index === 0
                    ? "/salesforce-coaching-ajmer"
                    : index === 1
                      ? "/blog"
                      : "/#newsletter"
                }
                eventName="homepage_pillar_cta_click"
                eventParams={{
                  pillar_id: pillar.id,
                  placement: "homepage_pillars"
                }}
                className="mt-8 inline-flex text-sm font-semibold text-accent hover:text-ink"
              >
                {index === 0
                  ? "See mentorship details"
                  : index === 1
                    ? "Browse current articles"
                    : "Join the newsletter"}
              </TrackedLink>
            </section>
          ))}
        </div>
      </Container>

      <section className="mt-20 overflow-hidden bg-[#0b1627] py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
              Technical deep dives
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              A modern publication for builders who value clarity over noise.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Articles, topic hubs, mentorship pathways, and editorial brand
              positioning now live in one system designed to feel credible,
              sharp, and intentionally modern.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredGuideTopics.map((topic) => (
              <TrackedLink
                key={topic.title}
                href={topic.href}
                eventName="homepage_featured_topic_click"
                eventParams={{
                  topic_title: topic.title,
                  topic_category: topic.category
                }}
                className="glass-panel-dark fade-up rounded-[2rem] border border-white/10 p-8 transition hover:-translate-y-1 hover:border-[#d8bc80]/40"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
                  {topic.category}
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  {topic.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {topic.description}
                </p>
              </TrackedLink>
            ))}
          </div>
        </Container>
      </section>

      <Container className="mt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-steel">
              Latest writing
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-ink">
              Fresh articles from the blog
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Imported WordPress content and future native posts both flow into
              the same editorial system, so your homepage can surface the most
              relevant thinking without splitting the brand.
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
        <div className="grid gap-6 lg:grid-cols-3">
          {latestPosts.slice(0, 3).map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </Container>

      <Container className="mt-20">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-steel">
            Topic clusters
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-ink">
            Build topical authority with clear paths between categories.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Categories are part of the root-site information architecture, not
            an isolated blog taxonomy. They help visitors move between themes,
            services, and detailed articles naturally.
          </p>
        </div>
        <TopicGrid categories={categories} />
      </Container>

      <Container className="mt-20">
        <section
          id="newsletter"
          className="glass-panel scroll-mt-28 rounded-[2rem] border border-white/60 px-8 py-10 text-ink sm:px-12 sm:py-14"
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
                Inner Circle
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink">
                Join the weekly signal stream for Salesforce, AI, and career
                growth.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
                Get thoughtful breakdowns on Salesforce architecture, AI, and
                career growth. The current signup flow is intentionally lean so
                you can request access immediately while the full newsletter
                stack evolves.
              </p>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-white/15 bg-[#0b1524]/85 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.28)]">
              <a
                href="mailto:hello@thetechnologyfiction.com?subject=Join%20Inner%20Circle"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#d8bc80] px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-white"
              >
                Request newsletter access
              </a>
              <a
                href="https://wa.me/917976111087"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                Chat on WhatsApp
              </a>
              <p className="text-xs leading-6 text-slate-300">
                This opens a clean request path today and keeps the experience
                ready for a dedicated email platform later.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
