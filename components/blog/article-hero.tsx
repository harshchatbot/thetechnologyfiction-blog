import Link from "next/link";
import { ExternalImage } from "@/components/blog/external-image";
import type { Post } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

export function ArticleHero({ post }: { post: Post }) {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="space-y-4 sm:space-y-5">
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
        <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {post.subtitle || post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span>{post.author.name}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>Updated {formatDate(post.updatedAt)}</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
      {post.featuredImage && (
        <div className="overflow-hidden rounded-[1.5rem] border border-white/40 bg-[#f4efe5] p-2 shadow-soft sm:rounded-[2rem] sm:p-4">
          <div className="flex items-center justify-center rounded-[1.5rem] bg-white/70">
            <ExternalImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              loading="eager"
              className="h-auto max-h-[60vh] w-full rounded-[1.1rem] object-contain sm:max-h-[70vh] sm:rounded-[1.5rem]"
            />
          </div>
        </div>
      )}
    </section>
  );
}
