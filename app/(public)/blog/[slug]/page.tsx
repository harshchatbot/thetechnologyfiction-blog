import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleHero } from "@/components/blog/article-hero";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { RichContentRenderer } from "@/components/blog/rich-content-renderer";
import { SocialShare } from "@/components/blog/social-share";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/layout/json-ld";
import { Card } from "@/components/ui/card";
import { getPostPageData, getPublishedPosts } from "@/lib/content/repository";
import { buildPostMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPostPageData(slug);
  if (!data) return {};
  return buildPostMetadata(data.post);
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostPageData(slug);

  if (!data) notFound();

  const { post, toc, relatedPosts, previousPost, nextPost } = data;

  return (
    <div className="pb-20">
      <ReadingProgress />
      <Container className="pt-12">
        <JsonLd data={articleJsonLd(post)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])}
        />

        <ArticleHero post={post} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            <RichContentRenderer content={post.content} />
            <AdSlot className="min-h-[180px]" />
            <Card className="p-6">
              <SocialShare slug={post.slug} title={post.title} />
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {previousPost ? (
                <Link href={`/blog/${previousPost.slug}`} className="rounded-[2rem] border border-slate-200 bg-white/70 p-5 hover:border-accent/30">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Previous article</p>
                  <p className="mt-3 text-lg font-semibold text-ink">{previousPost.title}</p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="rounded-[2rem] border border-slate-200 bg-white/70 p-5 hover:border-accent/30">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next article</p>
                  <p className="mt-3 text-lg font-semibold text-ink">{nextPost.title}</p>
                </Link>
              )}
            </div>
            <RelatedPosts posts={relatedPosts} />
          </div>

          <div className="space-y-6">
            <TableOfContents items={toc} />
            <AdSlot className="hidden min-h-[280px] lg:block" />
          </div>
        </div>
      </Container>
    </div>
  );
}
