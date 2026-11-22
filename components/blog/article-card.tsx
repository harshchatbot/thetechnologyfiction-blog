"use client";
import Link from "next/link";
import { ExternalImage } from "@/components/blog/external-image";
import type { Post } from "@/types/content";
import { editorialTopic } from "@/lib/content/editorial-topics";
import { formatDate } from "@/lib/utils/format";
import { trackEvent } from "@/lib/analytics/gtag";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="editorial-reveal group min-w-0 border-b border-border pb-7">
      <Link href={`/blog/${post.slug}`} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(120px,34%)] sm:items-center sm:gap-6" onClick={() => trackEvent("blog_article_click", { article_slug: post.slug, article_title: post.title, article_category: post.category.name })}>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{editorialTopic(post)} <span className="mx-2 text-slate-300">/</span> <span className="font-normal text-steel">{formatDate(post.publishedAt)}</span></p>
          <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl lg:text-[1.7rem]">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-steel">{post.excerpt}</p>
          <p className="mt-3 text-xs text-steel">{post.readingTime} min read</p>
        </div>
        {post.featuredImage && <div className="order-first aspect-[16/10] overflow-hidden bg-[var(--card)] sm:order-last"><ExternalImage src={post.featuredImage.url} alt={post.featuredImage.alt} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.035]" /></div>}
      </Link>
    </article>
  );
}
