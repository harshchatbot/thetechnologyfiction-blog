import Link from "next/link";
import type { Category, Post } from "@/types/content";
import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/blog/article-card";
import { TopicGrid } from "@/components/blog/topic-grid";
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
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#c7a45d]/15 blur-3xl" />
        <Container className="relative pt-24 pb-20 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bc80]">
              For Salesforce architects, developers, and career switchers
            </div>
            <h1 className="mt-8 font-[var(--font-serif)] text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">
              Stop Guessing.
              <br />
              Start Engineering.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              The Technology Fiction is a modern editorial platform for people
              building technical careers, shipping Salesforce systems, and
              learning to think with more depth, clarity, and leverage.
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-400">
              No fluff. No vanity content. Just sharp execution.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#newsletter"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#d8bc80] px-7 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-white"
              >
                Join Inner Circle
              </Link>
              <Link
                href="/blog"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Explore the blog
              </Link>
            </div>

            <div className="mt-16 border-t border-white/10 pt-8">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Read by technologists across teams like
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
                {trustSignals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="-mt-10 relative z-10">
        <div className="grid gap-4 rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-soft backdrop-blur md:grid-cols-2 xl:grid-cols-4 xl:p-8">
          {authorityStats.map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] bg-[#f7f2ea] p-5">
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
              className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-soft backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-steel">
                {pillar.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink">
                {pillar.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {pillar.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-700">
                {pillar.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200/80 bg-[#f9f6f1] px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={
                  index === 0
                    ? "/salesforce-coaching-ajmer"
                    : index === 1
                      ? "/blog"
                      : "/#newsletter"
                }
                className="mt-8 inline-flex text-sm font-semibold text-accent hover:text-ink"
              >
                {index === 0
                  ? "See mentorship details"
                  : index === 1
                    ? "Browse current articles"
                    : "Join the newsletter"}
              </Link>
            </section>
          ))}
        </div>
      </Container>

      <section className="mt-20 bg-[#0b1627] py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
              Technical deep dives
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              The main website builds demand. The blog earns trust.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              This architecture keeps your root brand focused on positioning,
              mentorship, and audience capture while the blog powers topical
              authority, internal linking, and long-tail discovery.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredGuideTopics.map((topic) => (
              <Link
                key={topic.title}
                href={topic.href}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:border-[#d8bc80]/40"
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
              </Link>
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
          <Link href="/blog" className="text-sm font-semibold text-accent hover:text-ink">
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
          className="rounded-[2rem] bg-[#121f33] px-8 py-10 text-white shadow-soft sm:px-12 sm:py-14"
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
                Inner Circle
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight">
                Join the weekly signal stream for Salesforce, AI, and career
                growth.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Use the root site to capture demand, then convert that audience
                into repeat readers and future clients. For now, the fastest
                route is direct contact while the longer-term email stack is
                finalized inside the platform.
              </p>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
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
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Chat on WhatsApp
              </a>
              <p className="text-xs leading-6 text-slate-400">
                This keeps the experience production-safe today while leaving
                room to connect a dedicated email platform later without
                reworking the homepage architecture.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
