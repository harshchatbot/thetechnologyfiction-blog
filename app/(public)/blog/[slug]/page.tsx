import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/blog/article-hero";
import { CommentSection } from "@/components/blog/comment-section";
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

  const { post, toc, comments, relatedPosts, previousPost, nextPost } = data;

  return (
    <div className="pb-20">
      <ReadingProgress />
      <Container className="pt-8 sm:pt-10 lg:pt-12">
        <JsonLd data={articleJsonLd(post)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])}
        />

        <ArticleHero post={post} />

        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div className="min-w-0 space-y-6 sm:space-y-8">
            <div className="lg:hidden">
              <TableOfContents items={toc} />
            </div>
            <RichContentRenderer content={post.content} />
            <Card className="overflow-hidden p-4 sm:p-6">
              <SocialShare slug={post.slug} title={post.title} />
            </Card>
            <CommentSection post={post} comments={comments} />
            <div className="grid gap-4 md:grid-cols-2">
              {previousPost ? (
                <Link href={`/blog/${previousPost.slug}`} className="rounded-[2rem] border border-slate-200 bg-white/70 p-4 transition hover:border-accent/30 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Previous article</p>
                  <p className="mt-3 text-base font-semibold leading-7 text-ink sm:text-lg">{previousPost.title}</p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="rounded-[2rem] border border-slate-200 bg-white/70 p-4 transition hover:border-accent/30 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next article</p>
                  <p className="mt-3 text-base font-semibold leading-7 text-ink sm:text-lg">{nextPost.title}</p>
                </Link>
              )}
            </div>
            <RelatedPosts posts={relatedPosts} />
          </div>

          <div className="hidden space-y-6 lg:block">
            <TableOfContents items={toc} />
          </div>
        </div>
      </Container>
    </div>
  );
}
