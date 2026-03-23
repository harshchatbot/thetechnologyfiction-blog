import Link from "next/link";
import { ExternalImage } from "@/components/blog/external-image";
import type { Post } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { isLegacyWordPressMediaUrl } from "@/lib/content/media";
import { formatDate } from "@/lib/utils/format";

export function ArticleHero({ post }: { post: Post }) {
  return (
    <section className="space-y-8">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{post.category.name}</Badge>
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              className="text-xs uppercase tracking-[0.18em] text-slate-400 hover:text-accent"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">{post.subtitle || post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>{post.author.name}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>Updated {formatDate(post.updatedAt)}</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
      {post.featuredImage && (
        <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-[#f4efe5] p-3 shadow-soft sm:p-4">
          <div className="flex items-center justify-center rounded-[1.5rem] bg-white/70">
            {isLegacyWordPressMediaUrl(post.featuredImage.url) ? (
              <ExternalImage
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                loading="eager"
                className="h-auto max-h-[70vh] w-full rounded-[1.5rem] object-contain"
              />
            ) : (
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="h-auto max-h-[70vh] w-full rounded-[1.5rem] object-contain"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
