import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogSearchPanel } from "@/components/blog/blog-search-panel";
import { Container } from "@/components/layout/container";
import { getCategories, getPublishedPosts } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog | The Technology Fiction",
  description:
    "Explore editorial technology writing across Salesforce, AI, career growth, tutorials, and entrepreneurship."
});

function normalizeQuery(value?: string) {
  return (value || "").trim().toLowerCase();
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const [allPosts, allCategories] = await Promise.all([getPublishedPosts(), getCategories()]);

  const searchQuery = normalizeQuery(q);
  const selectedTag = normalizeQuery(tag);

  const filteredPosts = allPosts.filter((post) => {
    const tagMatches = !selectedTag || post.tags.some((item) => item.slug === selectedTag);

    if (!tagMatches) return false;
    if (!searchQuery) return true;

    const haystack = [
      post.title,
      post.subtitle,
      post.excerpt,
      post.category.name,
      ...post.tags.map((item) => item.name),
      ...post.content.flatMap((node) => {
        switch (node.type) {
          case "paragraph":
          case "heading":
          case "blockquote":
            return [node.text];
          case "bulletList":
          case "orderedList":
            return node.items;
          case "codeBlock":
            return [node.code];
          case "callout":
            return [node.title, node.body];
          case "image":
            return [node.alt, node.caption || ""];
          case "video":
            return [node.title, node.caption || ""];
          default:
            return [];
        }
      })
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchQuery);
  });

  return <div className="pb-24"><Container className="py-14 sm:py-20"><p className="ttf-eyebrow">The journal / Salesforce & beyond</p><h1 className="mt-5 text-6xl leading-none sm:text-8xl">Ideas worth building on.</h1><p className="ttf-muted mt-6 max-w-xl leading-8">Practical Salesforce tutorials, interview preparation, AI, and career insights.</p><div className="mt-10"><BlogSearchPanel categories={allCategories} defaultQuery={q||""} selectedTag={tag||""}/></div><div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-b pb-5" style={{borderColor:"var(--line)"}}><h2 className="text-4xl sm:text-5xl">{searchQuery?`Results for “${q}”`:"Latest articles"}</h2><span className="ttf-muted text-sm">{filteredPosts.length} articles</span></div>{filteredPosts.length?<div className="mt-9 grid gap-x-12 gap-y-8 md:grid-cols-2">{filteredPosts.map(post=><ArticleCard key={post.id} post={post}/>)}</div>:<div className="py-16"><h3 className="text-4xl">No matching articles yet.</h3><p className="ttf-muted mt-3">Try a broader term or explore all topics.</p><Link href="/blog" className="ttf-button mt-6">Clear filters ↗</Link></div>}</Container></div>;
}
