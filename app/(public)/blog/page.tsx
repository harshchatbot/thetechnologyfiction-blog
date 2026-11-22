import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogSearchPanel } from "@/components/blog/blog-search-panel";
import { Container } from "@/components/layout/container";
import { ExternalImage } from "@/components/blog/external-image";
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

  const featuredPost = filteredPosts[0];
  const listingPosts = filteredPosts.slice(1);
  return <main className="pb-20">
    <section className="bg-[#191b1e] py-14 text-[#f5f3ef] sm:py-20 lg:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6d88b]">The journal / Insights & tutorials</p>
        <h1 className="mt-5 max-w-5xl font-[var(--font-serif)] text-[clamp(3.25rem,8vw,7rem)] leading-[1.04] tracking-[-0.05em]">Read. Think.<br /><span className="italic text-[#c6d88b]">Build.</span></h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">Salesforce, engineering, AI, and career lessons from practical experience.</p>
      </Container>
    </section>
    <Container className="pt-10 sm:pt-14">
      <div className="border-b border-slate-300 pb-8"><BlogSearchPanel categories={allCategories} defaultQuery={q || ""} selectedTag={tag || ""} /></div>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[var(--font-serif)] text-3xl text-ink sm:text-5xl">{searchQuery ? `Results for “${q}”` : selectedTag ? `Tagged “${tag}”` : "Latest stories"}</h2>
        <p className="text-sm text-slate-500">{filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}</p>
      </div>
      {featuredPost ? <>
        <article className="mt-8 grid gap-6 border-b border-slate-300 pb-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <Link href={`/blog/${featuredPost.slug}`} className="group block aspect-[16/10] overflow-hidden bg-[#e7e6e0]">
            {featuredPost.featuredImage ? <ExternalImage src={featuredPost.featuredImage.url} alt={featuredPost.featuredImage.alt} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center bg-[#272a2f] font-[var(--font-serif)] text-5xl italic text-[#c6d88b]">TTF.</div>}
          </Link>
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667b36]">{featuredPost.category.name} / Featured</p><h3 className="mt-4 font-[var(--font-serif)] text-3xl leading-tight text-ink sm:text-4xl"><Link href={`/blog/${featuredPost.slug}`} className="hover:text-[#667b36]">{featuredPost.title}</Link></h3><p className="mt-4 line-clamp-3 leading-8 text-slate-600">{featuredPost.excerpt}</p><Link href={`/blog/${featuredPost.slug}`} className="mt-6 inline-block border-b border-ink pb-2 text-sm font-semibold">Read article ↗</Link></div>
        </article>
        <div className="mt-9 grid gap-x-12 gap-y-7 lg:grid-cols-2">{listingPosts.map(post => <ArticleCard key={post.id} post={post} />)}</div>
      </> : <div className="py-16"><p className="text-lg text-slate-600">No articles matched your search.</p><Link href="/blog" className="mt-5 inline-block border-b border-ink pb-1 font-semibold">Clear filters ↗</Link></div>}
    </Container>
  </main>;
}
