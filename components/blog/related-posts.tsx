import { ArticleCard } from "@/components/blog/article-card";
import type { Post } from "@/types/content";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Keep reading</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Related articles</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
