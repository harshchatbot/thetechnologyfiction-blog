import type { Metadata } from "next";
import type { Category, Post } from "@/types/content";
import { siteConfig } from "@/lib/content/site-config";
import { absoluteUrl } from "@/lib/utils/format";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || siteConfig.organizationLogo;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export function buildPostMetadata(post: Post): Metadata {
  const title = post.seo.seoTitle || post.title;
  const description = post.seo.seoDescription || post.excerpt;
  const canonical = post.seo.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);
  const image = post.seo.ogImage || post.featuredImage?.url;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.siteName,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      section: post.category.name,
      tags: post.tags.map((tag) => tag.name),
      images: image ? [{ url: image }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
      images: image ? [image] : undefined
    }
  };
}

export function buildCategoryMetadata(category: Category): Metadata {
  return buildMetadata({
    title: `${category.name} Articles | ${siteConfig.siteName}`,
    description: category.description,
    path: `/category/${category.slug}`
  });
}
