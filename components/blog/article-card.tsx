import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.featuredImage && (
          <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#f4efe5] p-3">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              width={1200}
              height={750}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Badge>{post.category.name}</Badge>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold leading-tight text-ink">{post.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{post.author.name}</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
