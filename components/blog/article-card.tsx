import Link from "next/link";
import { ExternalImage } from "@/components/blog/external-image";
import type { Post } from "@/types/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Card className="group overflow-hidden border border-white/60 bg-white/72 transition duration-500 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.featuredImage && (
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#f4efe5] p-3">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d8bc80]/10 via-transparent to-[#4f87c5]/10 opacity-0 transition duration-500 group-hover:opacity-100" />
            <ExternalImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.05]"
            />
          </div>
        )}
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{post.category.name}</Badge>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-tight text-ink transition duration-300 group-hover:text-accent sm:text-2xl">
              {post.title}
            </h3>
            <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{post.author.name}</span>
            <span className="transition duration-300 group-hover:text-accent">
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
