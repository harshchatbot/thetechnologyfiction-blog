import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { Badge } from "@/components/ui/badge";
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
        <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-white/40 shadow-soft">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
}
