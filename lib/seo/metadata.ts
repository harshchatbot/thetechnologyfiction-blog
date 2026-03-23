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
  return buildMetadata({
    title: post.seo.seoTitle || post.title,
    description: post.seo.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.seo.ogImage || post.featuredImage?.url
  });
}

export function buildCategoryMetadata(category: Category): Metadata {
  return buildMetadata({
    title: `${category.name} Articles | ${siteConfig.siteName}`,
    description: category.description,
    path: `/category/${category.slug}`
  });
}
